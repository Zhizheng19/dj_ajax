"""
FILE         : posts/forms.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : Define forms to handle post creation.
"""
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'body',)
