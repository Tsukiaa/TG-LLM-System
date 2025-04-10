"""Application URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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

from django.urls import path, re_path
from django.shortcuts import redirect
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from controller import MainLayoutController
from controller import EntityGraphController
from controller import FullGraphController
from controller import InferenceController
from controller import TextGenController
from controller import ProblemController
from controller import WelcomeController

urlpatterns = [
    path('', lambda request: redirect('/welcome/')),  # 访问根路径时重定向到 /welcome/
    path('welcome/', WelcomeController.main_page),

    path('main_layout/', MainLayoutController.main_page),

    path('entity_graph/', EntityGraphController.main_page),
    path('search_triplets/', EntityGraphController.search_triplets),

    path('full_graph/', FullGraphController.main_page),
    path('search_total_triplets/', FullGraphController.search_total_triplets),

    path('inference/', InferenceController.main_page),
    path('infer/', InferenceController.infer),

    path('textgen/', TextGenController.main_page),
    path('retrieveFragments/', TextGenController.retrieveFragments),
    path('text_gen/', TextGenController.text_gen),

    path('get_answer/', ProblemController.get_answer),
    path('get_answer_other_model/', ProblemController.get_answer_other_model)

]
