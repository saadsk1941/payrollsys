from rest_framework import serializers

from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id',
            'user',
            'name',
            'email',
            'phone',
            'department',
            'designation',
            'joining_date',
            'basic_salary',
        ]

