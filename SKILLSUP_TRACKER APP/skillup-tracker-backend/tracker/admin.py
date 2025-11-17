from django.contrib import admin
from .models import LearningActivity, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color']
    search_fields = ['name']

@admin.register(LearningActivity)
class LearningActivityAdmin(admin.ModelAdmin):
    list_display = ['topic', 'user', 'category', 'date', 'status', 'created_at']
    list_filter = ['status', 'category', 'date', 'created_at']
    search_fields = ['topic', 'description', 'user__username']
    date_hierarchy = 'date'

# Create default categories
def create_default_categories():
    default_categories = [
        {'name': 'Frontend', 'color': '#3B82F6'},
        {'name': 'Backend', 'color': '#10B981'},
        {'name': 'Python', 'color': '#6366F1'},
        {'name': 'JavaScript', 'color': '#F59E0B'},
        {'name': 'React', 'color': '#06B6D4'},
        {'name': 'Django', 'color': '#059669'},
        {'name': 'Database', 'color': '#8B5CF6'},
        {'name': 'DevOps', 'color': '#EF4444'},
        {'name': 'Mobile', 'color': '#EC4899'},
        {'name': 'Other', 'color': '#6B7280'},
    ]
    
    for category_data in default_categories:
        Category.objects.get_or_create(
            name=category_data['name'],
            defaults={'color': category_data['color']}
        )