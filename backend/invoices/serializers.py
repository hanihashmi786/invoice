from rest_framework import serializers
from .models import Company, Client, Project, Invoice, InvoiceItem

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'
        extra_kwargs = {'invoice': {'required': False}}

class InvoiceSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    client = ClientSerializer()
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), allow_null=True, required=False
    )
    project_detail = ProjectSerializer(source='project', read_only=True)
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        from django.db import transaction
        company_data = validated_data.pop('company')
        client_data = validated_data.pop('client')
        project = validated_data.pop('project', None)
        items_data = validated_data.pop('items')

        # Approver name/title ko backend default se set karna, agar na aaye to
        approver_name = validated_data.get('approver_name') or "Dr. Abdul Aziz Turki Al-Otaishan"
        approver_title = validated_data.get('approver_title') or "General Manager"
        validated_data['approver_name'] = approver_name
        validated_data['approver_title'] = approver_title

        with transaction.atomic():
            company, _ = Company.objects.get_or_create(**company_data)
            client, _ = Client.objects.get_or_create(**client_data)

            invoice = Invoice.objects.create(
                company=company, client=client, project=project, **validated_data
            )

            for item_data in items_data:
                InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice
