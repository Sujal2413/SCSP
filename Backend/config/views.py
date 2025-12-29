from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def home(request):
    return Response({
        "service": "SCSP Backend",
        "status": "running",
        "available_endpoints": {
            "register": "/api/accounts/register/",
            "login": "/api/accounts/login/",
            "profile": "/api/accounts/profile/"
        }
    })
