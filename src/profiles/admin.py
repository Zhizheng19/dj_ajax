"""
 FILE         : profiles/admin.py
 PROJECT      : Full Stack Framework Assignment
 PROGRAMMER   : Zhizhong Dong
 FIRST VERSION: 2025-04-09
 DESCRIPTION  : Register Profile model to Django admin site.
"""
from django.contrib import admin
from .models import Profile
# Register your models here.

admin.site.register(Profile)
