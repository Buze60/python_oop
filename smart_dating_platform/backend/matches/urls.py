from django.urls import path
from .views import SwipeView, MatchListView, DiscoverView, AISmartMatchView, AgentSuggestionsView

urlpatterns = [
    path('discover/', DiscoverView.as_view(), name='discover'),
    path('ai-smart/', AISmartMatchView.as_view(), name='ai-smart'),
    path('agent/', AgentSuggestionsView.as_view(), name='agent'),
    path('swipe/', SwipeView.as_view(), name='swipe'),
    path('list/', MatchListView.as_view(), name='match-list'),
]
