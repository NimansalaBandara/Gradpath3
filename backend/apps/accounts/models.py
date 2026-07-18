from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [('student', 'Student'), ('admin', 'Admin')]

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_premium = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class StudentProfile(models.Model):
    TARGET_CHOICES = [('masters', "Master's"), ('phd', 'PhD')]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    field_of_study = models.CharField(max_length=100, blank=True)
    current_degree = models.CharField(max_length=100, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    target_level = models.CharField(max_length=10, choices=TARGET_CHOICES, blank=True)
    ielts_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    gre_score = models.PositiveIntegerField(null=True, blank=True)
    work_experience_years = models.PositiveIntegerField(null=True, blank=True)
    preferred_intake = models.CharField(max_length=50, blank=True)
    bio = models.TextField(blank=True)
    country_of_origin = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profile — {self.user.email}'
