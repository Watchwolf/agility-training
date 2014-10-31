# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django_facebook.models import FacebookProfile

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True)

    
    def __unicode__(self):
        return self.user

from registration.signals import user_registered
def user_registered_callback(sender, user, request, **kwargs):
    profile = UserProfile(user = user)
    #profile.is_human = bool(request.POST["is_human"])
    profile.save()
 
user_registered.connect(user_registered_callback)
