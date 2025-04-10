"""
FILE         : posts/views.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : Define views to handle post creation, detail view,
    updates, deletions, likes, and image uploads.
"""
from django.shortcuts import render
from .models import Post, Photo
from django.http import JsonResponse, HttpResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

""" 
FUNCTION    : post_list_and_create
DESCRIPTION : Handle post listing and creation in the main page.
"""
@login_required
def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            istance = form.save(commit=False)
            istance.author = author
            istance.save()
            return JsonResponse({
                'title': istance.title,
                'body': istance.body, 
                'id': istance.id, 
                'author': istance.author.user.username
            })
        
    context = {
        'form': form,
    }
    return render(request, 'posts/main.html', context)

"""
FUNCTION    : post_detail
DESCRIPTION : Render the detail page for a specific post.
"""
@login_required
def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form  ,  
    }
    return render(request, 'posts/detail.html', context)
"""
FUNCTION    : load_post_data
DESCRIPTION : Load more post data for the main page.
"""
@login_required
def load_post_data_view(request, num_posts):
    # num_posts = kwargs.get('num_posts')
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        qs = Post.objects.all()
        # data = serializers.serialize('json', qs)
        data =[]
        for obj in qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False, 
                'count': obj.like_count,
                'author': obj.author.user.username,
            }
            data.append(item)
        return JsonResponse({'data': data[lower:upper], 'size': size})
    return redirect('posts:main-board')

"""
FUNCTION    : post_detail_data
DESCRIPTION : Retrieve details of a specific post
"""
@login_required
def post_detail_data_view(request,pk):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        obj = Post.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username,
            'logged_in': request.user.username,
        }
        return JsonResponse({'data': data})
    return redirect('posts:main-board')
"""
FUNCTION    : like_unlike_post
DESCRIPTION : Handle liking and unliking a post.
"""
@login_required
def like_unlike_post(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove (request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked':liked, 'count':obj.like_count})
    return redirect('posts:main-board')
"""
FUNCTION    : update_post
DESCRIPTION : Handle updating a post title and body in the detail page.
"""
@login_required
@ action_permission
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        form = PostForm(request.POST, instance=obj)
        if form.is_valid():
            new_title = request.POST.get('title')
            new_body = request.POST.get('body')
            obj.title = new_title
            obj.body = new_body
            obj.save()
            return JsonResponse({
                'title': obj.title,
                'body': obj.body
            })
    return redirect('posts:main-board')
"""
FUNCTION    : delete_post
DESCRIPTION : Handle deleting a post in the detail page.
"""
@login_required
@ action_permission
def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        obj.delete()
        return JsonResponse({'message':'deleted'})
    return redirect('posts:main-board')
"""
FUNCTION    : image_upload_view
DESCRIPTION : Handle uploading an image for a post.
"""
@login_required
def image_upload_view(request):
    print(request.FILES)
    if request.method == 'POST':
        img =request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(post=post, image=img)
    return HttpResponse()