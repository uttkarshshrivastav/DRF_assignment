from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from management_app.models import Tasks, Notifications

@receiver(post_save, sender=Tasks)
def instant_task_assignment_notification(sender, instance, created, **kwargs):
    if created and instance.allotted_to:
        notif = Notifications.objects.create(
            task=instance,
            delivered_to=instance.allotted_to,
            title="task_allocated",
            content=f"You have been assigned to the task: {instance.title}"
        )
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{instance.allotted_to.id}',
            {
                'type': 'send_notification',
                'id': notif.id,
                'title': notif.title,
                'message': notif.content,
                'created_at': notif.created_at.isoformat()
            }
        )