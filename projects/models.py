from django.db import models
from management_app.models import Users


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    # studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name='projects')
    created_by = models.ForeignKey(Users, on_delete=models.SET_NULL, related_name='created_projects', null=True)
    created_at = models.DateTimeField()
    
    class Stage(models.TextChoices):
        DRAFT = "draft", "Draft"
        REVIEW = "review", "Review"
        REVISION = "revision", "Revision"
        APPROVED = "approved", "Approved"
        COMPLETED = "completed", "Completed"
        ARCHIVED = "archived", "Archived"
    stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.DRAFT)
    
    members = models.ManyToManyField(Users, through='ProjectMembership', related_name='projects')

    def __str__(self):
        return self.name

class ProjectMembership(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    class Roles(models.TextChoices):
        STUDIO_ADMIN = 'studio_admin', 'Studio Admin'
        PROJECT_LEAD = 'project_lead', 'Project Lead'
        DESIGNER = 'designer', 'Designer'
        WRITER = 'writer', 'Writer'
        REVIEWER = 'reviewer', 'Reviewer'
        CLIENT_VIEWER = 'client_viewer', 'Client Viewer'
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.REVIEWER)

    class Meta:
        unique_together = ('project', 'user')