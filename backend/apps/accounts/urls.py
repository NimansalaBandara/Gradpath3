from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView, ProfileUpdateView,
    AdminStatsView, AdminUserListView, AdminUserUpdateView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(),           name='auth-register'),
    path('login/',    TokenObtainPairView.as_view(),    name='auth-login'),
    path('refresh/',  TokenRefreshView.as_view(),       name='auth-refresh'),
    path('me/',       MeView.as_view(),                 name='auth-me'),
    path('profile/',  ProfileUpdateView.as_view(),      name='auth-profile'),
    # Admin
    path('admin/stats/',            AdminStatsView.as_view(),      name='admin-stats'),
    path('admin/users/',            AdminUserListView.as_view(),    name='admin-users'),
    path('admin/users/<int:pk>/',   AdminUserUpdateView.as_view(), name='admin-user-update'),
]
