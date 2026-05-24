from django.urls import path

from .views.auth_views import (
    RegisterView,
    LoginView,
    ProfileView,
    MakeAdminView
)
from .views.project_views import (
    CreateProjectView,
    GetAllProjectsView,
    GetSingleProjectView,
    DeleteProjectView,
    AddMemberToProjectView,
)
from .views.task_views import (
    CreateTaskView,
    GetTasksView,
    SetTaskCompletedView
)

urlpatterns = [

    path(
        'register/',
        RegisterView.as_view()
    ),

    path(
        'login/',
        LoginView.as_view()
    ),

    path(
        'profile/',
        ProfileView.as_view()
    ),

    path(
        'make-admin/',
        MakeAdminView.as_view()
    ),
    path(
        'create_project/',
        CreateProjectView.as_view()
    ),
        path(
        'get_all_projects/',
        GetAllProjectsView.as_view()
    ),
        path(
        'get_single_project/',
        GetSingleProjectView.as_view()
    ),
        path(
        'delete_project/',
            DeleteProjectView.as_view()
    ),
        path(
        'add_member_to_project/',
        AddMemberToProjectView.as_view()
    ),
        path(
        'create_task/',
        CreateTaskView.as_view()
    ), 
        path(
        'set_taskcompleted/',
        SetTaskCompletedView.as_view()
    ),
        path(
        'get_tasks/',
        GetTasksView.as_view()
    ),
]