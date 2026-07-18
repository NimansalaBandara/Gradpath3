from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, CourseViewSet, ScholarshipViewSet

router = DefaultRouter()
router.register('universities', UniversityViewSet, basename='university')
router.register('courses', CourseViewSet, basename='course')
router.register('scholarships', ScholarshipViewSet, basename='scholarship')

urlpatterns = router.urls
