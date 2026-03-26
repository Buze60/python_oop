from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer

class VerifyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        profile = request.user.profile
        id_photo = request.FILES.get('id_photo')
        if not id_photo:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.id_photo = id_photo
        profile.verification_status = 'pending'
        profile.save()
        return Response({"status": "Verification submitted successfully"}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

