# -*- coding: utf-8 -*-
from django import forms
from django.forms import ModelForm
from models import Course
from django.utils.translation import ugettext_lazy as _

 
class CourseForm(ModelForm):
	class Meta:
		model = Course
		fields = ['name', 'type', 'json', 'description', 'preview']