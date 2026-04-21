import os
import django
from datetime import datetime, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edutrack.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Course, Enrollment, Module, Announcement
from assignments.models import Assignment, Submission

print("Creating sample data for EduTrack...\n")

# Create users
print("Creating users...")
users_data = {
    'admin': {'email': 'admin@edutrack.com', 'is_superuser': True, 'password': 'admin123'},
    'instructor': {'email': 'instructor@edutrack.com', 'is_staff': True, 'first_name': 'Dr.', 'last_name': 'Patel', 'password': 'pass123'},
    'student1': {'email': 'student1@edutrack.com', 'first_name': 'Raj', 'last_name': 'Kumar', 'password': 'pass123'},
    'student2': {'email': 'student2@edutrack.com', 'first_name': 'Priya', 'last_name': 'Singh', 'password': 'pass123'},
}

users = {}
for username, data in users_data.items():
    password = data.pop('password')
    if username == 'admin':
        user, created = User.objects.get_or_create(username=username, defaults={**data, 'is_superuser': True, 'is_staff': True})
    else:
        user, created = User.objects.get_or_create(username=username, defaults=data)
    
    if created:
        user.set_password(password)
        user.save()
        print(f"  + Created {username}")
    else:
        print(f"  - {username} already exists")
    users[username] = user

print()

# Create courses
print("Creating courses...")
instructor = users['instructor']
courses_data = [
    {
        'title': 'Data Structures & Algorithms',
        'description': 'Learn fundamental data structures and algorithms. This course covers arrays, linked lists, stacks, queues, trees, graphs, and various algorithmic techniques.'
    },
    {
        'title': 'Web Development',
        'description': 'Build modern web applications using HTML, CSS, JavaScript, and backend frameworks. Learn responsive design and API development.'
    },
    {
        'title': 'Database Management',
        'description': 'Master SQL, database design, normalization, and advanced querying techniques. Work with relational and NoSQL databases.'
    },
    {
        'title': 'Software Engineering',
        'description': 'Learn software development principles, design patterns, testing, and project management methodologies.'
    }
]

courses = []
for data in courses_data:
    course, created = Course.objects.get_or_create(
        title=data['title'],
        instructor=instructor,
        defaults={'description': data['description']}
    )
    if created:
        print(f"  + Created: {course.title}")
    else:
        print(f"  - {course.title} already exists")
    courses.append(course)

print()

# Enroll students in courses
print("Enrolling students...")
for course in courses:
    for username in ['student1', 'student2']:
        Enrollment.objects.get_or_create(student=users[username], course=course)
print(f"  + Students enrolled in all courses")

print()

# Create modules
print("Creating modules...")
modules_data = {
    courses[0]: [
        'Introduction to Data Structures',
        'Arrays and Linked Lists',
        'Stacks and Queues',
        'Trees and Graphs',
        'Sorting and Searching',
    ],
    courses[1]: [
        'HTML & CSS Basics',
        'JavaScript Fundamentals',
        'DOM Manipulation',
        'Responsive Design',
        'Backend Integration',
    ],
    courses[2]: [
        'SQL Basics and Queries',
        'Database Design & Normalization',
        'Indexing and Performance',
        'Transactions and ACID',
        'Backup and Recovery',
    ],
    courses[3]: [
        'Software Development Life Cycle',
        'Design Patterns',
        'Unit Testing',
        'Code Review & Best Practices',
        'Project Management',
    ]
}

module_count = 0
for course, module_titles in modules_data.items():
    for i, title in enumerate(module_titles, 1):
        Module.objects.get_or_create(
            course=course,
            title=title,
            defaults={'order': i}
        )
        module_count += 1

print(f"  + Created {module_count} modules")

print()

