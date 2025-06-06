# Generated by Django 5.2 on 2025-05-06 05:38

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FinanceRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=datetime.date.today)),
                ('type', models.CharField(choices=[('Income', 'Income'), ('Expense', 'Expense')], max_length=10, verbose_name='Transaction Type')),
                ('category', models.CharField(max_length=100, verbose_name='Category')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Amount (₹)')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.user')),
            ],
        ),
    ]
