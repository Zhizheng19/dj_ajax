"""
FILE         : profiles/views.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : 
    Define views to handle profile display and updates.
"""
from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
"""
FUNCTION    : my_profile_view
DESCRIPTION : Handle profile display and updates.
"""
@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'avatar': instance.avatar.url if instance.avatar else None,
                'user': instance.user.username,
            })
    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'profiles/main.html', context)