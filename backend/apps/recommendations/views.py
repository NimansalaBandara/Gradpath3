from datetime import timedelta

from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.catalog.models import Course, Scholarship
from .matcher import compute_recommendations
from .scholarship_matcher import compute_scholarship_recommendations
from .models import AIRecommendation, AIScholarshipRecommendation

CACHE_TTL_HOURS = 24


class RecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_premium:
            return Response(
                {'detail': 'Premium subscription required to access AI recommendations.'},
                status=403,
            )

        # Return cached result if fresh
        cache_cutoff = timezone.now() - timedelta(hours=CACHE_TTL_HOURS)
        cached = AIRecommendation.objects.filter(user=user, created_at__gte=cache_cutoff).first()
        if cached:
            return Response(cached.result_json)

        # Compute fresh recommendations
        courses = list(
            Course.objects.select_related('university').all()[:60]
        )
        result = compute_recommendations(user, courses)

        # Upsert cache
        AIRecommendation.objects.update_or_create(
            user=user,
            defaults={'result_json': result},
        )

        return Response(result)


class ScholarshipRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_premium:
            return Response(
                {'detail': 'Premium subscription required to access AI recommendations.'},
                status=403,
            )

        cache_cutoff = timezone.now() - timedelta(hours=CACHE_TTL_HOURS)
        cached = AIScholarshipRecommendation.objects.filter(user=user, created_at__gte=cache_cutoff).first()
        if cached:
            return Response(cached.result_json)

        scholarships = list(
            Scholarship.objects.select_related('university').all()[:100]
        )
        result = compute_scholarship_recommendations(user, scholarships)

        AIScholarshipRecommendation.objects.update_or_create(
            user=user,
            defaults={'result_json': result},
        )

        return Response(result)
