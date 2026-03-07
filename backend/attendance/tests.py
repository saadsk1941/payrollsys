from datetime import date
from decimal import Decimal

from django.test import TestCase

from attendance.models import Attendance
from employees.models import Employee


class AttendanceOvertimeTests(TestCase):
    def setUp(self):
        self.employee = Employee.objects.create(
            name='Ravi',
            email='ravi-test@example.com',
            joining_date=date(2025, 5, 1),
            basic_salary=Decimal('22000.00'),
        )

    def test_overtime_defaults_to_zero(self):
        record = Attendance.objects.create(
            employee=self.employee,
            date=date(2026, 3, 5),
            status='PRESENT',
        )
        self.assertEqual(record.overtime_hours, Decimal('0'))

    def test_overtime_can_be_saved(self):
        record = Attendance.objects.create(
            employee=self.employee,
            date=date(2026, 3, 6),
            status='PRESENT',
            overtime_hours=Decimal('2.50'),
        )
        self.assertEqual(record.overtime_hours, Decimal('2.50'))
