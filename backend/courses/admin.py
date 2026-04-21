from django.contrib import admin
from .models import Course, Enrollment, Module, Announcement

admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(Module)
admin.site.register(Announcement)
