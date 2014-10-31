# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from models import UserProfile
from forms import ProfileForm, UserRegistrationForm
from django.contrib.auth import get_user
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
import datetime

@login_required(login_url='/accounts/login/')
def profile(request):
    profile = get_user(request).get_profile()
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance = profile)

        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("user_profile"))
    else:
        form = ProfileForm(instance = profile )
    return render_to_response('user_profile/profile.html',
          {
            'form': form,
          },
          context_instance=RequestContext(request))
