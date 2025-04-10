"""
FILE         : profiles/urls.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : 
    URL configuration for profile-related views.
"""
from django.urls import path
from .views import my_profile_view
app_name = 'profiles'
urlpatterns = [
    path('my/', my_profile_view, name='my-profile'),
]
