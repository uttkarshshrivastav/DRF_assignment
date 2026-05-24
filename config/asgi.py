import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from management_app.middleware import CustomJWTAuthMiddlewareStack

from <chat_folder>.routing import websocket_urlpatterns as chat_urls
from <comment_folder>.routing import websocket_urlpatterns as comment_urls
from <notification_folder>.routing import websocket_urlpatterns as notif_urls

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": CustomJWTAuthMiddlewareStack(
        URLRouter(
            chat_urls + comment_urls + notif_urls
        )
    ),
})