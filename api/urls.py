from django.conf.urls import url
from django.urls import path, re_path
from api.views import *

app_name = "api"
urlpatterns = [
    # path('test/', save_data),
    # path(r'test/<str:arg>/', test),
    path(r'problem/<str:oj_name>/<str:problem_id>', get_problem_tags, name="problem"),
    path(r'user/<str:oj_name>/<str:user_name>', get_user_solved_tags, name="user"),
    path(r'supported', get_supported_oj, name="supported"),
]
