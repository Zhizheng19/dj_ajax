from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile
# from django.core import serializers
# Create your views here.
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

def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form  ,  
    }
    return render(request, 'posts/detail.html', context)

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

def hello_world_view(request):
    return JsonResponse({'text': 'Hello world'})