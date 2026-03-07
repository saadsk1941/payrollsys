from rest_framework.permissions import BasePermission


PAGE_KEYS = ('dashboard', 'employees', 'attendance', 'leave', 'payroll', 'profile')


def user_has_page_access(user, page_key):
    if not page_key:
        return True
    raw_permissions = getattr(user, 'page_permissions', {}) or {}
    if not isinstance(raw_permissions, dict):
        return True
    return bool(raw_permissions.get(page_key, True))


class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == 'SUPERVISOR'
        )


class IsSupervisorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('SUPERVISOR', 'ADMIN')
        )


class RoleBasedRecordPermission(BasePermission):
    """
    SUPERVISOR: full CRUD
    ADMIN: list/retrieve + update/partial_update only
    STAFF: list/retrieve only
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        required_page = getattr(view, 'required_page', None)
        if required_page and required_page in PAGE_KEYS and not user_has_page_access(user, required_page):
            return False

        role = user.role
        action = getattr(view, 'action', None)

        if role == 'SUPERVISOR':
            return True

        if role == 'ADMIN':
            return action in ('list', 'retrieve', 'update', 'partial_update')

        if role == 'STAFF':
            return action in ('list', 'retrieve')

        return False


class HasPageAccess(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        required_page = getattr(view, 'required_page', None)
        return user_has_page_access(user, required_page)

