from decimal import Decimal
from django.db import models
from employees.models import Employee


class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.DateField(help_text='Use first day of month, e.g. 2026-03-01')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    overtime_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    overtime_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    overtime_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    class Meta:
        unique_together = ('employee', 'month')
        ordering = ['-month']

    def save(self, *args, **kwargs):
        basic = self.basic_salary or Decimal('0')
        allowances = self.allowances or Decimal('0')
        overtime_hours = self.overtime_hours or Decimal('0')
        overtime_rate = self.overtime_rate or Decimal('0')
        deductions = self.deductions or Decimal('0')
        self.overtime_amount = overtime_hours * overtime_rate
        self.net_salary = basic + allowances + self.overtime_amount - deductions
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.employee.name} - {self.month:%Y-%m}'