# Create assignments
print("Creating assignments...")
now = timezone.now()
assignments_data = [
    (courses[0], 'Array Implementation', 'Implement a dynamic array with insert, delete, and search operations.', 3, 100),
    (courses[0], 'Sorting Algorithms', 'Implement and compare Quick Sort, Merge Sort, and Heap Sort.', 7, 100),
    (courses[0], 'Graph Traversal', 'Implement BFS and DFS traversal algorithms.', 10, 100),
    (courses[1], 'Personal Portfolio Website', 'Create a responsive portfolio website using HTML, CSS, and JavaScript.', 10, 100),
    (courses[1], 'JavaScript Todo App', 'Build a todo application with add, delete, and filter functionality.', 5, 100),
    (courses[2], 'Database Schema Design', 'Design a normalized database schema for an e-commerce system.', 4, 100),
    (courses[2], 'SQL Queries Challenge', 'Write complex SQL queries for data analysis.', 8, 100),
    (courses[3], 'Design Pattern Implementation', 'Implement 5 different design patterns in your preferred language.', 12, 100),
]

assignment_count = 0
for course, title, description, days, max_marks in assignments_data:
    Assignment.objects.get_or_create(
        course=course,
        title=title,
        defaults={
            'description': description,
            'due_date': now + timedelta(days=days),
            'max_marks': max_marks
        }
    )
    assignment_count += 1

print(f"  + Created {assignment_count} assignments")

print()

# Create announcements
print("Creating announcements...")
announcements_data = [
    (courses[0], 'Assignment 1 Extended', 'Due to popular request, the deadline for Array Implementation has been extended to next week.'),
    (courses[0], 'Midterm Exam Schedule', 'The midterm exam will be held on April 25, 2026. Topics covered: Arrays, Linked Lists, Stacks.'),
    (courses[1], 'New Resource Available', 'Check out the new video series on responsive design in the course materials.'),
    (courses[2], 'Database Lab Session', 'Lab session on SQL optimization techniques will be held on Thursday at 3 PM.'),
    (courses[3], 'Group Project Announcement', 'Group projects are now available in the Assignments section. Form teams of 3-4.'),
]

announcement_count = 0
for course, title, message in announcements_data:
    Announcement.objects.get_or_create(
        course=course,
        title=title,
        defaults={'message': message}
    )
    announcement_count += 1

print(f"  + Created {announcement_count} announcements")

print()

# Clear existing submissions to avoid duplicates
print("Clearing existing submissions...")
Submission.objects.all().delete()
print("  ✓ Cleared all submissions")

print()

# Create clean submissions - one per student per assignment
print("Creating submissions...")
assignments = Assignment.objects.all()[:5]
submission_count = 0

feedback_messages = {
    1: 'Great implementation! Your binary tree logic is clean and efficient. Well done!',
    2: 'Good effort. The responsive design looks good on mobile and desktop. Minor CSS improvements needed.',
    3: None,
    4: 'Excellent work on the array implementation. Your algorithm is optimal with O(n) time complexity.',
    5: 'The sorting algorithm works correctly. Try to optimize the space complexity in future submissions.'
}

for i, assignment in enumerate(assignments, 1):
    student = users[f'student{(i % 2) + 1}']
    
    # Some submissions are graded, some under review, some submitted
    if i % 3 == 0:
        status = 'submitted'
        marks = None
        feedback = ''
    elif i % 3 == 1:
        status = 'graded'
        marks = 90 + i
        feedback = feedback_messages.get(i, 'Well done!')
    else:
        status = 'under_review'
        marks = None
        feedback = ''
    
    # Use get_or_create with explicit student and assignment
    submission, created = Submission.objects.get_or_create(
        assignment=assignment,
        student=student,
        defaults={
            'file': f'submissions/student{(i % 2) + 1}_assignment{i}.pdf',
            'status': status,
            'marks_obtained': marks,
            'feedback': feedback,
        }
    )
    if created:
        submission_count += 1
        print(f"  ✓ Created submission: {student.username} -> {assignment.title} ({status})")
    else:
        print(f"  ⊙ Submission already exists: {student.username} -> {assignment.title}")

print(f"  + Total submissions: {submission_count} created")

print()
print("="*50)
print("SUCCESS: All sample data created!")
print("="*50)
print()
print("Login Credentials:")
print("  Admin:      admin / admin123")
print("  Instructor: instructor / pass123")
print("  Student 1:  student1 / pass123")
print("  Student 2:  student2 / pass123")
print()
