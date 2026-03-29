from django.urls import path
from .import views
# url configuration for playgound app
urlpatterns = [
    path('hello/', views.say_hello),
]