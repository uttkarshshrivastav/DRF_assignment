from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from .models import TaskComment

class TaskCommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.room_group_name = f'task_{self.task_id}_comments'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data['content']
        user = self.scope['user']

        await self.save_task_comment(self.task_id, user, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'task_message',
                'content': content,
                'username': user.username,
                'alias': getattr(user, 'alias', None)
            }
        )

    async def task_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['content'],
            'username': event['username'],
            'alias': event['alias']
        }))

    @database_sync_to_async
    def save_task_comment(self, task_id, user, content):
        return TaskComment.objects.create(task_id=task_id, author=user, content=content)