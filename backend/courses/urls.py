from django.urls import path
from . import views
urlpatterns = [
    path('courses/', views.CourseListCreate.as_view()),
    path('courses/<int:pk>/', views.CourseDetail.as_view()),
    path('courses/<int:pk>/enroll/', views.EnrollCourse.as_view()),
    path('courses/<int:pk>/modules/', views.ModuleListCreate.as_view()),
    path('modules/<int:pk>/', views.ModuleDetail.as_view()),
    path('courses/<int:pk>/announcements/', views.AnnouncementListCreate.as_view()),
    path('courses/analytics/', views.CourseAnalytics.as_view()),
    path('announcements/', views.InstructorAnnouncements.as_view()),
]
