# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('incidents', '0002_auto_20150907_1147'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='assigned_to',
            field=models.ForeignKey(related_name='assigned_id', blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
    ]
