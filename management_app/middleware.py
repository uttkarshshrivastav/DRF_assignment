import jwt
import urllib.parse
from django.conf import settings
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Users

@database_sync_to_async
def get_user_from_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return Users.objects.get(id=payload['id']) # EXACT FIX HERE
    except Exception:
        return AnonymousUser()

class CustomJWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token:
            scope['user'] = await get_user_from_jwt_token(token)
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)

def CustomJWTAuthMiddlewareStack(inner):
    return CustomJWTAuthMiddleware(inner)