from django.http import HttpResponse
from django.shortcuts import render

import json

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Service.EntityGraphService import EntityGraphService

entityGraphService = EntityGraphService()

def main_page(request):
    return render(request, 'entity_graph.html')

def search_triplets(request):
    if request.method == 'POST':
        entity = request.POST.get("entity")
        triples_list = entityGraphService.search_triplets(entity)
        res_data = {"triples_list": triples_list}
        res_data = json.dumps(res_data)
        return HttpResponse(res_data)




