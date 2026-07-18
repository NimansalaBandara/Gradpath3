from django.db import models


class University(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100, default='Australia')
    world_ranking = models.PositiveIntegerField(null=True, blank=True)
    city = models.CharField(max_length=100)
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    website_url = models.URLField()

    class Meta:
        verbose_name_plural = 'universities'
        ordering = ['world_ranking', 'name']

    def __str__(self):
        return self.name


class Course(models.Model):
    LEVEL_CHOICES = [('masters', "Master's"), ('phd', 'PhD')]

    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=200)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    field = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requirements = models.TextField(blank=True)
    description = models.TextField(blank=True)
    application_url = models.URLField()
    deadline = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['university__name', 'title']

    def __str__(self):
        return f'{self.title} — {self.university.name}'


class Scholarship(models.Model):
    TYPE_CHOICES = [
        ('full', 'Full Scholarship'),
        ('partial', 'Partial Scholarship'),
        ('full_ride', 'Full Ride'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    eligibility = models.TextField()
    deadline = models.DateField(null=True, blank=True)
    link = models.URLField()
    university = models.ForeignKey(
        University, on_delete=models.SET_NULL, null=True, blank=True, related_name='scholarships'
    )
    field = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['deadline', 'name']

    def __str__(self):
        return self.name
