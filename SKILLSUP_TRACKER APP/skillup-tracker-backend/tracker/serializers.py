from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import LearningActivity, Category

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwards = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LearningActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = LearningActivity
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class LearningActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningActivity
        fields = ('topic', 'description', 'category', 'date', 'status')

class DashboardStatsSerializer(serializers.Serializer):
    total_activities = serializers.IntegerField()
    completed_activities = serializers.IntegerField()
    pending_activities = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    current_streak = serializers.IntegerField()
    today_activities = LearningActivitySerializer(many=True)