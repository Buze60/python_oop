from django.db.models.signals import post_save
from django.dispatch import receiver
from matches.models import Match
from chat.models import Message
from .models import Notification

@receiver(post_save, sender=Match)
def notify_new_match(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user1,
            title="New Match!",
            message=f"You and {instance.user2.username} liked each other."
        )
        Notification.objects.create(
            user=instance.user2,
            title="New Match!",
            message=f"You and {instance.user1.username} liked each other."
        )

@receiver(post_save, sender=Message)
def notify_new_message(sender, instance, created, **kwargs):
    if created:
        recipient = instance.match.user2 if instance.sender == instance.match.user1 else instance.match.user1
        Notification.objects.create(
            user=recipient,
            title=f"New message from {instance.sender.username}",
            message=instance.content[:50] + "..." if len(instance.content) > 50 else instance.content
        )
