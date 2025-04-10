"""
FILE         : profiles/forms.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : 
    Define form for editing user profile and uploading avatars.
"""
from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('bio', 'avatar',)
