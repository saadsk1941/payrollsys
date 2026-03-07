from datetime import date

from django.db.models import Count, Sum
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasPageAccess
from attendance.models import Attendance
from employees.models import Employee
from employees.utils import scoped_employee_queryset
from leave_management.models import Leave
from payroll.models import Payroll

class DashboardSummaryView(APIView):
    permission_classes = [HasPageAccess]
    required_page = 'dashboard'

    def get(self, request):
        user = request.user
        has_global_access = user.role in ('SUPERVISOR', 'ADMIN')
        today = date.today()
        month_start = date(today.year, today.month, 1)

        employees_qs = Employee.objects.all()
        attendance_qs = Attendance.objects.all()
        leave_qs = Leave.objects.all()
        payroll_qs = Payroll.objects.filter(month=month_start)

        if not has_global_access:
            employees_qs = scoped_employee_queryset(user)
            employee_ids = employees_qs.values_list('id', flat=True)
            attendance_qs = attendance_qs.filter(employee_id__in=employee_ids)
            leave_qs = leave_qs.filter(employee_id__in=employee_ids)
            payroll_qs = payroll_qs.filter(employee_id__in=employee_ids)

        employees_count = employees_qs.count()
        present_today = attendance_qs.filter(date=today, status='PRESENT').count()
        on_leave_today = leave_qs.filter(status='APPROVED', from_date__lte=today, to_date__gte=today).count()

        total_payroll = payroll_qs.aggregate(total=Sum('net_salary'))['total'] or 0

        attendance_counts = attendance_qs.values('status').annotate(count=Count('id')).order_by('status')

        return Response(
            {
                'employees_count': employees_count,
                'present_today': present_today,
                'on_leave_today': on_leave_today,
                'total_payroll_this_month': total_payroll,
                'attendance_stats': list(attendance_counts),
            }
        )
