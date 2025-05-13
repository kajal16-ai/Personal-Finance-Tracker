"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from tkinter.font import names

from django.contrib import admin
from django.urls import path, include
from django.urls import path
from . import views

urlpatterns = [
    path('api/Register/', views.Register, name='register'),
    path('api/Login/', views.Login, name='Login'),
    path('api/AddTransaction/', views.AddTransaction, name='AddTransaction'),
    path('api/GetTransactions/<int:userId>/', views.GetTransactions, name='get_transactions'),
    path('api/GetAllTransactions/<int:userId>/', views.GetAllTransactions, name='GetAllTransactions'),
    path('api/GetUserProfile/<int:userId>/', views.GetUserProfile, name='GetUserProfile'),
    path('api/EditData/<int:userid>/', views.EditData, name='edit-data'),
    path('api/UserData/<int:userId>/', views.UserData, name='user-data'),
    path('api/ExportData/<int:userId>/', views.ExportData, name='ExportData'),
    path('api/DeleteAccount/<int:userId>/', views.DeleteAccount, name='DeleteAccount'),
    path('api/ExpenseByCategory/<int:userId>/', views.ExpenseByCategory, name='ExpenseByCategory'),
    path('api/MonthlyIncomeExpense/<int:userId>',views.MonthlyIncomeExpense, name ='MonthlyIncomeExpense')

]
