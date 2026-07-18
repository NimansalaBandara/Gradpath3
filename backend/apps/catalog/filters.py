import django_filters
from .models import University, Course, Scholarship

# Groups the free-text Course.field values into broader subject-area categories
# for the Universities filter. Keys are the values sent by the frontend.
SUBJECT_CATEGORIES = {
    'computer-science-it': ['Computer Science', 'Information Technology', 'Software Engineering', 'Artificial Intelligence', 'Data Science'],
    'engineering': ['Engineering', 'Civil Engineering', 'Aerospace Engineering', 'Biomedical Engineering', 'Mining Engineering', 'Petroleum Engineering'],
    'business-finance': ['Business', 'Finance'],
    'science': ['Physics', 'Environmental Science', 'Marine Biology', 'Biotechnology'],
    'medicine-health': ['Medicine', 'Pharmacy'],
    'humanities-social-sciences': ['International Relations'],
}


class UniversityFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='iexact')
    ranking_max = django_filters.NumberFilter(field_name='world_ranking', lookup_expr='lte')
    ranking_min = django_filters.NumberFilter(field_name='world_ranking', lookup_expr='gte')
    subject = django_filters.CharFilter(method='filter_subject')

    class Meta:
        model = University
        fields = ['city', 'ranking_min', 'ranking_max', 'subject']

    def filter_subject(self, queryset, name, value):
        fields = SUBJECT_CATEGORIES.get(value, [value])
        uni_ids = Course.objects.filter(field__in=fields).values_list('university_id', flat=True)
        return queryset.filter(id__in=uni_ids)


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
