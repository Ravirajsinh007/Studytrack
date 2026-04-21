#!/usr/bin/env python
import os
import sys
import django
import json
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edutrack.settings')
django.setup()

from django.contrib.auth.models import User

# Test 1: Check if users exist
print("=== User Check ===")
users = User.objects.all()
for user in users:
    print(f"User: {user.username} (staff: {user.is_staff})")

# Test 2: Try login via HTTP
print("\n=== API Login Test ===")
try:
    response = requests.post('http://127.0.0.1:8000/api/auth/login/', 
        json={'username': 'admin', 'password': 'admin'}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        token = response.json().get('access')
        print(f"Token received: {token[:50]}...")
        
        # Test 3: Try to get courses with token
        print("\n=== Courses API Test ===")
        headers = {'Authorization': f'Bearer {token}'}
        courses_response = requests.get('http://127.0.0.1:8000/api/courses/', headers=headers)
        print(f"Status: {courses_response.status_code}")
        print(f"Response: {courses_response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Direct database check
print("\n=== Direct Database Check ===")
from courses.models import Course, Module
from assignments.models import Assignment

courses = Course.objects.all()
print(f"Total courses: {courses.count()}")
for course in courses[:2]:
    print(f"\nCourse: {course.title}")
    print(f"  Modules: {course.modules.count()}")
    print(f"  Assignments: {course.assignments.count()}")
    
    # Test serialization
    print(f"  Testing attribute access:")
    try:
        print(f"    course.modules exists: {hasattr(course, 'modules')}")
        print(f"    course.modules.all() count: {course.modules.all().count()}")
        print(f"    course.assignments exists: {hasattr(course, 'assignments')}")
        print(f"    course.assignments.all() count: {course.assignments.all().count()}")
    except Exception as e:
        print(f"    Error accessing: {e}")
