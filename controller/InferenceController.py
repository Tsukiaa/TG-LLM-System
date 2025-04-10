from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
import json

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Service.InferenceService import InferenceService

inferenceService = InferenceService()


def main_page(request):
    return render(request, 'inference.html')


def infer(request):
    if request.method == 'POST':
        try:
            # 解析 JSON 数据
            data = json.loads(request.body)

            # 获取推理类别
            infer_type = data.get("type")

            # 获取推理参数列表
            params = data.get("params", [])

            # 确保参数完整
            if not params:
                return JsonResponse({"error": "缺少补全参数"}, status=400)

            # 根据推理类型处理不同逻辑
            if infer_type == "relation":
                if len(params) != 3:
                    return JsonResponse({"error": "关系补全需要[头实体, 尾实体, 时间]"}, status=400)
                head_entity, tail_entity, time = params
                relation = inferenceService.relation_inference(infer_type, head_entity, tail_entity, time)
                result = f"关系补全: {relation}"

            elif infer_type == "head_entity":
                if len(params) != 3:
                    return JsonResponse({"error": "头实体补全需要[关系, 尾实体, 时间]"}, status=400)
                relaion, tail_entity, time = params
                head_entity = inferenceService.head_entity_inference(infer_type, relaion, tail_entity, time)
                result = f"头实体补全: {head_entity}"
            elif infer_type == "tail_entity":
                if len(params) != 3:
                    return JsonResponse({"error": "尾实体补全需要[头实体, 关系, 时间]"}, status=400)
                head_entity, relation, time = params
                tail_entity = inferenceService.tail_entity_inference(infer_type, head_entity, relation, time)
                result = f"尾实体补全: {tail_entity}"
            else:
                return JsonResponse({"error": "未知补全类型"}, status=400)

            return JsonResponse({"result": result})

        except json.JSONDecodeError:
            return JsonResponse({"error": "请求数据格式错误"}, status=400)

    return JsonResponse({"error": "仅支持POST请求"}, status=405)

