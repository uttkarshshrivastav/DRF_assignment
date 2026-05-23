from rest_framework import serializers
from .models import Project, ProjectMembership

class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ProjectMembership
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    memberships = ProjectMembershipSerializer(source="projectmembership_set", many=True, read_only=True)
    created_by = serializers.SlugRelatedField(read_only=True, slug_field="username")
    members = serializers.SlugRelatedField(read_only=True, slug_field="username", many=True)
    class Meta:
        model = Project
        fields = "__all__"