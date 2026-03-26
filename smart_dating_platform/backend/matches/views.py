from datetime import date, timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Swipe, Match
from .serializers import SwipeSerializer, MatchSerializer
from users.models import User
from users.serializers import UserSerializer

class DiscoverView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = User.objects.filter(is_active=True).exclude(id=user.id)
        
        swiped_ids = Swipe.objects.filter(swiper=user).values_list('swiped_id', flat=True)
        qs = qs.exclude(id__in=swiped_ids)
        
        params = self.request.query_params
        
        gender = params.get('gender')
        if gender:
            qs = qs.filter(profile__gender=gender)
            
        intent = params.get('intent')
        if intent:
            qs = qs.filter(profile__intent=intent)
            
        location = params.get('location')
        if location:
            qs = qs.filter(profile__location__icontains=location)
            
        min_age = params.get('min_age')
        if min_age and min_age.isdigit():
            max_date = date.today() - timedelta(days=int(min_age)*365.2425)
            qs = qs.filter(profile__birth_date__lte=max_date)
            
        max_age = params.get('max_age')
        if max_age and max_age.isdigit():
            min_date = date.today() - timedelta(days=(int(max_age)+1)*365.2425)
            qs = qs.filter(profile__birth_date__gt=min_date)
            
        return qs.order_by('?')[:20]

class SwipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        swiped_id = request.data.get('swiped')
        is_like = request.data.get('is_like', False)
        
        try:
            swiped_user = User.objects.get(id=swiped_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if swiped_user == request.user:
            return Response({"error": "Cannot swipe on yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        swipe, created = Swipe.objects.get_or_create(
            swiper=request.user,
            swiped=swiped_user,
            defaults={'is_like': is_like}
        )
        
        if not created:
            swipe.is_like = is_like
            swipe.save()

        is_match = False
        if is_like:
            has_swiped_back = Swipe.objects.filter(swiper=swiped_user, swiped=request.user, is_like=True).exists()
            if has_swiped_back:
                user1, user2 = sorted([request.user, swiped_user], key=lambda u: u.id)
                Match.objects.get_or_create(user1=user1, user2=user2)
                is_match = True

        return Response({"match": is_match}, status=status.HTTP_200_OK)

class MatchListView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(Q(user1=user) | Q(user2=user), is_active=True).order_by('-created_at')

class AISmartMatchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = User.objects.filter(is_active=True).exclude(id=user.id)
        swiped_ids = Swipe.objects.filter(swiper=user).values_list('swiped_id', flat=True)
        qs = qs.exclude(id__in=swiped_ids)
        
        my_intent = user.profile.intent
        my_interests = set(user.profile.interests) if isinstance(user.profile.interests, list) else set()
        
        scored_users = []
        for other in qs:
            score = other.profile.trust_score
            if other.profile.intent == my_intent:
                score += 25
            other_interests = set(other.profile.interests) if isinstance(other.profile.interests, list) else set()
            overlap = my_interests.intersection(other_interests)
            score += len(overlap) * 10
            
            other.match_score = score
            scored_users.append(other)
            
        scored_users.sort(key=lambda u: u.match_score, reverse=True)
        return scored_users[:10]

from .models import AgentSuggestion

class AgentSuggestionsView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        suggestions = AgentSuggestion.objects.filter(Q(user1=user) | Q(user2=user), is_accepted__isnull=True)
        
        suggested_users = []
        for s in suggestions:
            suggested_users.append(s.user2 if s.user1 == user else s.user1)
                
        return suggested_users

