import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.room_group_name = f'chat_{self.project_id}'
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return

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
        content = data.get('content')

        if not content:
            return

        msg = await self.save_message(self.user, self.project_id, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': msg.id,
                'project_id': msg.project_id,
                'sender_id': msg.sender_id,
                'username': self.user.username,
                'alias': self.user.alias,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'project_id': event['project_id'],
            'sender_id': event['sender_id'],
            'username': event['username'],
            'alias': event['alias'],
            'content': event['content'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def save_message(self, user, project_id, content):
        return Message.objects.create(project_id=project_id, sender=user, content=content)
