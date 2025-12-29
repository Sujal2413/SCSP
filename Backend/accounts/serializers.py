from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student

class RegisterSerializer(serializers.Serializer):
    # 1. Full Name
    full_name = serializers.CharField(max_length=100)

    # 2. Username
    username = serializers.CharField(max_length=150)

    # 3. Email Address
    email = serializers.EmailField()

    # 4. Mobile Number
    mobile = serializers.CharField(max_length=15)

    # 5. Password
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate(self, data):
        # Unique username
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({
                "username": "Username already exists."
            })

        # Unique email
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({
                "email": "Email already registered."
            })

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        Student.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            mobile=validated_data["mobile"]
        )

        return user

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "mobile",
        ]