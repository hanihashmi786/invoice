from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Project, Invoice
from .serializers import ProjectSerializer, InvoiceSerializer

class ProjectListView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

@api_view(['GET'])
def next_invoice_number_for_project(request):
    project_id = request.GET.get('project_id', None)
    if project_id:
        project = Project.objects.filter(id=project_id).first()
        if project:
            last_invoice = Invoice.objects.filter(project=project).order_by('-id').first()
            next_number = int(last_invoice.invoice_number) + 1 if (last_invoice and last_invoice.invoice_number.isdigit()) else 1
            return Response({"next_invoice_number": str(next_number)})
    # No project: use invoices with no project
    last_invoice = Invoice.objects.filter(project__isnull=True).order_by('-id').first()
    next_number = int(last_invoice.invoice_number) + 1 if (last_invoice and last_invoice.invoice_number.isdigit()) else 1
    return Response({"next_invoice_number": str(next_number)})

# ...Your other Invoice views...
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

class InvoiceDetailView(generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

# Authentication views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login endpoint that authenticates a user
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """
    Logout endpoint
    """
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
