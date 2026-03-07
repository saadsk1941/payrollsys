from datetime import date
from decimal import Decimal

from django.test import TestCase

from employees.models import Employee
from payroll.models import Payroll


class PayrollOvertimeTests(TestCase):
    def test_net_salary_includes_overtime_amount(self):
        employee = Employee.objects.create(
            name='Ayan',
            email='ayan-test@example.com',
            joining_date=date(2025, 1, 10),
            basic_salary=Decimal('30000.00'),
        )

        payroll = Payroll.objects.create(
            employee=employee,
            month=date(2026, 3, 1),
            basic_salary=Decimal('30000.00'),
            allowances=Decimal('2000.00'),
            overtime_hours=Decimal('10.00'),
            overtime_rate=Decimal('250.00'),
            deductions=Decimal('1500.00'),
        )

        self.assertEqual(payroll.overtime_amount, Decimal('2500.00'))
        self.assertEqual(payroll.net_salary, Decimal('33000.00'))
