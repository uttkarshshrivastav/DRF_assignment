import jwt

from django.conf import settings

from rest_framework.authentication import (
    BaseAuthentication
)

from rest_framework.exceptions import (
    AuthenticationFailed
)

from .models import Users


class JWTAuthentication(
    BaseAuthentication
):

    def authenticate(
        self,
        request
    ):

        auth_header = request.headers.get(
            'Authorization'
        )

        if not auth_header:
            return None

        try:

            token = auth_header.split(' ')[1]

            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )

            user = Users.objects.get(
                id=payload['id']
            )

            return (user, None)

        except jwt.ExpiredSignatureError:

            raise AuthenticationFailed(
                'Token expired'
            )

        except jwt.InvalidTokenError:

            raise AuthenticationFailed(
                'Invalid token'
            )