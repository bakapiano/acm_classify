from django.conf.urls import url
from django.urls import path, re_path
from frontend.views import *

app_name = "frontend"
urlpatterns = [
    path("load", load),
    path("save", save),
    path("query", query),
    path("current", get_current_username),
    # path("test", create_test_data),
    # path("test2", set_test_session),
    # path('test/', save_data),
    # path(r'test/<str:arg>/', test),
    # path(r'problem/<str:oj_name>/<str:problem_id>',get_problem_tags),
    # path(r'user/<str:oj_name>/<str:user_name>',get_user_solved_tags),
]
