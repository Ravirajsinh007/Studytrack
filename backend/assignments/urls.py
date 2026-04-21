from django.urls import path
from . import views
urlpatterns = [
    path('courses/<int:pk>/assignments/', views.AssignmentListCreate.as_view()),
    path('assignments/', views.AllAssignments.as_view()),
    path('assignments/<int:pk>/', views.AssignmentDetail.as_view()),
    path('assignments/<int:pk>/submit/', views.SubmitAssignment.as_view()),
    path('assignments/<int:pk>/submissions/', views.AssignmentSubmissions.as_view()),
    path('submissions/', views.AllSubmissions.as_view()),
    path('submissions/<int:pk>/', views.SubmissionDetail.as_view()),
    path('submissions/<int:pk>/grade/', views.GradeSubmission.as_view()),
    path('students/submissions/', views.StudentSubmissions.as_view()),
    path('students/grades/', views.StudentGrades.as_view()),
    path('students/deadlines/', views.StudentDeadlines.as_view()),
]
