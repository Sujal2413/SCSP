from django.urls import path
from .views import (
    register_student,
    verify_registration_otp,
    resend_registration_otp,
    login_user,
    profile,
    update_profile,
)

urlpatterns = [
    path("register/", register_student),
    path("register/verify/", verify_registration_otp),
    path("register/resend/", resend_registration_otp),
    path("login/", login_user),
    path("profile/", profile),
    path("profile/update/", update_profile),
]

