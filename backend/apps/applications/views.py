from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import ApplicationTracker, DocumentItem
from .serializers import ApplicationTrackerSerializer, DocumentItemSerializer

FREE_TRACKER_LIMIT = 5
FREE_DOCUMENT_LIMIT = 5


class ApplicationTrackerViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationTrackerSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return ApplicationTracker.objects.filter(user=self.request.user).select_related(
            'course__university'
        )

    def create(self, request, *args, **kwargs):
        if not request.user.is_premium and self.get_queryset().count() >= FREE_TRACKER_LIMIT:
            return Response(
                {'detail': f'Free accounts can track up to {FREE_TRACKER_LIMIT} courses. Upgrade to Premium for unlimited tracking.'},
                status=403,
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        course = serializer.validated_data.get('course')
        deadline = serializer.validated_data.get('deadline') or (course.deadline if course else None)
        serializer.save(user=self.request.user, deadline=deadline)


class DocumentItemViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return DocumentItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.user.is_premium and self.get_queryset().count() >= FREE_DOCUMENT_LIMIT:
            return Response(
                {'detail': f'Free accounts can upload up to {FREE_DOCUMENT_LIMIT} documents. Upgrade to Premium for unlimited uploads.'},
                status=403,
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
