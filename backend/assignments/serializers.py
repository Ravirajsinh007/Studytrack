from rest_framework import serializers
from .models import Assignment, Submission
class AssignmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    class Meta:
        model = Assignment
        fields = ['id','course','course_title','title','description','due_date','max_marks']
    def get_course_title(self, obj): return obj.course.title
class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    assignment_title = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    assignment_max_marks = serializers.SerializerMethodField()
    class Meta:
        model = Submission
        fields = ['id','assignment','assignment_title','student','student_name','course',
                  'assignment_max_marks','file','file_url','submitted_at','status','marks_obtained','feedback','graded_at']
    def get_student_name(self, obj): return obj.student.get_full_name() or obj.student.username
    def get_assignment_title(self, obj): return obj.assignment.title
    def get_course(self, obj): return obj.assignment.course.title
    def get_file_url(self, obj): return obj.file.url if obj.file else None
    def get_assignment_max_marks(self, obj): return obj.assignment.max_marks
