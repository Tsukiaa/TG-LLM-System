from django.http import HttpResponse
from django.shortcuts import render

import json

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Service.FullGraphService import FullGraphService

fullGraphService = FullGraphService()

def main_page(request):
    return render(request, 'full_graph.html')

def search_total_triplets(request):
    triples_total_list = fullGraphService.search_total_triplets()
    res_data = {"triples_total_list": triples_total_list}
    res_data = json.dumps(res_data)
    return HttpResponse(res_data)
