from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from apps.accounts.permissions import IsAuthenticatedOrAdminWrite
from .models import University, Course, Scholarship
from .serializers import (
    UniversityListSerializer, UniversityDetailSerializer, UniversityWriteSerializer,
    CourseListSerializer, CourseDetailSerializer, CourseWriteSerializer,
    ScholarshipSerializer, ScholarshipWriteSerializer,
)
from .filters import UniversityFilter, CourseFilter, ScholarshipFilter

WRITE_ACTIONS = ('create', 'update', 'partial_update', 'destroy')


class UniversityViewSet(viewsets.ModelViewSet):
    filterset_class = UniversityFilter
    search_fields = ['name', 'city', 'description']
    ordering_fields = ['world_ranking', 'name']
    ordering = ['world_ranking']

    def get_permissions(self):
        if self.action in WRITE_ACTIONS:
            return [IsAuthenticatedOrAdminWrite()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return University.objects.annotate(course_count=Count('courses'))

    def get_serializer_class(self):
        if self.action in WRITE_ACTIONS:
            return UniversityWriteSerializer
        if self.action == 'retrieve':
            return UniversityDetailSerializer
        return UniversityListSerializer


class CourseViewSet(viewsets.ModelViewSet):
    filterset_class = CourseFilter
    search_fields = ['title', 'field', 'description']
    ordering_fields = ['title', 'tuition_fee', 'level']
    ordering = ['title']

    def get_permissions(self):
        if self.action in WRITE_ACTIONS:
            return [IsAuthenticatedOrAdminWrite()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Course.objects.select_related('university')

    def get_serializer_class(self):
        if self.action in WRITE_ACTIONS:
            return CourseWriteSerializer
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer


class ScholarshipViewSet(viewsets.ModelViewSet):
    filterset_class = ScholarshipFilter
    search_fields = ['name', 'eligibility', 'field']
    ordering_fields = ['deadline', 'amount', 'name']
    ordering = ['deadline', 'name']

    def get_permissions(self):
        if self.action in WRITE_ACTIONS:
            return [IsAuthenticatedOrAdminWrite()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Scholarship.objects.select_related('university')

    def get_serializer_class(self):
        if self.action in WRITE_ACTIONS:
            return ScholarshipWriteSerializer
        return ScholarshipSerializer
