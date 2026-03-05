from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOrHR
from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('employee').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Employees can create their own attendance; HR/Admin can manage all.
        if self.action in ('list', 'retrieve', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsAdminOrHR()]
        return [IsAuthenticated()]

