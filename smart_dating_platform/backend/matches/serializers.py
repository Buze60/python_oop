from rest_framework import serializers
from .models import Swipe, Match
from users.serializers import ProfileSerializer, UserSerializer

class SwipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swipe
        fields = ['id', 'swiped', 'is_like', 'created_at']

class MatchSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'user1', 'user2', 'created_at', 'is_active']
