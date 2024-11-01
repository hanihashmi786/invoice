from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    iban = models.CharField(max_length=50, blank=True, null=True)
    tax_number = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Client(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, null=True)
    fax = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    vat_registration = models.CharField(max_length=64, blank=True, null=True)  # <--- Add this

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Invoice(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices")
    invoice_number = models.CharField(max_length=20)
    invoice_date = models.DateField()
    customer_number = models.CharField(max_length=50, blank=True, null=True)
    subtotal = models.DecimalField(max_digits=30, decimal_places=20)
    total_vat = models.DecimalField(max_digits=30, decimal_places=20)
    grand_total = models.DecimalField(max_digits=30, decimal_places=20)
    approver_name = models.CharField(
        max_length=255, blank=True, null=True, default="Dr. Abdul Aziz Turki Al-Otaishan"
    )
    approver_title = models.CharField(
        max_length=255, blank=True, null=True, default="General Manager"
    )

    class Meta:
        unique_together = ('project', 'invoice_number')

    def __str__(self):
        return f"Invoice {self.invoice_number}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.TextField()
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=30, decimal_places=2)
    vat_rate = models.DecimalField(max_digits=30, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=30, decimal_places=2)
    total_excl_vat = models.DecimalField(max_digits=30, decimal_places=2)
    total_incl_vat = models.DecimalField(max_digits=30, decimal_places=2)

    def __str__(self):
        return self.description
