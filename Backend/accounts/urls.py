from django.urls import path
from .views import (
    register_student,
    login_user,
    profile,
    update_profile,
)

urlpatterns = [
    path("register/", register_student),
    path("login/", login_user),
    path("profile/", profile),
    path("profile/update/", update_profile),
]

