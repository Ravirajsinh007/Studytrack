#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edutrack.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Enrollment, Course
from courses.serializers import CourseSerializer

# Check student1 enrollments
student1 = User.objects.get(username='student1')
print(f"Student: {student1.username}")

enrollments = Enrollment.objects.filter(student=student1)
print(f"Enrollments: {enrollments.count()}")

for enrollment in enrollments:
    print(f"  - Course: {enrollment.course.title}")

# Check what the API would return for the student
print("\n=== Testing CourseListCreate API logic ===")
user = student1
queryset = Course.objects.filter(enrollments__student=user)
print(f"Courses for student (via enrollments__student filter): {queryset.count()}")
for course in queryset:
    print(f"  - {course.title}")

# Try serializing
print("\n=== Testing Serialization ===")
if queryset.exists():
    for course in queryset:
        try:
            serializer = CourseSerializer(course)
            print(f"✅ Serialized: {course.title}")
        except Exception as e:
            print(f"❌ Error: {e}")
else:
    print("No courses found for student1")

# Check if student is enrolled in any course
print("\n=== Checking if student is enrolled in courses ===")
all_courses = Course.objects.all()
print(f"Total courses: {all_courses.count()}")

for course in all_courses[:3]:
    enrolled = course.enrollments.filter(student=student1).exists()
    print(f"  {course.title}: {'✅ Enrolled' if enrolled else '❌ Not enrolled'}")
