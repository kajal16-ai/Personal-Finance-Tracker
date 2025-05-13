from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse, FileResponse
import json, io, zipfile
from django.db.models import Sum
from .models import *
import calendar
from django.db.models.functions import TruncMonth

@csrf_exempt
@api_view(['POST'])
def Register(request):
    try:
        UserName = request.POST.get('UserName')
        UserEmail = request.POST.get('UserEmail')
        UserPassword = request.POST.get('UserPassword')
        image = request.FILES.get('image')

        if not all([UserName, UserEmail, UserPassword]):
            return Response({'error': 'All fields are required'}, status=400)

        if User.objects.filter(UserEmail=UserEmail).exists():
            return Response({'error': 'Email already exists'}, status=400)

        user = User(UserName=UserName, UserEmail=UserEmail, UserPassword=UserPassword, image=image)
        user.save()
        return Response({'message': 'User registered successfully'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def Login(request):
    try:
        UserEmail = request.POST.get('UserEmail')
        UserPassword = request.POST.get('UserPassword')

        if not UserEmail or not UserPassword:
            return Response({'error': 'Email and password are required'}, status=400)

        user = User.objects.filter(UserEmail=UserEmail, UserPassword=UserPassword).first()

        if user:
            return Response({
                'message': 'Login successful',
                'userId': user.id,
                'username': user.UserName
            }, status=200)
        else:
            return Response({'error': 'Invalid email or password'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def AddTransaction(request):
    try:
        userId = request.data.get('userId')
        user = User.objects.get(id=userId)

        date = request.data.get('date')
        type = request.data.get('type')
        category = request.data.get('category')
        amount = request.data.get('amount')
        description = request.data.get('description')

        record = FinanceRecord(
            user=user,
            date=date,
            type=type,
            category=category,
            amount=amount,
            description=description
        )
        record.save()
        return Response({'message': 'Transaction added successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def GetTransactions(request, userId):
    try:
        user = User.objects.get(id=userId)
        records = FinanceRecord.objects.filter(user=user).order_by('-date')[:5]
        transition_records = []

        for record in records:
            transition_records.append({
                "date": record.date.strftime("%d %b %Y"),
                "category": record.category,
                "type": record.type,
                "amount": float(record.amount)
            })

        return Response(transition_records, status=200)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response ({'error': str(e)}, status=500)

@api_view(['GET'])
def GetAllTransactions(request, userId):
    try:
        user = User.objects.get(id=userId)
        records = FinanceRecord.objects.filter(user=user)
        transaction_records = []

        for record in records:
            transaction_records.append({
                "date": record.date.strftime("%d %b %Y"),
                "category": record.category,
                "type": record.type,
                "amount": float(record.amount)
            })

        return Response(transaction_records, status=200)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def GetUserProfile(request, userId):
    try:
        user = User.objects.get(id=userId)

        return Response({
            "UserName": user.UserName,
            "UserEmail": user.UserEmail,
            "image": user.image.url if user.image else None  # return image path or None
        }, status=200)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['PUT'])
def EditData(request, userid):
    try:
        user = User.objects.get(id=userid)

        username = request.data.get('UserName')
        email = request.data.get('UserEmail')
        password = request.data.get('UserPassword')
        image = request.FILES.get('image')

        if username:
            user.UserName = username
        if email:
            user.UserEmail = email
        if password:
            user.UserPassword = password
        if image:
            user.image = image

        user.save()

        return Response({'message': 'Profile updated successfully'}, status=200)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def UserData(request, userId):
    try:
        user = User.objects.get(id=userId)
        data = {
            "UserId": user.id,
            "UserName": user.UserName,
            "UserEmail": user.UserEmail,
            "image": user.image.url if user.image else None,
        }
        return Response(data, status=200)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=500)

@csrf_exempt
def ExportData(request, userId):
    try:
        user = User.objects.get(id=userId)
        print(user)
        data = {
            "UserName": user.UserName,
            "UserEmail": user.UserEmail,
            "image": user.image.url if user.image else None,
        }

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            json_data = json.dumps(data, indent=4)
            zip_file.writestr("user_data.json", json_data)

        zip_buffer.seek(0)
        return FileResponse(zip_buffer, as_attachment=True, filename="user_data_export.zip")

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

@csrf_exempt
def DeleteAccount(request, userId):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=userId)
            user.delete()
            return JsonResponse({"message": "User account deleted successfully."})
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@api_view(['GET'])
def ExpenseByCategory(request, userId):
    try:
        user = User.objects.get(id=userId)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    try:
        expenses = (
            FinanceRecord.objects
            .filter(user=user, type="Expense")
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        if not expenses:
            return Response({"message": "No expense data available for this category."}, status=404)

        return Response(expenses)

    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)

@api_view(['GET'])
def MonthlyIncomeExpense(request, userId):
    try:
        user = User.objects.get(id=userId)

        records = (
            FinanceRecord.objects.filter(user=user)
            .annotate(month=TruncMonth("date"))
            .values("month", "type")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        monthly_data = {}
        for entry in records:
            month_key = entry["month"].strftime("%b")
            if month_key not in monthly_data:
                monthly_data[month_key] = {"month": month_key, "income": 0, "expense": 0}
            if entry["type"] == "Income":
                monthly_data[month_key]["income"] = entry["total"]
            elif entry["type"] == "Expense":
                monthly_data[month_key]["expense"] = entry["total"]

        sorted_months = list(calendar.month_abbr)[1:]
        result = [monthly_data[m] for m in sorted_months if m in monthly_data]

        return Response(result)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
