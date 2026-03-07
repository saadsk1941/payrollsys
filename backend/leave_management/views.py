from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import RoleBasedRecordPermission
from employees.utils import scoped_employee_queryset
from .models import Leave
from .serializers import LeaveSerializer


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('employee').all()
    serializer_class = LeaveSerializer
    permission_classes = [RoleBasedRecordPermission]
    required_page = 'leave'

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

