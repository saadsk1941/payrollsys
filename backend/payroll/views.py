from datetime import date

from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdminOrHR
from .models import Payroll
from .serializers import PayrollSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated & IsAdminOrHR]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Return total payroll for current month."""
        today = date.today()
        month_start = date(today.year, today.month, 1)
        total = (
            Payroll.objects.filter(month=month_start).aggregate(total_net=Sum('net_salary'))[
                'total_net'
            ]
            or 0
        )
        return Response({'month': month_start.strftime('%Y-%m'), 'total_net_salary': total})

