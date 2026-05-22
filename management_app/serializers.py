from rest_framework import serializers

from django.contrib.auth.hashers import (
    make_password
)

from .models import Users


class RegisterSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Users

        fields = [
            'username',
            'alias',
            'email',
            'password'
        ]

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(
        self,
        validated_data
    ):

        validated_data[
            'password'
        ] = make_password(validated_data['password']        )

        return Users.objects.create(
            **validated_data
        )