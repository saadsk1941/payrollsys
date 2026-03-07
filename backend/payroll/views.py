from datetime import date

from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.permissions import RoleBasedRecordPermission
from employees.utils import scoped_employee_queryset
from .models import Payroll
from .serializers import PayrollSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer
    permission_classes = [RoleBasedRecordPermission]
    required_page = 'payroll'

    def _has_global_access(self):
        return self.request.user.role in ('SUPERVISOR', 'ADMIN')

    def get_queryset(self):
        if self._has_global_access():
            return super().get_queryset()
        employee_ids = scoped_employee_queryset(self.request.user).values_list('id', flat=True)
        return super().get_queryset().filter(employee_id__in=employee_ids)

    def _validate_employee_owner(self, employee):
        if self._has_global_access():
            return
        if employee.user_id != self.request.user.id:
            raise PermissionDenied('You can only access your own records.')

    def perform_create(self, serializer):
        employee = serializer.validated_data.get('employee')
        self._validate_employee_owner(employee)
        serializer.save()

    def perform_update(self, serializer):
        employee = serializer.validated_data.get('employee', serializer.instance.employee)
        self._validate_employee_owner(employee)
        serializer.save()

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Return total payroll for current month."""
        today = date.today()
        month_start = date(today.year, today.month, 1)
        payroll_qs = Payroll.objects.filter(month=month_start)
        if not self._has_global_access():
            employee_ids = scoped_employee_queryset(request.user).values_list('id', flat=True)
            payroll_qs = payroll_qs.filter(employee_id__in=employee_ids)
        total = (
            payroll_qs.aggregate(total_net=Sum('net_salary'))['total_net']
            or 0
        )
        return Response({'month': month_start.strftime('%Y-%m'), 'total_net_salary': total})

