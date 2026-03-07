from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import RoleBasedRecordPermission
from .models import Employee
from .serializers import EmployeeSerializer
from .utils import scoped_employee_queryset

User = get_user_model()


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('name')
    serializer_class = EmployeeSerializer
    permission_classes = [RoleBasedRecordPermission]
    required_page = 'employees'

    def _has_global_access(self):
        return self.request.user.role in ('SUPERVISOR', 'ADMIN')

    def get_queryset(self):
        return scoped_employee_queryset(self.request.user).order_by('name')

    def _guess_linked_user(self, name, email):
        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                return user
        if name:
            return User.objects.filter(username__iexact=name).first()
        return None

    def perform_create(self, serializer):
        if self._has_global_access():
            linked_user = serializer.validated_data.get('user')
            if not linked_user:
                linked_user = self._guess_linked_user(
                    serializer.validated_data.get('name'),
                    serializer.validated_data.get('email'),
                )
            serializer.save(user=linked_user)
            return

        existing = Employee.objects.filter(user=self.request.user).exists()
        if existing:
            raise PermissionDenied('You already have an employee profile.')
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if self._has_global_access():
            linked_user = serializer.validated_data.get('user', serializer.instance.user)
            if linked_user is None:
                linked_user = self._guess_linked_user(
                    serializer.validated_data.get('name', serializer.instance.name),
                    serializer.validated_data.get('email', serializer.instance.email),
                )
            serializer.save(user=linked_user)
            return
        serializer.save(user=self.request.user)

