from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Enrollment, Module, Announcement
from .serializers import CourseSerializer, ModuleSerializer, AnnouncementSerializer
class CourseListCreate(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Course.objects.filter(instructor=user)
        return Course.objects.filter(enrollment__student=user)
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Course.objects.filter(instructor=user)
        return Course.objects.filter(enrollment__student=user)
class EnrollCourse(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        course = Course.objects.get(pk=pk)
        Enrollment.objects.get_or_create(student=request.user, course=course)
        return Response({'status': 'enrolled'})
class ModuleListCreate(generics.ListCreateAPIView):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['pk']).order_by('order')
    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['pk'])
class ModuleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
class AnnouncementListCreate(generics.ListCreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Announcement.objects.filter(course_id=self.kwargs['pk']).order_by('-created_at')
    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['pk'])
class CourseAnalytics(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        data = []
        for c in courses:
            subs = c.assignments.values_list('submissions__marks_obtained', flat=True)
            marks = [m for m in subs if m is not None]
            avg = round(sum(marks)/len(marks)) if marks else 0
            data.append({'id':c.id,'title':c.title,'avg':avg,'students':c.enrollment_set.count()})
        return Response({'avg': round(sum(d['avg'] for d in data)/len(data)) if data else 0, 'courses': data})

class InstructorAnnouncements(generics.ListAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Get all announcements from courses where the user is the instructor
        return Announcement.objects.filter(course__instructor=self.request.user).order_by('-created_at')
