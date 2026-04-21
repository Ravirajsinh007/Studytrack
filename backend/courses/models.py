from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title= models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Enrollment(models.Model):
    student=models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course=models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at=models.DateTimeField(auto_now_add=True)

class Module(models.Model):
    course=models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title=models.CharField(max_length=200)
    content=models.TextField(blank=True)
    resource_link=models.URLField(blank=True)
    order=models.IntegerField(default=0)

class Announcement(models.Model):
    course=models.ForeignKey(Course, on_delete=models.CASCADE, related_name='announcements')
    title=models.CharField(max_length=200)
    message=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)