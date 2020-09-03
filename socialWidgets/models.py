from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profileImage = models.CharField(max_length=1000, default="")
    imgFilter = models.CharField(max_length=50, default="noFilter")
    zipCode = models.CharField(max_length=20, default="")


class Post(models.Model):
    username = models.ForeignKey(User, on_delete=models.PROTECT, related_name="postOwner")
    image = models.CharField(max_length=1000)
    imgFilter = models.CharField(max_length=50, default="noFilter")
    postTitle = models.CharField(max_length=100)
    postBody = models.CharField(max_length=280)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "username": self.username,
            "image": self.image,
            "imgFilter": self.imgFilter,
            "postTitle": self.postBody,
            "postBody": self.postBody,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }

    def __str__(self):
        return f"{self.id}, {self.username}, {self.image}, {self.imgFilter}, {self.postTitle}, {self.postBody}, {self.timestamp}"


class Note(models.Model):
    username = models.ForeignKey(User, on_delete=models.PROTECT, related_name="noteOwner")
    notes = models.CharField(max_length=1000)

    COMPLETE = 'complete'
    INCOMPLETE = 'incomplete'
    STATUS = [
        (COMPLETE, 'complete'),
        (INCOMPLETE, 'incomplete')
    ]
    status = models.CharField(max_length=10, choices=STATUS, default=INCOMPLETE)

    def __str__(self):
        return f"{self.id}, {self.username}, {self.notes}, {self.status}"


class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.PROTECT, related_name="commenter")
    commentedPost = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="commentedPost")
    comment = models.CharField(max_length=600)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "commenter": self.commenter,
            "commentedPost": self.commentedPost,
            "comment": self.comment,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }

    def __str__(self):
        return f"{self.id}, {self.commenter}, {self.commentedPost}, {self.comment}"
