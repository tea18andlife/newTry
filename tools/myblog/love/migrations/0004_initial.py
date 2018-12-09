# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Students'
        db.create_table(u'love_students', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('free', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('score', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('sex', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('type', self.gf('django.db.models.fields.IntegerField')(default=1)),
            ('birthday', self.gf('django.db.models.fields.DateTimeField')()),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('ctime', self.gf('django.db.models.fields.TimeField')(auto_now_add=True, blank=True)),
            ('remark', self.gf('django.db.models.fields.CharField')(default='', max_length=255)),
        ))
        db.send_create_signal(u'love', ['Students'])


    def backwards(self, orm):
        # Deleting model 'Students'
        db.delete_table(u'love_students')


    models = {
        u'love.students': {
            'Meta': {'object_name': 'Students'},
            'birthday': ('django.db.models.fields.DateTimeField', [], {}),
            'ctime': ('django.db.models.fields.TimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'free': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'remark': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'sex': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'type': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        }
    }

    complete_apps = ['love']