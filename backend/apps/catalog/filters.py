import django_filters
from .models import University, Course, Scholarship


class UniversityFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='iexact')
    ranking_max = django_filters.NumberFilter(field_name='world_ranking', lookup_expr='lte')
    ranking_min = django_filters.NumberFilter(field_name='world_ranking', lookup_expr='gte')

    class Meta:
        model = University
        fields = ['city', 'ranking_min', 'ranking_max']


class CourseFilter(django_filters.FilterSet):
    university = django_filters.NumberFilter(field_name='university__id')
    level = django_filters.CharFilter(lookup_expr='iexact')
    field = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Course
        fields = ['university', 'level', 'field']


class ScholarshipFilter(django_filters.FilterSet):
    type = django_filters.CharFilter(lookup_expr='iexact')
    field = django_filters.CharFilter(lookup_expr='icontains')
    university = django_filters.NumberFilter(field_name='university__id')

    class Meta:
        model = Scholarship
        fields = ['type', 'field', 'university']
