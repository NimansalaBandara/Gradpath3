from django.contrib import admin
from .models import AIRecommendation, AIScholarshipRecommendation

@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at',)

@admin.register(AIScholarshipRecommendation)
class AIScholarshipRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at',)
