import random

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives, send_mail
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Student, PendingRegistration, OTP_EXPIRY_MINUTES
from .serializers import RegisterSerializer, StudentSerializer


# -----------------------------
# OTP helpers
# -----------------------------
MAX_OTP_ATTEMPTS = 5
MAX_RESENDS = 5


def _generate_otp():
    return f"{random.randint(100000, 999999)}"


def _send_otp_email(email, otp, full_name=""):
    if "smtp" in getattr(settings, "EMAIL_BACKEND", "").lower():
        if not getattr(settings, "EMAIL_HOST_USER", "") or not getattr(
            settings, "EMAIL_HOST_PASSWORD", ""
        ):
            raise RuntimeError(
                "SMTP email is not configured. Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD."
            )

    subject = "Your SCSP verification code"
    greeting = full_name or "there"
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@scsp.local")

    text_body = (
        f"Hello {greeting},\n\n"
        f"Your SCSP registration OTP is: {otp}\n"
        f"This code is valid for {OTP_EXPIRY_MINUTES} minutes.\n\n"
        f"If you did not request this, you can safely ignore this email.\n\n"
        f"— SCSP · Smart Scholarship Portal"
    )

    html_body = _otp_email_html(greeting, otp)

    msg = EmailMultiAlternatives(subject, text_body, from_email, [email])
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)


def _otp_email_html(greeting, otp):
    """Branded, email-client-safe HTML for the OTP message (inline styles + tables)."""
    spaced = " ".join(list(str(otp)))  # letter-spacing fallback for old clients
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4f7;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f7;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;
                        box-shadow:0 12px 40px rgba(16,40,56,0.10);">
            <!-- header -->
            <tr>
              <td style="background:#16526e;padding:28px 36px;">
                <span style="color:#ffffff;font-size:22px;font-weight:700;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.3px;">
                  &#9679; SCSP
                </span>
                <div style="color:#bcd9e6;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">
                  Smart Scholarship Portal
                </div>
              </td>
            </tr>
            <!-- body -->
            <tr>
              <td style="padding:36px 36px 8px 36px;">
                <p style="margin:0 0 6px 0;color:#14181b;font-size:18px;font-weight:600;">Hello {greeting},</p>
                <p style="margin:0 0 26px 0;color:#5a6b75;font-size:15px;line-height:1.6;">
                  Use the verification code below to confirm your email and finish creating your SCSP account.
                </p>

                <!-- code box -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center"
                        style="background:#f3f8fb;border:1px solid #dbe8ef;border-radius:14px;padding:22px 0;">
                      <div style="color:#16526e;font-size:38px;font-weight:700;letter-spacing:10px;font-family:Georgia,'Times New Roman',serif;">
                        {spaced}
                      </div>
                    </td>
                  </tr>
                </table>

                <p style="margin:22px 0 0 0;color:#5a6b75;font-size:14px;line-height:1.6;">
                  This code expires in <strong style="color:#14181b;">{OTP_EXPIRY_MINUTES} minutes</strong>.
                  If you didn&#8217;t request it, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- footer -->
            <tr>
              <td style="padding:26px 36px 32px 36px;border-top:1px solid #eef2f4;margin-top:20px;">
                <p style="margin:18px 0 0 0;color:#9aa7af;font-size:12px;line-height:1.5;">
                  Sent by SCSP &middot; Smart Scholarship Portal. Please don&#8217;t reply to this automated message.
                </p>
              </td>
            </tr>
          </table>
          <p style="color:#9aa7af;font-size:11px;margin:18px 0 0 0;">&copy; 2026 SCSP &middot; Education access for all.</p>
        </td>
      </tr>
    </table>
  </body>
