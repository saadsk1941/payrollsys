from rest_framework.routers import DefaultRouter

from .views import LeaveViewSet


router = DefaultRouter()
router.register(r'', LeaveViewSet, basename='leave')

urlpatterns = router.urls

