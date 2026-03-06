from datetime import date

from django.db.models import Count, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from attendance.models import Attendance
from employees.models import Employee
from leave_management.models import Leave
from payroll.models import Payroll

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        month_start = date(today.year, today.month, 1)

        employees_count = Employee.objects.count()
        present_today = Attendance.objects.filter(date=today, status='PRESENT').count()
        on_leave_today = Leave.objects.filter(
            status='APPROVED', from_date__lte=today, to_date__gte=today
        ).count()

        total_payroll = (
            Payroll.objects.filter(month=month_start).aggregate(total=Sum('net_salary'))['total']
            or 0
        )

        attendance_counts = (
            Attendance.objects.values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )

        return Response(
            {
                'employees_count': employees_count,
                'present_today': present_today,
                'on_leave_today': on_leave_today,
                'total_payroll_this_month': total_payroll,
                'attendance_stats': list(attendance_counts),
            }
        )

from django.shortcuts import render