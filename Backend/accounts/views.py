from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Student
from .serializers import RegisterSerializer, StudentSerializer


# -----------------------------
# REGISTER
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register_student(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# LOGIN
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    print(f"Login request data: {request.data}")
    print(f"Login request headers: {dict(request.headers)}")
    
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    print(f"Authenticated user: {user}")

    if not user:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
        },
        status=status.HTTP_200_OK,
    )


# -----------------------------
# PROFILE (GET)
# -----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    student = Student.objects.filter(user=request.user).first()

    if not student:
        return Response(
            {"error": "Student profile not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = StudentSerializer(student)
    return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------
# PROFILE UPDATE (PUT)
# -----------------------------
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    student = Student.objects.filter(user=request.user).first()

    if not student:
        return Response(
            {"error": "Student profile not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = StudentSerializer(
        student, data=request.data, partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Profile updated successfully"},
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
