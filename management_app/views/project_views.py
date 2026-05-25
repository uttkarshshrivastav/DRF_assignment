from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import (
    IsAuthenticated
)

from ..models import (
    Users,
    Projects,
    Members
    
)

from ..authentication import (
    JWTAuthentication
)


class CreateProjectView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        user = request.user

        # if not user.is_admin:

        #     return Response(
        #         {
        #             "success": False,
        #             "message": "Only admins can create projects"
        #         },
        #         status=403
        #     )

        title = request.data.get(
            'title'
        )

        description = request.data.get(
            'description'
        )

        if not title or not description:

            return Response(
                {
                    "success": False,
                    "message": "Title and description are required"
                },
                status=400
            )

        project = Projects.objects.create(

            created_by=user,

            title=title,

            description=description
        )

        return Response(
            {
                "success": True,
                "message": "Project created successfully",

                "project": {
                    "id": project.id,
                    "title": project.title,
                    "description": project.description,
                    "stage": project.stage,
                    "created_by": project.created_by.username
                }
            },
            status=201
        )


class GetAllProjectsView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
   

    def get(self, request):

        projects = Projects.objects.all()

        project_data = []

        for project in projects:

            project_data.append({

                "id": project.id,

                "title": project.title,

                "description": project.description,

                "stage": project.stage,

                "created_by": project.created_by.username,

                "created_at": project.created_at
            })

        return Response(
            {
                "success": True,
                "projects": project_data
            },
            status=200
        )


class GetSingleProjectView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, project_id):

        try:

            project = Projects.objects.get(
                id=project_id
            )

        except Projects.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Project not found"
                },
                status=404
            )

        return Response(
            {
                "success": True,

                "project": {
                    "id": project.id,
                    "title": project.title,
                    "description": project.description,
                    "stage": project.stage,
                    "created_by": project.created_by.username,
                    "created_at": project.created_at
                }
            },
            status=200
        )




class DeleteProjectView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def delete(self, request, project_id):

        user = request.user

        if not user.is_admin:

            return Response(
                {
                    "success": False,
                    "message": "Only admins can delete projects"
                },
                status=403
            )

        try:

            project = Projects.objects.get(
                id=project_id
            )

        except Projects.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Project not found"
                },
                status=404
            )

        project.delete()

        return Response(
            {
                "success": True,
                "message": "Project deleted successfully"
            },
            status=200
        )
        
        
class AddMemberToProjectView(APIView):
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
    
    def post (self,request,project_id):
        
        user=request.user 
        if not user.is_admin :
            return Response(
                {
                    "success": False,
                    "message": "only admin can add members in the project"
                },
                status=402
            ) 
        
        if not project_id :
            return Response(
                {
                    "success":False,
                    "message":"project_id required to add members to the project"
                },
                status=403
            )
        username = request.data.get(
            'username'
        )
        role = request.data.get(
            'role' 
        )
        try:

            project_set = Projects.objects.get(
                id=project_id
            )

        except Projects.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Project not found"
                },
                status=404
            )

        try:

            member_user = Users.objects.get(
                username=username
            )

        except Users.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "User not found"
                },
                status=404
            )


        
        member=Members.objects.create(
            project=project_set,
            user=member_user,
            role=role,
        )
        return Response(
            {
            "success": True,
            "message": "member created successfully",
                "member": {
                    "id":member.id,
                    "project":member.project.title,
                    "user":member.user.username,
                    "role":member.role,
                    "joined_at":member.joined_at
                },
            },
            status=201
        )
        
       


class GetAllMembersView(APIView):
    
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
    
    def get(self,request,project_id):
        
        try:
            project=Projects.objects.get(
                id=project_id
            )
        except Projects.DoesNotExist:
            return Response(
                {
                    "success":False,
                    "message":"This project doesn't exist"
                },
                status=402
            )
            
        members_all=[]
        get_project=project.id
        try:
            members=Members.objects.filter(
                project=get_project
            )
        except Members.DoesNotExist:
            return Response(
                {
                    "success":False,
                    "message":"no members exits for this project "
                }
            )
        for member in members:
            members_all.append({
                "id": member.id,
                "project":member.project.title,
                "user":member.user.username,
                "role":member.role,
                "joined_at":member.joined_at
            })
        return Response(
            {
                "success":True,
                "members":members_all
            },
            status=200
        )