from rest_framework.routers import DefaultRouter
from .views import ApplicationTrackerViewSet, DocumentItemViewSet

router = DefaultRouter()
router.register('tracker', ApplicationTrackerViewSet, basename='tracker')
router.register('documents', DocumentItemViewSet, basename='documents')

urlpatterns = router.urls
