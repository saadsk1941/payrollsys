from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOrHR
from .models import Leave
from .serializers import LeaveSerializer


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('employee').all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.role == 'EMPLOYEE':
            return qs.filter(employee__user=user)
        return qs

    def get_permissions(self):
        # Employees can create/view their own; HR/Admin can approve/reject.
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsAdminOrHR()]
        return [IsAuthenticated()]

