from django.urls import path, include
from rest_framework import routers

from .views import (
    ProjectView,
    ProjectViewSet
)

router = routers.DefaultRouter()
router.register(r"projectsview", ProjectViewSet)

urlpatterns = [
    path('projects/', ProjectView.as_view()),
    # path('projviewset/', ProjectViewSet.as_view()),
    path("", include(router.urls)),

]