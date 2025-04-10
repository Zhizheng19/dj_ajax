"""
FILE         : posts/utils.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : Define decorators to handle action permission.
"""
from .models import Post
from profiles.models import Profile
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import redirect
def action_permission(func):    
    """ 
    FUNCTION    : action_permission
    DESCRIPTION : Decorator to check if the logged-in user is the author of the post.
    """
    def wrapper(request, **kwargs):
        pk = kwargs.get('pk')
        profile = Profile.objects.get(user=request.user)
        post = Post.objects.get(pk=pk)
        if profile.user == post.author.user:
            print('yes')
            return func(request, **kwargs)
        else:
            print('no')
            return redirect('posts:main-board')
    return wrapper