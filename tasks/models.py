from django.db import models
from projects.models import Project
from management_app.models import Users

class Task(models.Model):
    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'

    class Stage(models.TextChoices):
        TODO = 'TODO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        REVIEW = 'REVIEW', 'In Review'
        DONE = 'DONE', 'Done'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    description = models.TextField()
    created_by = models.ForeignKey(Users, on_delete=models.SET_NULL, related_name='created_tasks', null=True)
    
    assignees = models.ManyToManyField(Users, related_name='assigned_tasks', blank=True)
    
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.LOW)
    stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.TODO)
    deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField()
    
    tags = models.JSONField(default=list, blank=True)
    attachments = models.JSONField(default=list, blank=True)
