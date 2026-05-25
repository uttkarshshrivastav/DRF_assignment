from django.shortcuts import render
import jwt
import datetime

from django.conf import settings
from decouple import config

from django.contrib.auth.hashers import (
    check_password
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import (
    IsAuthenticated
)

from ..models import Users

from ..serializers import (
    RegisterSerializer
)

from ..authentication import (
    JWTAuthentication
)


ADMIN_CODE = config(
    'ADMIN_ACCESS_CODE'
)


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "User registered"
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    def post(self, request):

        email = request.data.get(
            'email'
        )

        password = request.data.get(
            'password'
        )

        try:

            user = Users.objects.get(
                email=email
            )

        except Users.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Invalid email"
                },
                status=401
            )

        if not check_password(
            password,
            user.password
        ):

            return Response(
                {
                    "success": False,
                    "message": "Invalid password"
                },
                status=401
            )

        payload = {

            'id': user.id,

            'email': user.email,

            'is_admin': user.is_admin,

            'exp': (
                datetime.datetime.utcnow()
                + datetime.timedelta(days=1)
            ),

            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        return Response({
            "success": True,
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
                "alias":user.alias,

            }
        })


class ProfileView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "is_admin": request.user.is_admin
        })


class MakeAdminView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        entered_code = request.data.get(
            'key'
        )

        if entered_code != ADMIN_CODE:

            return Response(
                {
                    "success": False,
                    "message": "Invalid admin code"
                },
                status=403
            )

        user = request.user

        user.is_admin = True

        user.save()

        return Response({
            "success": True,
            "is_admin": "Admin access granted"
        })

class GetAllUsersView(APIView):
    
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
    
    def get(self,request):
        user = Users.objects.get(id=request.user.id)
        if not user.is_admin:
            return Response(
                {
                    "success": False,
                    "message": "only admin can add members in the project"
                },
                status=403
            ) 
        
        users_all=[]
        try:
            users = Users.objects.all()
        except Users.DoesNotExist:
            return Response(
                {
                    "success":False,
                    "message":"no users "
                }
            )
        
        for u in users:
            users_all.append({
                "id": u.id,
                "username":u.username,
            })
        return Response(
            {
                "success":True,
                "users":users_all
            },
            status=200
        )

# Create your views here.
