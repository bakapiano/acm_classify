from django.http import HttpResponse, JsonResponse
from frontend.models import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from django.shortcuts import render


@csrf_exempt
def load(request):
    """
    登录用户可用，从数据库中读取查询列表，保存至 session["data"] 字段中
    """
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({
            "error": True,
            "message": "Not login."
        }))

    current_user = User.objects.get(username=request.user.username)
    records = [
        (str(record.oj_name), str(record.username))
        for record in HistoryUsername.objects.filter(user=current_user)
    ]

    print(current_user, records)

    request.session["data"] = records

    return HttpResponse(json.dumps({"error": False}))


@csrf_exempt
def save(request):
    """
    将 POST 传来的查询列表保存至 session["data"] 字段中，
    若是登录用户，则额外存储至数据库中。
    """
    print("save")
    print(request.POST)

    data = []
    for name, record in dict(request.POST).items():
        if str(name).startswith("data") and len(record[-1]) != 0:
            data.append(record)
    request.session["data"] = data
    print(request.user, data)

    if not request.user.is_anonymous:
        current_user = User.objects.get(username=request.user.username)
        print("current_user:", current_user)
        for record in HistoryUsername.objects.filter(user=current_user):
            print("databse:", record)
            record.delete()
        for oj_name, username in data:
            print(oj_name, username)
            HistoryUsername(oj_name=oj_name, username=username, user=current_user).save()

    return HttpResponse(json.dumps({"error": False}))


@csrf_exempt
def query(request):
    """
    返回 session["data"] 中保存的查询列表
    """
    # print(request.user, request.session["data"])
    return HttpResponse(json.dumps(request.session.get("data")))


# def create_test_data(request):
#     if request.user.is_anonymous:
#         return HttpResponse(json.dumps({
#             "error": True,
#             "message": "Not login."
#         }))
#
#     HistoryUsername(
#         user=User.objects.get(username=request.user.username),
#         username="orzzzqtxdy",
#         oj_name="codeforces",
#     ).save()
#
#     # test.user = User.objects.get(username=request.user.username)
#     # test.username = "bakapiano"
#     return HttpResponse("done")


# def set_test_session(request):
#     request.session["data"] = [["hdu", "ljn2514965141"], ["poj", "orzzzqtxdy"]]
#     return HttpResponse("done")


def query_page(request):
    return render(request, "query.html")


def statistics_page(request):
    return render(request, "statistics.html")


def index_page(request):
    return render(request, "index.html")


def get_current_username(request):
    if request.user.is_anonymous:
        return JsonResponse({"error": True});

    return JsonResponse({"error": False, "data": request.user.username});
