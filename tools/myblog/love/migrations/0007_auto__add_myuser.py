# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MyUser'
        db.create_table(u'love_myuser', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('userName', self.gf('django.db.models.fields.CharField')(default='', max_length=64)),
            ('gameDatas', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'love', ['MyUser'])


    def backwards(self, orm):
        # Deleting model 'MyUser'
        db.delete_table(u'love_myuser')


    models = {
        u'love.class': {
            'Meta': {'object_name': 'Class'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '64'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'})
        },
        u'love.idcard': {
            'Meta': {'object_name': 'IDCard'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '30'}),
            'student': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['love.Students']", 'unique': 'True'})
        },
        u'love.myuser': {
            'Meta': {'object_name': 'MyUser'},
            'gameDatas': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'userName': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '64'})
        },
        u'love.students': {
            'Meta': {'object_name': 'Students'},
            'birthday': ('django.db.models.fields.DateTimeField', [], {}),
            'cls': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['love.Class']"}),
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
        },
        u'love.subject': {
            'Meta': {'object_name': 'Subject'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '64'})
        }
    }

    complete_apps = ['love']