from rest_framework import serializers
from .models import Course, Enrollment, Module, Announcement
class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id','course','title','content','resource_link','order']
class AnnouncementSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    class Meta:
        model = Announcement
        fields = ['id','course','course_title','title','message','created_at']
class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    module_count = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = ['id','title','description','instructor','instructor_name','created_at','modules','module_count','student_count']
    def get_module_count(self, obj): return obj.modules.count()
    def get_student_count(self, obj): return obj.enrollment_set.count()
    def get_instructor_name(self, obj): return obj.instructor.get_full_name() or obj.instructor.username
