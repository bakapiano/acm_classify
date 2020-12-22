from django.http import HttpResponse
from api.models import *
import requests
import json

supported_oj = {
    "hdu": "hdu",
    "poj": "poj",
    "luogu": "luogu",
    "codeforces": "cf",
}


def get_supported_oj(request):
    return HttpResponse(json.dumps([oj_name for oj_name in supported_oj.keys()]))


def get_problem_tags(request, oj_name, problem_id):
    print(oj_name, problem_id)
    if oj_name not in supported_oj:
        return HttpResponse(json.dumps({"error": True, "message": "OJ not supported."}))
    return HttpResponse(json.dumps({
        "error": False,
        "data": {"tags":[tag.tag_name
                         for tag in ProblemTag.objects.filter(problem_name=supported_oj[oj_name] + problem_id)]}
    }))


def get_user_solved_tags(request, oj_name, user_name):
    if oj_name not in supported_oj:
        return HttpResponse(json.dumps({"error": True, "message": "OJ not supported."}))
    data = requests.get("https://new.npuacm.info/api/crawlers/%s/%s" % (oj_name, user_name)).json()
    print(data)
    res = {}
    for problem_id in data["data"]["solvedList"]:
        problem_name = supported_oj[oj_name] + problem_id
        res.update({
             problem_name : [tag.tag_name for tag in ProblemTag.objects.filter(problem_name=problem_name)]
        })
    return HttpResponse(json.dumps({
        "error": False,
        "data": {"solved": res}
    }))


def save_data(request):
    with open("C:\\Users\\bakap\\Desktop\\data\\luogu_final_dict.json", "r") as file:
        dic = json.load(file)
        for problem_name, tags in dic.items():
            for tag in tags:
                if len(ProblemTag.objects.filter(problem_name="luogu"+problem_name, tag_name=tag)) == 0:
                    print(ProblemTag.objects.filter(problem_name=problem_name, tag_name=tag))
                    print(problem_name, tag)
                    ProblemTag(problem_name="luogu"+problem_name, tag_name=tag).save()

    return HttpResponse("test")


# def test(request, arg):
#     # print(request.user)
#     return HttpResponse("test")



