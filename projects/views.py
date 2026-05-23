from rest_framework import viewsets
from .models import Project, ProjectMembership
from .serializers import ProjectSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from management_app.authentication import JWTAuthentication
# from rest_framework

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        print(self.request.user)
        project = serializer.save(created_by=self.request.user)

        ProjectMembership.objects.create(project=project, user=self.request.user, role=ProjectMembership.Roles.PROJECT_LEAD)

class ProjectView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                    "success": True,
                    "message": "Project Created"
                },
                status=status.HTTP_201_CREATED)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request):
        project = ProjectSerializer(data=request.data)
        if not project.is_valid():
            return Response(project.errors, status=status.HTTP_400_BAD_REQUEST)

        # creator = project.created_by
        user = request.user
        role = project.get_projectmembership.get(user=user).role
        if role == ProjectMembership.Roles.STUDIO_ADMIN or role == ProjectMembership.Roles.PROJECT_LEAD:
            # delete
            Project.objects.get(id=project.id).delete()
            print("Deleted: ", project.id, project.name)
            return Response({"success":True, "message":"Project Deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"success":False, "message":"Permission Denied"}, status=status.HTTP_403_FORBIDDEN)
