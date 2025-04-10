from django.http import HttpResponse
from django.shortcuts import render

import json



def main_page(request):
    return render(request, 'main_layout.html')