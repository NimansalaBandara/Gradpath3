from django.db import models
from django.conf import settings


class AIRecommendation(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_recommendation',
    )
    result_json = models.JSONField()
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recommendations for {self.user.email}"
