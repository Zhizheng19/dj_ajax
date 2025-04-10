"""
FILE         : posts/urls.py
PROJECT      : Full Stack Framework Assignment
PROGRAMMER   : Zhizhong Dong
FIRST VERSION: 2025-04-09
DESCRIPTION  : 
    URL configuration for post-related views and URLs.
"""
from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_unlike_post,
    post_detail,
    post_detail_data_view,
    update_post,
    delete_post,
    image_upload_view,
)
app_name = 'posts' 
urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('upload/', image_upload_view, name='image-upload'),

    # num of posts (how many posts we should display)
    path('data/<int:num_posts>/', load_post_data_view, name='post-data'),
    path('<pk>/', post_detail, name='post-detail'),
    path('<pk>/update/', update_post, name='update-post'),
    path('<pk>/delete/', delete_post, name='delete-post'),

    path('<pk>/data/', post_detail_data_view, name='post-detail-data'),
    
]

