from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.serializers import UserSerializer
from .models import Subscription


class ActivatePremiumView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_premium = True
        user.save(update_fields=['is_premium'])

        Subscription.objects.update_or_create(
            user=user,
            defaults={'plan': 'premium', 'status': 'active'},
        )

        return Response(UserSerializer(user).data)


class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = getattr(request.user, 'subscription', None)
        return Response({
            'is_premium': request.user.is_premium,
            'subscription': {
                'plan': sub.plan,
                'status': sub.status,
                'started_at': sub.started_at,
                'expires_at': sub.expires_at,
            } if sub else None,
        })
