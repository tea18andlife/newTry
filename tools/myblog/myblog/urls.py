# -*- coding:utf-8 -*-
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from django.conf import settings
from django.conf.urls.static import  static
import  xadmin
xadmin.autodiscover()
from xadmin.plugins import xversion
xversion.register_models()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'myblog.views.home', name='home'),
    # url(r'^myblog/', include('myblog.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'', include(xadmin.site.urls)),       # xadmin
    url(r'^test', 'love.views.test'),
    url(r'^record', 'love.views.record'),
    url(r'^hello', 'love.views.hello'),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
