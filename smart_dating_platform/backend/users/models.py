from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username

class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    INTENT_CHOICES = [
        ('serious', 'Serious relationship'),
        ('casual', 'Casual'),
        ('marriage', 'Marriage'),
    ]
    VERIFICATION_CHOICES = (
        ('unverified', 'Unverified'),
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    intent = models.CharField(max_length=20, choices=INTENT_CHOICES, blank=True, null=True)
    interests = models.JSONField(default=list, blank=True)
    
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='unverified')
    id_photo = models.ImageField(upload_to='id_photos/', null=True, blank=True)
    trust_score = models.IntegerField(default=50)

    def __str__(self):
        return f"{self.user.username}'s Profile"
