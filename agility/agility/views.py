from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from editor.models import Course

def home(request):
    courses = Course.objects.all().order_by('-date_creation')[:4]
    course = None
    if courses:
    	course = courses[0]
    	courses = courses[1:]
	return render_to_response('home.html',
		  {
		  	'course': course,
		  	'courses': courses,
		  },
		  context_instance=RequestContext(request))

