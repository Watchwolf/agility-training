# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from user_profile.forms import UserRegistrationForm
from registration.views import register
from user_profile.forms import UserRegistrationForm
from django.contrib.auth import views as auth_views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('agility.views',
    # Examples:
    # url(r'^$', 'agility.views.home', name='home'),
    # url(r'^agility/', include('agility.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^editor/', include('editor.urls')),
    url(r'^accounts/register/$', register, {'backend': 'registration.backends.default.DefaultBackend','form_class': UserRegistrationForm}, name='registration_register'),
    url(r'^accounts/login/$',  auth_views.login, {'template_name': 'registration/login.html', 'extra_context': {'form_register': UserRegistrationForm()} }, name='auth_login'),
    url(r'^facebook/', include('django_facebook.urls')),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^accounts/', include('user_profile.urls')),
    url(r'^', 'home', name='home'),
)
