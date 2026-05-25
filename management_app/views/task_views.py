from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import (
    IsAuthenticated
)

from ..models import (
    Users,
    Projects,
    Members,
    Tasks
    
)

from ..authentication import (
    JWTAuthentication
)

from django.forms.models import model_to_dict

class CreateTaskView(APIView):
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
    
    def post(self, request):

        user = request.user
        # project = Projects.objects.get(id=request.data.get("project_id"))
        project_id = request.data.get(
            'project_id'
        )
        print(project_id)
        project = Projects.objects.get(id=project_id)

        # role = Members.objects.get(project__id=project.id, user__id=user.id)



        title = request.data.get(
            'title'
        )

        description = request.data.get(
            'description'
        )

        alloted_to = Users.objects.get(id=request.data.get(
            'alloted_id'
        ))

        deadline = request.data.get(
            'deadline'
        )

        priority = request.data.get(
            'priority'
        )



        if not title or not description:

            return Response(
                {
                    "success": False,
                    "message": "Title and description are required"
                },
                status=400
            )

        task = Tasks.objects.create(

            allotted_by=user,

            allotted_to=alloted_to,

            title=title,

            description=description,

            deadline = deadline,

            PRIORITY=priority,

            project=project


        )
        task_dict = model_to_dict(task)

        task_dict["priority"] = task.PRIORITY
        task_dict["alloted_to"] = alloted_to.username


        return Response(
            {
                "success": True,
                "message": "Project created successfully",
                "task": task_dict
            },
            status=201
        )

class GetTasksView(APIView):
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
   

    def get(self, request):
        project_id = request.query_params.get('project_id')
        tasks = Tasks.objects.filter(project__id=project_id).order_by('deadline')
        print(project_id, tasks)
        task_data = []

        for task in tasks:

            task_data.append({

                "id": task.id,
                "alloted_by": task.allotted_by.username,
                "alloted_to":task.allotted_to.username,
                "alloted_at":task.allotted_at,
                "title":task.title,
                "description":task.description,
                "deadline":task.deadline,
                "priority":task.PRIORITY,
                "is_completed":task.is_completed,
                "created_at":task.created_at,
                # "tags":task.tags
            
            })
        
        prio_dict = {'LOW': 3, 'MEDIUM': 2, 'HIGH': 1}
        task_data = sorted(
            task_data, 
            key=lambda task: prio_dict[task["priority"]]
        )

        return Response(
            {
                "success": True,
                "tasks": task_data
            },
            status=200
        )

class SetTaskCompletedView(APIView):
    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]
    def patch(self, request):
        task_id = request.data.get("task_id")
        task = Tasks.objects.get(id=task_id)
        user = request.user
        
        if task.allotted_by.id == user.id:
            task.is_completed = True
            return Response(
                {
                    "success": True,
                },
                status=200
            )
        else:
            return Response(
            {
                "success": False,
            },
            status=403
        )

