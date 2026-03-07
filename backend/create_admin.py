#!/usr/bin/env python
"""One-time script to create admin user. Run: python create_admin.py"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hr_system.settings')
django.setup()

from accounts.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@payroll.com',
        password='admin123',
        role='SUPERVISOR',
    )
    print('Admin created: username=admin, password=admin123')
else:
    print('Admin already exists.')
