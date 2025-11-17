from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class LearningActivity(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    topic = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.topic} - {self.user.username}"
    
    class Meta:
        verbose_name_plural = "Learning Activities"
        ordering = ['-date', '-created_at']