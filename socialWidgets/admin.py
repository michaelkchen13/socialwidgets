from django.contrib import admin

from .models import User, Post, Note, Comment

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "profileImage", "imgFilter", "zipCode")


class PostsAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "image", "imgFilter", "postTitle", "postBody", "timestamp")


class NotesAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "notes", "status")


class CommentAdmin(admin.ModelAdmin):
    list_display = ("commenter", "commentedPost", "comment", "timestamp")


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostsAdmin)
admin.site.register(Note, NotesAdmin)
admin.site.register(Comment, CommentAdmin)
