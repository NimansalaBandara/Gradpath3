from django.conf import settings
from django.db import models


class ApplicationTracker(models.Model):
    STATUS_CHOICES = [
        ('hope_to_apply', 'Hope to Apply'),
        ('not_yet', 'Not Yet Started'),
        ('applied', 'Applied'),
        ('interviewed', 'Interviewed'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
        ('waitlisted', 'Waitlisted'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tracked_applications',
    )
    course = models.ForeignKey(
        'catalog.Course',
        on_delete=models.CASCADE,
        related_name='trackers',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='hope_to_apply')
    notes = models.TextField(blank=True)
    applied_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} — {self.course.title} ({self.status})'


class DocumentItem(models.Model):
    DOC_TYPE_CHOICES = [
        ('sop', 'Statement of Purpose'),
        ('visa', 'Visa'),
        ('passport', 'Passport'),
        ('transcript', 'Transcript'),
        ('cv', 'CV / Resume'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('complete', 'Complete'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents',
    )
    doc_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES)
    file = models.FileField(upload_to='documents/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['doc_type', '-uploaded_at']

    def __str__(self):
        return f'{self.user.email} — {self.doc_type} ({self.status})'
