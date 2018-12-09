# -*- coding:utf-8 -*-
from django.http.response import HttpResponse
from cminit import *
from django.shortcuts import render,render_to_response
# Create your views here.
def kuayu(response):
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response

def test(requset):
	response = "ok"
	result = {"result": "ok"}
	response = HttpResponse(json.dumps(result, ensure_ascii=False)) 
	return kuayu(response)

def record(requset):
	nowTime = datetime.now().strftime("%Y_%m_%d_%H_%M_%S_")
	cord = requset.GET.get('cord','')
	cord = nowTime + " : " + cord
	txt = os.path.join(TEMP_DIR, nowTime + ".txt")
	# file = open(txt, 'wb')
	# file.write(cord)
	# file.close()
	result = {"result": cord}
	response = HttpResponse(json.dumps(result, ensure_ascii=False)) 
	return kuayu(response)

def hello(requset):
	# response = HttpResponse("hello") 
	response = render_to_response("hello.html")
	return response
    