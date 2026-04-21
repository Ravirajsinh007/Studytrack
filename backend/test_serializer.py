#!/usr/bin/env python
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edutrack.settings')
django.setup()

from courses.models import Course
from courses.serializers import CourseSerializer

print("=== Testing CourseSerializer ===\n")

courses = Course.objects.all()[:2]

for course in courses:
    print(f"Course: {course.title}")
    print(f"  ID: {course.id}")
    print(f"  Instructor: {course.instructor.username}")
    print(f"  Modules: {course.modules.all().count()}")
    print(f"  Assignments: {course.assignments.all().count()}")
    
    # Test serializer
    try:
        serializer = CourseSerializer(course)
        data = serializer.data
        print(f"  Serialized Successfully!")
        print(f"  Keys: {list(data.keys())}")
        print(f"  Serialized data:\n{json.dumps(data, indent=2, default=str)}")
    except Exception as e:
        print(f"  ❌ Serializer Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*50 + "\n")
