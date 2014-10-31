# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
import datetime
from django.conf import settings
from django.core.urlresolvers import reverse

CHOICES_TYPE = {
	('4xteams', _('Teams x4')),
	('40x40', _('Normal 40x40')),
}

class Course(models.Model):
	user = models.ForeignKey(User, verbose_name=_('User'), blank=False, null=False)

	name = models.CharField(verbose_name=_('Name'), max_length=255, blank=False, null=False)
	type = models.CharField(verbose_name=_('Type'), max_length=10, choices=CHOICES_TYPE, null=False, blank=False, default='40x40')

	json = models.TextField(verbose_name=_('Course'))
	description = models.TextField(verbose_name=_('Description'), blank=True, null=True)
	preview = models.TextField(verbose_name=_('Preview'), blank=True, null=True)

	date_creation = models.DateTimeField(_('Date creation'), blank=True, null=True, default=datetime.datetime.now())

	def get_share_url(self):
		return '%s%s' % (settings.SITE_URL, reverse('view_course', args=[self.id, ])) 

