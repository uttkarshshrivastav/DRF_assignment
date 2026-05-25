from celery import shared_task
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from management_app.models import Notifications
from .models import DelayedReminder

@shared_task
def check_and_send_delayed_reminders():
    now = timezone.now()
    pending_reminders = DelayedReminder.objects.filter(
        scheduled_time__lte=now,
        is_sent=False
    )
    channel_layer = get_channel_layer()

    for reminder in pending_reminders:
        notif = Notifications.objects.create(
            user=reminder.user,
            title="task_deadline",
            message=reminder.reminder_message
        )

        async_to_sync(channel_layer.group_send)(
            f'notifications_{reminder.user.id}',
            {
                'type': 'send_notification',
                'id': notif.id,
                'title': notif.title,
                'message': notif.message,
                'created_at': notif.created_at.isoformat()
            }
        )
        
        reminder.is_sent = True
        reminder.save()