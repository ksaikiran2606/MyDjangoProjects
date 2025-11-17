from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import LearningActivity, Category
from .serializers import (
    UserRegistrationSerializer, UserSerializer, LearningActivitySerializer,
    LearningActivityCreateSerializer, CategorySerializer, DashboardStatsSerializer
)
from .utils import get_dashboard_stats

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class LearningActivityListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'date']
    search_fields = ['topic', 'description']
    ordering_fields = ['date', 'created_at', 'updated_at']
    ordering = ['-date', '-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LearningActivityCreateSerializer
        return LearningActivitySerializer

    def get_queryset(self):
        return LearningActivity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LearningActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LearningActivitySerializer

    def get_queryset(self):
        return LearningActivity.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    stats = get_dashboard_stats(request.user)
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)