from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)

    # Optional fields – filled after registration
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    address = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    caste = models.CharField(max_length=100, blank=True)
    annual_income = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


# OTP-gated registration validity window (minutes)
OTP_EXPIRY_MINUTES = 10


class PendingRegistration(models.Model):
    """
    Holds a registration awaiting email-OTP verification.
    No Django User / Student row is created until the OTP is verified.
    The password is stored already hashed (never in plain text).
    """

    full_name = models.CharField(max_length=100)
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15)
    password_hash = models.CharField(max_length=255)

    otp_code = models.CharField(max_length=6)
    attempts = models.IntegerField(default=0)
    resend_count = models.IntegerField(default=0)

    otp_sent_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.otp_sent_at + timedelta(minutes=OTP_EXPIRY_MINUTES)

    def __str__(self):
        return f"PendingRegistration<{self.email}>"
