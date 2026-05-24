import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import StageComment

class StageCommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.stage_name = self.scope['url_route']['kwargs']['stage_name'].lower()
        self.room_group_name = f'comments_{self.project_id}_{self.stage_name}'
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

        msg = await self.save_stage_comment(self.user, self.project_id, self.stage_name, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'stage_message',
                'id': msg.id,
                'project_id': msg.project_id,
                'stage_name': msg.stage_name,
                'sender_id': msg.sender_id,
                'username': self.user.username,
                'alias': self.user.alias,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            }
        )

    async def stage_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'project_id': event['project_id'],
            'stage_name': event['stage_name'],
            'sender_id': event['sender_id'],
            'username': event['username'],
            'alias': event['alias'],
            'content': event['content'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def save_stage_comment(self, user, project_id, stage_name, content):
        return StageComment.objects.create(
            project_id=project_id,
            stage_name=stage_name,
            sender=user,
            content=content
        )