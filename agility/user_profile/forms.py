# -*- coding: utf-8 -*-
from registration.forms import RegistrationForm
from django import forms
from django.forms import ModelForm
from models import UserProfile
from django.utils.translation import ugettext_lazy as _

attrs_dict = {'class': 'required'}


class UserRegistrationForm(RegistrationForm):
    first_name = forms.CharField(label=_('First name'), max_length=100)
    last_name = forms.CharField(label=_('Last name'), max_length=100)

import profile
def user_created(sender, user, request, **kwargs):
    form = UserRegistrationForm(request.POST)
    data = UserProfile.objects.get(user=user)
    user.first_name = form.data["first_name"]
    user.last_name = form.data["last_name"]

    user.save()
    data.save()
from registration.signals import user_registered
user_registered.connect(user_created)


class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(label=_(u'First name'), max_length=30)
    last_name = forms.CharField(label=_(u'Last name'), max_length=30)
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict, maxlength=75)),label=_("E-mail"))


    def __init__(self, *args, **kw):
        super(ProfileForm, self).__init__(*args, **kw)
        self.fields['first_name'].initial = self.instance.user.first_name
        self.fields['last_name'].initial = self.instance.user.last_name
        self.fields['email'].initial = self.instance.user.email

    def save(self, *args, **kw):
        super(ProfileForm, self).save(*args, **kw)
        self.instance.user.first_name = self.cleaned_data.get('first_name')
        self.instance.user.last_name = self.cleaned_data.get('last_name')
        self.instance.user.email = self.cleaned_data.get('email')
        self.instance.user.save()

    class Meta:
        model = UserProfile
        fields = []


