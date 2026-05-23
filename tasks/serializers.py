from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(max_length=50))
    attachments = serializers.ListField(child=serializers.CharField(max_length=50))
    class Meta:
        model = Task
        fields = "__all_"