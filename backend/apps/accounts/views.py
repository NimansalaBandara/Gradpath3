from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import University, Course, Scholarship
from apps.applications.models import ApplicationTracker
from .permissions import IsAdminRole
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer, AdminUserSerializer
from .models import StudentProfile

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        user_fields = {}
        if 'first_name' in data:
            user_fields['first_name'] = data.pop('first_name')
        if 'last_name' in data:
            user_fields['last_name'] = data.pop('last_name')
        if user_fields:
            for field, value in user_fields.items():
                setattr(user, field, value)
            user.save(update_fields=list(user_fields.keys()))

        if data:
            profile, _ = StudentProfile.objects.get_or_create(user=user)
            for field, value in data.items():
                setattr(profile, field, value)
            profile.save(update_fields=list(data.keys()))

        return Response(UserSerializer(user).data)


# ── Admin views ──────────────────────────────────────────────────────────────

class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        most_tracked = (
            ApplicationTracker.objects
            .values('course_id', 'course__title', 'course__university__name')
            .annotate(tracker_count=Count('id'))
            .order_by('-tracker_count')[:5]
        )
        return Response({
            'total_students':    User.objects.filter(role='student').count(),
            'premium_count':     User.objects.filter(is_premium=True).count(),
            'total_universities': University.objects.count(),
            'total_courses':     Course.objects.count(),
            'total_scholarships': Scholarship.objects.count(),
            'most_tracked': [
                {
                    'course_id':    row['course_id'],
                    'title':        row['course__title'],
                    'university':   row['course__university__name'],
                    'tracker_count': row['tracker_count'],
                }
                for row in most_tracked
            ],
        })


class AdminUserListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        users = User.objects.select_related('student_profile').order_by('date_joined')
        return Response(AdminUserSerializer(users, many=True).data)


class AdminUserUpdateView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
