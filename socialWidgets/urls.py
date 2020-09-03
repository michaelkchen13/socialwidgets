
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("newpost", views.newpost, name="newpost"),
    path("postList", views.postList, name="postList"),
    path("comments", views.comments, name="comments"),
    path("newcomment", views.newcomment, name="newcomment"),
    path("notes", views.notes, name="notes"),
    path("noteStatus", views.noteStatus, name="noteStatus"),
    path("noteDelete", views.noteDelete, name="noteDelete"),
    path("weather", views.weather, name="weather"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # upload tutorial used https://www.youtube.com/watch?list=PLLxk3TkuAYnpm24Ma1XenNeq1oxxRcYFT&time_continue=8&v=Zx09vcYq1oc&feature=emb_logo
]

# for development purposes for uploads
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)