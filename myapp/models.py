from django.db import models

# Create your models here.
from datetime import date

from django.db import models

class User(models.Model):
    UserName = models.CharField(max_length=100)
    UserEmail = models.EmailField(unique=True)
    UserPassword = models.CharField(max_length=128)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.UserName

class FinanceRecord(models.Model):
    TRANSACTION_TYPES = [
        ('Income', 'Income'),
        ('Expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)
    type = models.CharField("Transaction Type", max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField("Category", max_length=100)
    amount = models.DecimalField("Amount (₹)", max_digits=10, decimal_places=2)
    description = models.TextField("Description", blank=True)

    def __str__(self):
        return f"{self.user.UserName} - {self.type} - ₹{self.amount} on {self.date}"
