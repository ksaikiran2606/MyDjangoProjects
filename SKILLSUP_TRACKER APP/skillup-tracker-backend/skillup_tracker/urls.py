from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "SkillUp Tracker API is running!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tracker.urls')),
    path('', home, name='home'),  # Add a root endpoint
]