from django.contrib import admin
from .models import ApplicationTracker, DocumentItem


@admin.register(ApplicationTracker)
class ApplicationTrackerAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'deadline', 'created_at']
    list_filter = ['status']
    search_fields = ['user__email', 'course__title']


@admin.register(DocumentItem)
class DocumentItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'doc_type', 'status', 'uploaded_at']
    list_filter = ['doc_type', 'status']
    search_fields = ['user__email']
