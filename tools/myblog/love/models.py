# -*- coding:utf-8 -*-
from django.db import models
from datetime import datetime
import os

CharMaxLength = 128

class MyUser(models.Model):
    # 用户名 密码-微信直接根据userid登录成功不需要密码 所以这里就先不设置了 
    userName = models.CharField(verbose_name=u'用户名', max_length=64, default='')
    # 游戏记录
    gameDatas = models.TextField(verbose_name=u'日志', blank=True, null=True)

    # class Meta:
    #     verbose_name = u'用户'
    #     verbose_name_plural = u'用户'
    #     # ordering = ['userName']

    # def __unicode__(self):
    #     return self.userName


### 以下部分为初始化这个项目适合的测试配置表

class Class(models.Model):

    name = models.CharField(verbose_name=u'名称', max_length=64,default='')
    photo    = models.ImageField(verbose_name=u'照片',upload_to='img', blank=True)

class Subject(models.Model):
    name = models.CharField(verbose_name=u'科目', max_length=64,default='')

class Students(models.Model):
    id    = models.AutoField(verbose_name=u'ID',primary_key=True)
    name  = models.CharField(verbose_name=u'姓名',max_length=255)
    free  = models.BooleanField(verbose_name=u'免费',default=True)
    score = models.IntegerField(verbose_name=u'评分',default=0)
    SEXS  = {
        (0,u'男'),
        (1,u'女')
    }
    sex   = models.SmallIntegerField(verbose_name=u'性别',default=0,choices=SEXS)
    TYPES = {
        (1,'初级'),
        (2,'中级'),
        (3,'高级')
    }
    type     = models.IntegerField(verbose_name=u'类型',default=1,choices=TYPES)
    birthday = models.DateTimeField(verbose_name=u'生日')
    photo    = models.ImageField(verbose_name=u'照片',upload_to='img')
    description = models.TextField(verbose_name=u'介绍',blank=True,null=True)
    ctime    = models.TimeField(verbose_name=u'创建时间',auto_now_add=True)
    remark   = models.CharField(verbose_name=u'备注', max_length=255,default='')
    cls = models.ForeignKey(Class, verbose_name=u'班级')

class IDCard(models.Model):
    number = models.CharField(verbose_name=u'卡号', max_length=30,default='')
    student = models.OneToOneField(Students, verbose_name=u'学生')


