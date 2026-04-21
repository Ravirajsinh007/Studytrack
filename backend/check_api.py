import requests
import json

# Login first
response = requests.post('http://127.0.0.1:8000/api/auth/login/', json={'username': 'student1', 'password': 'pass123'})
token = response.json()['access']

# Get submissions
headers = {'Authorization': f'Bearer {token}'}
subs_response = requests.get('http://127.0.0.1:8000/api/students/submissions/', headers=headers)
submissions = subs_response.json()

print('Sample submissions data:')
for i, sub in enumerate(submissions[:5]):
    marks = sub.get('marks_obtained')
    max_marks = sub.get('assignment_max_marks')
    if marks is not None and max_marks:
        pct = (marks / max_marks) * 100
        print(f'  {i+1}. {sub["assignment_title"]}: {marks}/{max_marks} = {pct:.1f}%')
    else:
        print(f'  {i+1}. {sub["assignment_title"]}: marks_obtained={marks}, assignment_max_marks={max_marks}')