from django.db import models
from management_app.models import Tasks, Users

class TaskComment(models.Model):
    task = models.ForeignKey(Tasks, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(Users, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)