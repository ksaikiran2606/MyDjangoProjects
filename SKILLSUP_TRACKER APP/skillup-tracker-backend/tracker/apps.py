from django.apps import AppConfig

class TrackerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tracker'
    
    def ready(self):
        try:
            from .admin import create_default_categories
            create_default_categories()
        except:
            pass