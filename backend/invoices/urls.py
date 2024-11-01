from django.urls import path
from .views import (
    ProjectListView, next_invoice_number_for_project,
    InvoiceListCreateView, InvoiceDetailView,
    login_view, logout_view
)

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('next_invoice_number_for_project/', next_invoice_number_for_project, name='next-invoice-number-for-project'),
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
]
