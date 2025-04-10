from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
import json

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Service.TextGenService import TextGenService

textGenService = TextGenService()


def main_page(request):
    return render(request, 'textgen.html')

def text_gen(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)  # 解析 JSON 请求体
            params = body.get("fragment")  # 获取 fragment 数据
            # print(params)

            if not params:
                return JsonResponse({"error": "缺少生成参数"}, status=400)

            result = textGenService.text_generation_service(params)
            res_data = {"result": result}
            return JsonResponse(res_data)  # 直接返回 JSON 响应
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON 解析失败"}, status=400)


def retrieveFragments(request):
    if request.method == 'POST':
        entity = request.POST.get("entity")
        fragment_list = textGenService.search_Fragments_service(entity)
        res_data = {"fragments": fragment_list}
        res_data = json.dumps(res_data)
        return HttpResponse(res_data)