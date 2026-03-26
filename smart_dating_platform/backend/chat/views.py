from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Message
from matches.models import Match
from .serializers import MessageSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        match_id = self.kwargs.get('match_id')
        return Message.objects.filter(match_id=match_id).order_by('timestamp')

    def perform_create(self, serializer):
        match_id = self.kwargs.get('match_id')
        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return
            
        if self.request.user != match.user1 and self.request.user != match.user2:
            return

        serializer.save(sender=self.request.user, match=match)

