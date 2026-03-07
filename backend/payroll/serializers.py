from rest_framework import serializers

from .models import Payroll


class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = Payroll
        fields = [
            'id',
            'employee',
            'employee_name',
            'month',
            'basic_salary',
            'allowances',
            'overtime_hours',
            'overtime_rate',
            'overtime_amount',
            'deductions',
            'net_salary',
        ]
        read_only_fields = ['overtime_amount', 'net_salary']

