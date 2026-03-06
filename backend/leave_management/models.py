from django.db import models
from employees.models import Employee

class Leave(models.Model):
    LEAVE_TYPE_CHOICES = (
        ('CASUAL', 'Casual'),
        ('SICK', 'Sick'),
        ('ANNUAL', 'Annual'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-from_date']

    def __str__(self) -> str:
        return f'{self.employee.name} - {self.leave_type} ({self.status})'

from django.db import models