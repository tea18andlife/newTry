# -*- coding: utf-8 -*-
import xadmin

from .models import *

class ClassAdmin(object):
    list_display = ('id', 'name', 'photo')

xadmin.site.register(Class, ClassAdmin)

class IDCardAdmin(object):
    list_display = ('number', 'student')

xadmin.site.register(IDCard, IDCardAdmin)


