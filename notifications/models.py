from django.db import models
from management_app.models import Users, Tasks

class DelayedReminder(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='reminders')
    task = models.ForeignKey(Tasks, on_delete=models.CASCADE)
    reminder_message = models.TextField()
    scheduled_time = models.DateTimeField()
    is_sent = models.BooleanField(default=False)