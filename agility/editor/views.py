from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from models import Course
from django.contrib.auth import get_user
from forms import CourseForm
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
import datetime

@login_required(login_url='/accounts/login/')
def my_courses(request):
    courses = Course.objects.filter(user=get_user(request)).order_by('-date_creation')
    return render_to_response('editor/my_courses.html',
          {
            'courses': courses,
          },
          context_instance=RequestContext(request))

def latests_courses(request):
    courses = Course.objects.all().order_by('-date_creation')[:21]
    return render_to_response('editor/latests_courses.html',
          {
            'courses': courses,
          },
          context_instance=RequestContext(request))


@login_required(login_url='/accounts/login/')
def new_course(request):
    if request.method == 'POST':
        form = CourseForm(request.POST)

        if form.is_valid():
            course = form.save(commit=False)
            course.user = request.user
            course.date_creation = datetime.datetime.now()
            course.save()

            return HttpResponseRedirect(reverse("edit_course", args=(course.id,)))
    else:
        form = CourseForm()
    return render_to_response('editor/edit_course.html',
          {
            'form': form,
          },
          context_instance=RequestContext(request))


@login_required(login_url='/accounts/login/')
def edit_course(request, course_id):
    course = Course.objects.get(id=course_id)

    if course.user != request.user:
       return HttpResponseRedirect(reverse("view_course", args=(course.id,)))

    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            form = CourseForm(request.POST, instance=course)
            course = form.save()
    else:
        form = CourseForm(instance=course)
    return render_to_response('editor/edit_course.html',
          {
            'form': form,
            'is_edit': True,
            'course': course,
          },
          context_instance=RequestContext(request))


def view_course(request, course_id):
    course = Course.objects.get(id=course_id)

    return render_to_response('editor/view_course.html',
          {
            'course': course,
          },
          context_instance=RequestContext(request))


def preview_course(request, course_id):
    import base64

    course = Course.objects.get(id=course_id)

    image_data = course.preview.partition('base64,')[2]
    binary = base64.b64decode(image_data)
    return HttpResponse(binary, mimetype='image/png')



