from django.urls import path
from .views import PostListCreateView, PostDetailView, PostLikeView, CommentListCreateView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('<int:pk>/like/', PostLikeView.as_view(), name='post-like'),
    path('<int:pk>/comments/', CommentListCreateView.as_view(), name='post-comments'),
]
