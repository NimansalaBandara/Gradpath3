from django.contrib import admin
from .models import University, Course, Scholarship


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'world_ranking', 'country']
    search_fields = ['name', 'city']
    ordering = ['world_ranking']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'university', 'level', 'field', 'tuition_fee']
    list_filter = ['level', 'field']
    search_fields = ['title', 'university__name', 'field']


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'amount', 'deadline', 'university']
    list_filter = ['type']
    search_fields = ['name', 'eligibility']
