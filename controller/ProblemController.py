from django.http import HttpResponse
from django.shortcuts import render

import json

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Service.ProblemService import ProblemService

problemService = ProblemService()

def main_page(request):
    return render(request, 'main_layout.html')

def get_answer(request):
    if request.method == 'POST':
        question = request.POST.get("question")
        answer = problemService.get_answer_service(question)
        res_data = {"answer": answer}
        res_data = json.dumps(res_data)
        return HttpResponse(res_data)

def get_answer_other_model(request):
    if request.method == 'POST':
        question = request.POST.get("question")
        answer = problemService.get_answer_service_other_model(question)
        res_data = {"answer": answer}
        res_data = json.dumps(res_data)
        return HttpResponse(res_data)