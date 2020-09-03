from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
# for uploading images
from django.core.files.storage import FileSystemStorage

from .models import User, Post, Note, Comment
from .forms import PostForm
import json


def index(request):
    # if request is post upload the image
    context = {}
    if request.method == 'POST':
        uploaded_file = request.FILES['image']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        context['url'] = fs.url(name)
        context['allUsers'] = User.objects.all()

    context['allUsers'] = User.objects.all()

    return render(request, "socialWidgets/index.html", context)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "socialWidgets/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "socialWidgets/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "socialWidgets/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "socialWidgets/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "socialWidgets/register.html")


def postList(request):
    # get post info and push it to the api
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start+5))
    count = 0

    if request.user.is_authenticated:
        usersUsername = request.user.username
        activeProfile = usersUsername

    # get the current profile page the user is on
    try:
        data = json.loads(request.body)
        activeProfile = str(data.get("activeProfile", ""))
    except:
        pass

    allPosts = Post.objects.all()
    data = []
    for post in reversed(allPosts):
        postID = post.id
        username = str(post.username)
        if username == activeProfile:
            imgURL = str(post.image)
            imgFilter = str(post.imgFilter)
            title = str(post.postTitle)
            body = str(post.postBody)
            timestamp = str(post.timestamp.strftime("%b %-d %Y, %-I:%M %p"))
            postInfo = {
                "id": postID,
                "username": username,
                "imgURL": imgURL,
                "imgFilter": imgFilter,
                "title": title,
                "postBody": body,
                "timestamp": timestamp,
            }
            jsonPostInfo = json.dumps(postInfo)
            count = count + 1
            if start <= count <= end:
                data.append(jsonPostInfo)

    return JsonResponse({"posts": data}, status=200)


def comments(request):
    # loop through the comments and get the correct comments for post
    data = json.loads(request.body)
    postID = data.get("postID", "")

    allComments = Comment.objects.all()
    data = []
    for comment in allComments:
        if comment.commentedPost.id == postID:
            commenter = str(comment.commenter.username)
            commentBody = str(comment.comment)
            timestamp = str(comment.timestamp.strftime("%b %-d %Y, %-I:%M %p"))
            commentInfo = {
                "postID": postID,
                "commenter": commenter,
                "commentBody": commentBody,
                "timestamp": timestamp
            }
            jsoncommentInfo = json.dumps(commentInfo)
            data.append(jsoncommentInfo)

    return JsonResponse({"comments": data}, status=200)


def newcomment(request):
    # get comment info and add a new comment if user is authenticated
    if request.method == 'POST':
        if request.user.is_authenticated:
            username = request.user.username
            user = User.objects.get(username=username)

            data = json.loads(request.body)
            postID = data.get("postID", "")
            post = Post.objects.get(id=postID)
            newComment = data.get("newComment", "")

            addComment = Comment(commenter=user, commentedPost=post, comment=newComment)
            addComment.save()

            latestComment = Comment.objects.all().latest('timestamp')
            data = []
            commenter = str(latestComment.commenter)
            commentBody = str(latestComment.comment)
            timestamp = str(latestComment.timestamp.strftime("%b %-d %Y, %-I:%M %p"))
            commentInfo = {
                "postID": postID,
                "commenter": commenter,
                "commentBody": commentBody,
                "timestamp": timestamp
            }
            jsoncommentInfo = json.dumps(commentInfo)
            data.append(jsoncommentInfo)

    return JsonResponse({"newComment": data}, status=200)


def newpost(request):
    # get new posts info and add new post
    if request.method == 'POST':
        if request.user.is_authenticated:
            username = request.user.username
            user = User.objects.get(username=username)

        data = json.loads(request.body)
        imgURL = data.get("imgURL", "")
        imgFilter = data.get("imgFilter", "")
        postTitle = data.get("postTitle", "")
        postBody = data.get("postBody", "")

        User.objects.filter(username=username).update(profileImage=imgURL, imgFilter=imgFilter)

        addPost = Post(username=user, image=imgURL, imgFilter=imgFilter, postTitle=postTitle, postBody=postBody)
        addPost.save()

        return JsonResponse({"message": "Post Created successfully."}, status=201)

    return JsonResponse({"message": "Post Created successfully."}, status=201)


def notes(request):
    # gets correct user and loops through all the notes and pushes to api
    if request.user.is_authenticated:
        usersUsername = request.user.username
        activeProfile = usersUsername

    try:
        data = json.loads(request.body)
        activeProfile = str(data.get("activeProfile", ""))
    except:
        pass

    if request.method == 'POST':
        if request.user.is_authenticated:
            # get users username
            username = request.user.username
            user = User.objects.get(username=username)

            # get new notes text
            newNote = str(data.get("newNote", ""))

            addNote = Note(username=user, notes=newNote)
            addNote.save()

    allNotes = Note.objects.all()
    noteList = []
    for note in reversed(allNotes):
        if str(note.username) == activeProfile:
            noteID = str(note.id)
            noteUser = str(note.username)
            noteBody = str(note.notes)
            noteStatus = str(note.status)

            noteInfo = {
                "id": noteID,
                "noteUser": noteUser,
                "noteBody": noteBody,
                "noteStatus": noteStatus,
            }
            jsonNoteInfo = json.dumps(noteInfo)
            noteList.append(jsonNoteInfo)

    return JsonResponse({"notes": noteList}, status=200)


def noteStatus(request):
    # checks if note is checked off or not to display on the front-end
    if request.method == 'POST':
        if request.user.is_authenticated:
            info = json.loads(request.body)
            noteID = int(info.get("noteID", ""))
            noteStatus = str(info.get("noteStatus", ""))

            if noteStatus == "True":
                noteStatus = "complete"
                Note.objects.filter(id=noteID).update(status=noteStatus)
            elif noteStatus == "False":
                noteStatus = "incomplete"
                Note.objects.filter(id=noteID).update(status=noteStatus)

    return JsonResponse({"Status": "Updated"}, status=201)


def noteDelete(request):
    # deletes the note from the database
    if request.method == 'POST':
        if request.user.is_authenticated:
            info = json.loads(request.body)
            noteID = int(info.get("noteID", ""))

            deleteNote = Note.objects.get(id=noteID)
            deleteNote.delete()

    return JsonResponse({"Status": "Note Deleted"}, status=201)


def weather(request):
    # get profile pages username
    info = json.loads(request.body)
    activeProfile = str(info.get("activeProfile", ""))

    # add new zipcode
    if request.method == 'POST':
        newZipcode = str(info.get("updatedZipcode", ""))
        if request.user.is_authenticated:
            username = request.user.username
            User.objects.filter(username=username).update(zipCode=newZipcode)

    # get users zipcode
    user = User.objects.get(username=activeProfile)
    zipcode = str(user.zipCode)
    data = []
    weatherInfo = {
        "zipcode": zipcode
    }
    jsonWeatherInfo = json.dumps(weatherInfo)
    data.append(jsonWeatherInfo)

    return JsonResponse({"posts": data}, status=200)
