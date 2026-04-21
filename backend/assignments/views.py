from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
class AssignmentListCreate(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Assignment.objects.filter(course_id=self.kwargs['pk'])
    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['pk'])
class AllAssignments(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Assignment.objects.filter(course__instructor=user)
        enrolled = user.enrollments.values_list('course_id', flat=True)
        print(f'[AllAssignments] User {user.username} enrolled in courses: {list(enrolled)}')
        queryset = Assignment.objects.filter(course__in=enrolled)
        print(f'[AllAssignments] Returning {queryset.count()} assignments')
        return queryset
class AssignmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
class SubmitAssignment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        assignment = Assignment.objects.get(pk=pk)
        submission, created = Submission.objects.get_or_create(
            assignment=assignment, student=request.user,
            defaults={'file': request.FILES.get('file'), 'status': 'submitted'}
        )
        if not created:
            submission.file = request.FILES.get('file')
            submission.submitted_at = timezone.now()
            submission.status = 'submitted'
            submission.save()
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
class AllSubmissions(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Submission.objects.filter(assignment__course__instructor=user).order_by('-submitted_at')
        print(f'[AllSubmissions] User {user.username} requesting own submissions only')
        queryset = Submission.objects.filter(student=user).order_by('-submitted_at')
        print(f'[AllSubmissions] Returning {queryset.count()} submissions for student {user.username}')
        return queryset
class AssignmentSubmissions(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        assignment_id = self.kwargs['pk']
        if user.is_staff:
            return Submission.objects.filter(assignment_id=assignment_id)
        return Submission.objects.filter(assignment_id=assignment_id, student=user)

class StudentSubmissions(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            print(f'[StudentSubmissions] Staff user {user.username} cannot access student submissions')
            return Submission.objects.none()
        print(f'[StudentSubmissions] Fetching submissions for student: {user.id} ({user.username})')
        queryset = Submission.objects.filter(student=user).order_by('-submitted_at')
        print(f'[StudentSubmissions] Query result count: {queryset.count()}')
        for sub in queryset:
            print(f'  - {sub.assignment.title} (Assignment {sub.assignment.id}) Status: {sub.status} Marks: {sub.marks_obtained}')
        return queryset
class StudentGrades(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        if request.user.is_staff:
            print(f'[StudentGrades] Staff user {request.user.username} cannot access student grades')
            return Response([])
        print(f'[StudentGrades] Fetching graded submissions for: {request.user.username}')
        subs = Submission.objects.filter(student=request.user, status='graded').order_by('-graded_at')
        print(f'[StudentGrades] Found {subs.count()} graded submissions')
        return Response(SubmissionSerializer(subs, many=True).data)
class StudentDeadlines(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        enrolled = request.user.enrollments.values_list('course_id', flat=True)
        assignments = Assignment.objects.filter(course__in=enrolled).order_by('due_date')
        return Response(AssignmentSerializer(assignments, many=True).data)
class SubmissionDetail(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Submission.objects.all()
        return Submission.objects.filter(student=user)

class GradeSubmission(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, pk):
        submission = Submission.objects.get(pk=pk)
        submission.marks_obtained = request.data.get('marks_obtained')
        submission.feedback = request.data.get('feedback', '')
        submission.status = request.data.get('status', 'graded')
        if submission.status == 'graded':
            submission.graded_at = timezone.now()
        submission.save()
        return Response(SubmissionSerializer(submission).data)
