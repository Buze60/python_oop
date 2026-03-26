from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Swipe(models.Model):
    swiper = models.ForeignKey(User, related_name='swipes_made', on_delete=models.CASCADE)
    swiped = models.ForeignKey(User, related_name='swipes_received', on_delete=models.CASCADE)
    is_like = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('swiper', 'swiped')

    def __str__(self):
        return f"{self.swiper} -> {self.swiped} ({'Like' if self.is_like else 'Pass'})"

class Match(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_2')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user1', 'user2')

    def __str__(self):
        return f"Match: {self.user1.username} & {self.user2.username}"

class AgentSuggestion(models.Model):
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agent_suggestions')
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='curated_1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='curated_2')
    is_accepted = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')
