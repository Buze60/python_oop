from django.shortcuts import render
from django.http import HttpResponse

# Create your views here. request hundler
def calculate():
    x = 1
    y = 3
    return x

def say_hello(request):
    x = calculate()
    return render(request, 'hello.html', {'user_data':'bizuayehu'})



    
