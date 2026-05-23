from django.urls import path, include
from rest_framework import routers

from .views import (
    TaskView
)


urlpatterns = [
    path('tasks/', TaskView.as_view()),
]