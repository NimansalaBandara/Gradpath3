from rest_framework import serializers
from .models import University, Course, Scholarship


class UniversityListSerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = University
        fields = ['id', 'name', 'city', 'country', 'world_ranking', 'logo_url', 'course_count']


class UniversityDetailSerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = University
        fields = '__all__'


class UniversityWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'


class UniversityBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'city', 'country', 'world_ranking', 'website_url']


class CourseListSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    university_id = serializers.IntegerField(source='university.id', read_only=True)
    university_city = serializers.CharField(source='university.city', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'level', 'field', 'duration', 'tuition_fee',
                  'university_name', 'university_id', 'university_city', 'deadline']


class CourseDetailSerializer(serializers.ModelSerializer):
    university = UniversityBriefSerializer(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class ScholarshipSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    university_id = serializers.IntegerField(source='university.id', read_only=True)

    class Meta:
        model = Scholarship
        fields = '__all__'


class ScholarshipWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = '__all__'
