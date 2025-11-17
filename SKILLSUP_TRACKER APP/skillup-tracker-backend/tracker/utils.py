from django.utils import timezone
from datetime import timedelta
from .models import LearningActivity

def calculate_streak(user):
    """
    Calculate the current streak - consecutive days with at least one learning activity
    """
    today = timezone.now().date()
    streak = 0
    
    # Start from today and go backwards
    current_date = today
    while True:
        # Check if user has at least one activity on this date
        has_activity = LearningActivity.objects.filter(
            user=user,
            date=current_date
        ).exists()
        
        if has_activity:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
            
    return streak

def get_dashboard_stats(user):
    """
    Get comprehensive dashboard statistics for a user
    """
    today = timezone.now().date()
    
    # Get all user activities
    all_activities = LearningActivity.objects.filter(user=user)
    total_activities = all_activities.count()
    
    # Completed activities
    completed_activities = all_activities.filter(status='completed').count()
    
    # Pending activities
    pending_activities = all_activities.filter(status='pending').count()
    
    # Completion rate
    completion_rate = (completed_activities / total_activities * 100) if total_activities > 0 else 0
    
    # Today's activities
    today_activities = all_activities.filter(date=today)
    
    # Current streak
    current_streak = calculate_streak(user)
    
    return {
        'total_activities': total_activities,
        'completed_activities': completed_activities,
        'pending_activities': pending_activities,
        'completion_rate': round(completion_rate, 2),
        'current_streak': current_streak,
        'today_activities': today_activities
    }