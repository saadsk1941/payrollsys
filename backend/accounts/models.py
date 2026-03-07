from django.contrib.auth.models import AbstractUser
from django.db import models


def default_page_permissions():
    return {
        'dashboard': True,
        'employees': True,
        'attendance': True,
        'leave': True,
        'payroll': True,
        'profile': True,
    }


class User(AbstractUser):

    ROLE_CHOICES = (
        ('SUPERVISOR', 'Supervisor'),
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    page_permissions = models.JSONField(default=default_page_permissions)

    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
