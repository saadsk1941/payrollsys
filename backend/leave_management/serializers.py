from rest_framework import serializers

from .models import Leave


class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = Leave
        fields = [
            'id',
            'employee',
            'employee_name',
            'leave_type',
            'from_date',
            'to_date',
            'status',
            'reason',
        ]

