import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edutrack.settings')
django.setup()

from django.contrib.auth.models import User

u = User.objects.filter(username='student1').first()
print(f'User exists: {u is not None}')
if u:
    print(f'Password valid: {u.check_password("pass123")}')
    print(f'Is active: {u.is_active}')
    print(f'Is staff: {u.is_staff}')
else:
    print("User not found")