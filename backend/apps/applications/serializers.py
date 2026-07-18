from rest_framework import serializers
from apps.catalog.models import Course
from .models import ApplicationTracker, DocumentItem


class UniversityMinimalSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    city = serializers.CharField()


class CourseMinimalSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    level = serializers.CharField()
    university = UniversityMinimalSerializer()


class ApplicationTrackerSerializer(serializers.ModelSerializer):
    course = CourseMinimalSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        source='course',
        queryset=Course.objects.all(),
        write_only=True,
    )

    class Meta:
        model = ApplicationTracker
        fields = [
            'id', 'course', 'course_id', 'status', 'notes',
            'applied_date', 'deadline', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DocumentItemSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentItem
        fields = ['id', 'doc_type', 'file', 'file_url', 'status', 'uploaded_at', 'notes']
        read_only_fields = ['id', 'uploaded_at']
        extra_kwargs = {'file': {'write_only': True, 'required': False}}

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
