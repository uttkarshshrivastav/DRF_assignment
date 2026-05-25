# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)

    username = models.CharField(
        unique=True,
        max_length=150
    )

    alias = models.CharField(
        unique=True,
        max_length=50
    )

    email = models.CharField(
        unique=True,
        max_length=255
    )

    password = models.CharField(
        max_length=255
    )

    is_admin = models.BooleanField(
        default=False
    )

    is_authenticated = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = True
        db_table = 'users'

    def __str__(self):
        return self.username


class Projects(models.Model):

    STAGE_CHOICES = [
        ('initialized', 'Initialized'),
        ('draft', 'Draft'),
        ('review', 'Review'),
        ('revision', 'Revision'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
    ]

    id = models.BigAutoField(primary_key=True)

    created_by = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='created_by',
        related_name='projects_created'
    )

    title = models.CharField(
        max_length=255
    )

    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        default='initialized'
    )

    description = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = True
        db_table = 'projects'

    def __str__(self):
        return self.title


class Members(models.Model):

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('project_lead', 'Project Lead'),
        ('designer', 'Designer'),
        ('writer', 'Writer'),
        ('reviewer', 'Reviewer'),
        ('client_viewer', 'Client Viewer'),
    ]

    id = models.BigAutoField(primary_key=True)

    project = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        db_column='project_id',
        related_name='members'
    )

    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='user_id',
        related_name='project_memberships'
    )

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES
    )

    joined_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = True
        db_table = 'members'

        unique_together = ('project', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Tasks(models.Model):
    
    PRIORITY=[
        ('high','High'),
        ('moderate','Moderate'),
        ('low','Low'),
    ]

    id = models.BigAutoField(primary_key=True)

    allotted_by = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='allotted_by',
        related_name='tasks_allotted'
    )

    allotted_to = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='allotted_to',
        related_name='tasks_received'
    )

    allotted_at = models.DateTimeField(
        auto_now_add=True
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()
    
    deadline = models.DateTimeField()
    
    PRIORITY=models.CharField(
        max_length=10,
        choices=PRIORITY,
        default='moderate',
        
    )

    is_completed = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    project = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        db_column='project_id',
        related_name='tasks'
    )

    class Meta:
        managed = True
        db_table = 'tasks'

    def __str__(self):
        return self.title


class Notifications(models.Model):

    NOTIFICATION_TYPES = [
        ('task_allocated', 'Task Allocated'),
        ('task_deadline', 'Task Deadline'),
    ]

    id = models.BigAutoField(primary_key=True)

    task = models.ForeignKey(
        Tasks,
        on_delete=models.CASCADE,
        db_column='task_id',
        related_name='notifications'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    content = models.TextField()

    title = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )

    delivered_to = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='delivered_to',
        related_name='notifications'
    )

    class Meta:
        managed = True
        db_table = 'notifications'

    def __str__(self):
        return self.title
