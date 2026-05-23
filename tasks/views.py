from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from projects.models import Project, ProjectMembership
# from projects.serializers import Pro

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from management_app.authentication import JWTAuthentication




class TaskView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)

        # creator = serializer.created_by
        # project = serializer.project
        # role = project.get_projectmembership.get(user=creator).role
        # if role != ProjectMembership.Roles.

        if serializer.is_valid():
            serializer.save()
            return Response({
                    "success": True,
                    "message": "Task Created"
                },
                status=status.HTTP_201_CREATED)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):
        project = Project.objects.get(id=request.project_id)
        print(project.tasks())
        tasks = Task.objects.filter(project=project)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    