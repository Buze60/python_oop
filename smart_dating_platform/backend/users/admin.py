from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

@admin.action(description='Approve selected user verifications')
def approve_verifications(modeladmin, request, queryset):
    for profile in queryset:
        if profile.verification_status != 'verified':
            profile.verification_status = 'verified'
            profile.trust_score += 30
            profile.save()

@admin.action(description='Reject selected user verifications')
def reject_verifications(modeladmin, request, queryset):
    queryset.update(verification_status='rejected')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'verification_status', 'intent', 'gender', 'location')
    list_filter = ('verification_status', 'intent', 'gender')
    search_fields = ('user__username', 'location', 'bio')
    actions = [approve_verifications, reject_verifications]

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
