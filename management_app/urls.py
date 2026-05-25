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
    GetAllMembersView,
    GetVersionHistoryView,
    ImageSaveView,
    GetCompletedImageView
    
    
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
        'get_all_members/',
        GetAllMembersView.as_view()    
        ),
        path(
            'get_version_history/',
            GetVersionHistoryView.as_view()  
        ),
        path(
            'save_image/',
            ImageSaveView.as_view()
    ),
        path(
    'tasks/completion-image/<int:task_id>/',
    GetCompletedImageView.as_view(),
    name='completion-image'
)
        
]