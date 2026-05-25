from django.db import models
from management_app.models import Users

class Message(models.Model):
    project_id = models.IntegerField()
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
