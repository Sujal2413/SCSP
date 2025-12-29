from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def home(request):
    return Response({
        "service": "SCSP Backend",
        "status": "running",
    })


urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
]
