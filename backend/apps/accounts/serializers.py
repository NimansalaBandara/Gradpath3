from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import StudentProfile

User = get_user_model()


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        exclude = ['user', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_premium', 'student_profile']
        read_only_fields = ['id', 'role', 'is_premium']


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    field_of_study = serializers.CharField(required=False, allow_blank=True)
    current_degree = serializers.CharField(required=False, allow_blank=True)
    gpa = serializers.DecimalField(max_digits=4, decimal_places=2, required=False, allow_null=True)
    graduation_year = serializers.IntegerField(required=False, allow_null=True)
    target_level = serializers.ChoiceField(
        choices=[('', ''), ('masters', 'masters'), ('phd', 'phd')],
        required=False,
        allow_blank=True,
    )
    ielts_score = serializers.DecimalField(max_digits=3, decimal_places=1, required=False, allow_null=True)
    gre_score = serializers.IntegerField(required=False, allow_null=True)
    work_experience_years = serializers.IntegerField(required=False, allow_null=True)
    preferred_intake = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    country_of_origin = serializers.CharField(required=False, allow_blank=True)


class AdminUserSerializer(serializers.ModelSerializer):
    """Used by admin endpoints — role and is_premium are writable."""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_premium', 'date_joined']
        read_only_fields = ['id', 'email', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='student',
        )
        StudentProfile.objects.create(user=user)
        return user
