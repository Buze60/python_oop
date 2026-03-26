from django.contrib import admin
from .models import Swipe, Match, AgentSuggestion

class SwipeAdmin(admin.ModelAdmin):
    list_display = ('swiper', 'swiped', 'is_like', 'created_at')
    list_filter = ('is_like', 'created_at')
    search_fields = ('swiper__username', 'swiped__username')

class MatchAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user1__username', 'user2__username')

class AgentSuggestionAdmin(admin.ModelAdmin):
    list_display = ('agent', 'user1', 'user2', 'is_accepted', 'created_at')
    list_filter = ('is_accepted',)

admin.site.register(Swipe, SwipeAdmin)
admin.site.register(Match, MatchAdmin)
admin.site.register(AgentSuggestion, AgentSuggestionAdmin)
