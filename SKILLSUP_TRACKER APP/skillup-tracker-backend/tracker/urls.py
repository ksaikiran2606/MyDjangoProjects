from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register_user, name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.user_profile, name='user_profile'),
    
    # Categories
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    
    # Learning Activities
    path('activities/', views.LearningActivityListCreate.as_view(), name='activity-list-create'),
    path('activities/<int:pk>/', views.LearningActivityDetail.as_view(), name='activity-detail'),
    
    # Dashboard
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]