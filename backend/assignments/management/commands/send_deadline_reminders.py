from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from assignments.models import Assignment, Submission
from courses.models import Enrollment

class Command(BaseCommand):
    help = 'Send deadline reminders to students for upcoming assignments'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=1,
            help='Send reminders for assignments due in X days (default: 1)',
        )

    def handle(self, *args, **options):
        days_ahead = options['days']
        reminder_date = timezone.now().date() + timedelta(days=days_ahead)
        
        self.stdout.write(f'Sending deadline reminders for assignments due on {reminder_date}...')
        
        # Get assignments due on the reminder date
        upcoming_assignments = Assignment.objects.filter(due_date=reminder_date)
        
        reminders_sent = 0
        
        for assignment in upcoming_assignments:
            # Get enrolled students who haven't submitted yet
            enrolled_students = Enrollment.objects.filter(course=assignment.course)
            submitted_student_ids = Submission.objects.filter(
                assignment=assignment
            ).values_list('student_id', flat=True)
            
            pending_students = enrolled_students.exclude(student_id__in=submitted_student_ids)
            
            recipient_emails = [
                enrollment.student.email 
                for enrollment in pending_students 
                if enrollment.student.email
            ]
            
            if recipient_emails:
                subject = f'Assignment Deadline Reminder: {assignment.title}'
                message = f"""
Dear Student,

This is a reminder that your assignment "{assignment.title}" in the course "{assignment.course.title}" is due tomorrow ({assignment.due_date.strftime('%B %d, %Y')}).

Please make sure to submit your assignment before the deadline to avoid penalties.

Assignment Details:
- Course: {assignment.course.title}
- Due Date: {assignment.due_date.strftime('%B %d, %Y')}
- Maximum Marks: {assignment.max_marks}

Description:
{assignment.description}

Best regards,
EduTrack Team
{assignment.course.instructor.get_full_name() or assignment.course.instructor.username}
                """
                
                try:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=recipient_emails,
                        fail_silently=False,
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f'Sent reminder for "{assignment.title}" to {len(recipient_emails)} students')
                    )
                    reminders_sent += 1
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Failed to send reminder for "{assignment.title}": {e}')
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully sent {reminders_sent} deadline reminders')
        )