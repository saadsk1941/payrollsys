from .models import Employee


def ensure_user_employee_link(user):
    """
    For non-global users, auto-link an unassigned employee profile to the
    current account using email first, then username->name match.
    """
    if not user or user.role in ('SUPERVISOR', 'ADMIN'):
        return

    if Employee.objects.filter(user=user).exists():
        return

    candidate = None
    if user.email:
        candidate = (
            Employee.objects.filter(user__isnull=True, email__iexact=user.email).order_by('id').first()
        )
    if not candidate and user.username:
        candidate = (
            Employee.objects.filter(user__isnull=True, name__iexact=user.username).order_by('id').first()
        )

    if candidate:
        candidate.user = user
        candidate.save(update_fields=['user'])


def scoped_employee_queryset(user):
    if user.role in ('SUPERVISOR', 'ADMIN'):
        return Employee.objects.all()
    ensure_user_employee_link(user)
    return Employee.objects.filter(user=user)
