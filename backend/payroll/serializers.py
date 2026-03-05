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
            'deductions',
            'net_salary',
        ]
        read_only_fields = ['net_salary']

