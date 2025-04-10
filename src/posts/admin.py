"""
 FILE         : posts/admin.py
 PROJECT      : Full Stack Framework Assignment
 PROGRAMMER   : Zhizhong Dong
 FIRST VERSION: 2025-04-09
 DESCRIPTION  : Register Post and Photo models to Django admin site.
"""
from django.contrib import admin
from .models import Post, Photo

# Register your models here.
admin.site.register(Post)
admin.site.register(Photo)