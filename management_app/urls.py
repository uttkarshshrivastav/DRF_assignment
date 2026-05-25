from django.urls import path

from .views.auth_views import (
    RegisterView,
    LoginView,
    ProfileView,
    MakeAdminView,
    GetAllUsersView
)
from .views.project_views import (
    CreateProjectView,
    GetAllProjectsView,
    GetSingleProjectView,
    DeleteProjectView,
    AddMemberToProjectView,
    GetAllMembersView,
    UpdateProjectStageView
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
        'get_single_project/<int:project_id>/',
        GetSingleProjectView.as_view()
    ),
        path(
        'delete_project/<int:project_id>/',
            DeleteProjectView.as_view()
    ),
        path(
        'add_member_to_project/<int:project_id>/',
        AddMemberToProjectView.as_view()
    ),
        path(
        'get_all_members/',
        GetAllMembersView.as_view()    
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
        path(
        'get_all_users/',
        GetAllUsersView.as_view()
    ),
        path(
        'update_project_stage/',
        UpdateProjectStageView.as_view()
    ),
]