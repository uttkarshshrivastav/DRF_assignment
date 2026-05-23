from django.urls import path, include
from rest_framework import routers

from .views import (
    CreateProjectView,
    GetProjectsView,
    ProjectViewSet
)

router = routers.DefaultRouter()
router.register(r"projects", ProjectViewSet)

urlpatterns = [
    path('createproject/', CreateProjectView.as_view()),
    path('getproject/',GetProjectsView.as_view()),
    # path('projviewset/', ProjectViewSet.as_view()),
    path("", include(router.urls)),

]