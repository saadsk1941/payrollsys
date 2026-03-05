from django.contrib import admin

from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'department', 'designation', 'joining_date', 'basic_salary')
    search_fields = ('name', 'email', 'department', 'designation')