</html>"""


# -----------------------------
# REGISTER — step 1: validate + send OTP
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register_student(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    otp = _generate_otp()

    # Store / refresh the pending registration keyed by email.
    PendingRegistration.objects.update_or_create(
        email=data["email"],
        defaults={
            "full_name": data["full_name"],
            "username": data["username"],
            "mobile": data["mobile"],
            "password_hash": make_password(data["password"]),
            "otp_code": otp,
            "otp_sent_at": timezone.now(),
            "attempts": 0,
            "resend_count": 0,
        },
    )

    try:
        _send_otp_email(data["email"], otp, data["full_name"])
    except Exception:
        PendingRegistration.objects.filter(email=data["email"]).delete()
        return Response(
            {
                "error": (
                    "Could not send the verification email. "
                    "Please check the server email settings and try again."
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response(
        {
            "message": "A 6-digit verification code has been sent to your email.",
            "email": data["email"],
        },
        status=status.HTTP_200_OK,
    )


# -----------------------------
# REGISTER — step 2: verify OTP + create account
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_registration_otp(request):
    email = (request.data.get("email") or "").strip()
    otp = (request.data.get("otp") or "").strip()

    if not email or not otp:
        return Response(
            {"error": "Email and OTP are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    pending = PendingRegistration.objects.filter(email=email).first()
    if not pending:
        return Response(
            {"error": "No pending registration found. Please register again."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if pending.is_expired():
        pending.delete()
        return Response(
            {"error": "This code has expired. Please request a new one."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if pending.attempts >= MAX_OTP_ATTEMPTS:
        pending.delete()
        return Response(
            {"error": "Too many incorrect attempts. Please register again."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    if otp != pending.otp_code:
        pending.attempts += 1
        pending.save(update_fields=["attempts"])
        remaining = MAX_OTP_ATTEMPTS - pending.attempts
        return Response(
            {"error": f"Incorrect code. {remaining} attempt(s) remaining."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Re-check uniqueness in case it was taken while the OTP was pending.
    if User.objects.filter(username=pending.username).exists():
        pending.delete()
        return Response(
            {"error": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(email=pending.email).exists():
        pending.delete()
        return Response(
            {"error": "Email already registered."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Create the real account. password_hash is already hashed.
    user = User(username=pending.username, email=pending.email)
    user.password = pending.password_hash
    user.save()

    Student.objects.create(
        user=user,
        full_name=pending.full_name,
        mobile=pending.mobile,
    )
    pending.delete()

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "Email verified. Your account has been created.",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
        },
        status=status.HTTP_201_CREATED,
    )


# -----------------------------
# REGISTER — resend OTP
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def resend_registration_otp(request):
    email = (request.data.get("email") or "").strip()

    pending = PendingRegistration.objects.filter(email=email).first()
    if not pending:
        return Response(
            {"error": "No pending registration found. Please register again."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if pending.resend_count >= MAX_RESENDS:
        return Response(
            {"error": "Resend limit reached. Please register again."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    previous_state = {
        "otp_code": pending.otp_code,
        "otp_sent_at": pending.otp_sent_at,
        "attempts": pending.attempts,
        "resend_count": pending.resend_count,
    }

    otp = _generate_otp()
    pending.otp_code = otp
    pending.otp_sent_at = timezone.now()
    pending.attempts = 0
    pending.resend_count += 1
    pending.save(update_fields=["otp_code", "otp_sent_at", "attempts", "resend_count"])

    try:
        _send_otp_email(email, otp, pending.full_name)
    except Exception:
        for field, value in previous_state.items():
            setattr(pending, field, value)
        pending.save(update_fields=list(previous_state.keys()))
        return Response(
            {
                "error": (
                    "Could not resend the verification email. "
                    "Please check the server email settings and try again."
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response(
        {"message": "A new verification code has been sent."},
        status=status.HTTP_200_OK,
    )


# -----------------------------
# LOGIN
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    identifier = (request.data.get("username") or "").strip()
    password = request.data.get("password")

    if not identifier or not password:
        return Response(
            {"error": "Username/email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    username = identifier
    if "@" in identifier:
        matched_user = User.objects.filter(email__iexact=identifier).first()
        if matched_user:
            username = matched_user.username

    user = authenticate(username=username, password=password)

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
