from django.urls import path
from .views import ActivatePremiumView, SubscriptionStatusView

urlpatterns = [
    path('activate/',     ActivatePremiumView.as_view(),    name='billing-activate'),
    path('subscription/', SubscriptionStatusView.as_view(), name='billing-subscription'),
]
