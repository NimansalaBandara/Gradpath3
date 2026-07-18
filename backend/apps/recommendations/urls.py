from django.urls import path
from .views import RecommendationsView, ScholarshipRecommendationsView

urlpatterns = [
    path('', RecommendationsView.as_view(), name='recommendations'),
    path('scholarships/', ScholarshipRecommendationsView.as_view(), name='scholarship-recommendations'),
]
