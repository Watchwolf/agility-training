from django.conf.urls import patterns, include, url

urlpatterns = patterns('editor.views',
	url(r'^courses/my/$', 'my_courses', name='my_courses'),
	url(r'^courses/latests/$', 'latests_courses', name='latests_courses'),
	url(r'^courses/new/$', 'new_course', name='new_course'),
	url(r'^courses/edit/(.+)$', 'edit_course', name='edit_course'),
	url(r'^courses/view/(.+)$', 'view_course', name='view_course'),
	url(r'^courses/preview/(.+).png$', 'preview_course', name='preview_course'),
)
