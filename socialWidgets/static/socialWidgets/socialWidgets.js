var token = this.getCookie('csrftoken')
let counter = 1;
const quantity = 6;
let activeProfile = null;
let newZipcode = false;
var notHomepage = false;

// when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        //get username if signed in
        let username = document.getElementById('username').innerHTML;
        document.getElementById('profileUsername').innerHTML = username;
        
        // sets activeProfile to the current users username
        activeProfile = username;
    } catch {
        showPage("allUsers");
    }

    // loads users content
    load();

    //loads new posts if at end of screen
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
            setTimeout(function(){load();}, 500);
        }
    }

    //Load post section if image uploaded
    postInfoFormCheck = document.getElementById('postInfoForm');
    if (postInfoFormCheck != null) {
        showPage('newPost');

        // adds click listeners for filter buttons
        document.querySelectorAll('.filter').forEach(button => {
            button.onclick = function() {
                const filterType = this.dataset.filter;
                const newPostImg = document.getElementById('newPostImg');
                newPostImg.className = "";
                newPostImg.classList.add(filterType);
            }
        });

        // listen for button to add a post
        document.getElementById('addNewPost').onclick = a => {
            addPost();
        };
        // cancel post and refresh to hompage
        document.getElementById('cancelPost').onclick = a => {
            window.location.href = window.location.href;
        };
    }

    // adds click listeners for mainNav buttons
    document.querySelectorAll('.mainNavButton').forEach(a => {
        a.onclick = function() {
            showPage(this.dataset.page);
            if (notHomepage == true) {
                window.location.replace("/");
            }
        }
    });

    // adds click listeners for profileNav buttons
    document.querySelectorAll('.profileNavButton').forEach(a => {
        a.onclick = function() {
            showPage(this.dataset.page);
        }
    });

    // adds click listeners for individual profile buttons
    document.querySelectorAll('.profileLink').forEach(a => {
        a.onclick = function() {
            activeProfile = this.innerHTML;
            document.getElementById('profileUsername').innerHTML = activeProfile;
            try {
                username = document.getElementById('username').innerHTML;
                // display add post and zipcode input form in on users profile
                if (activeProfile == username) {
                    document.getElementById('addPostSection').style.display = 'inline-block';
                    document.getElementById('zipcodeInputSection').style.display = 'inline-block';
                    document.getElementById('newNoteForm').style.display = 'block';
                } else {
                    // hide if not your profile page
                    document.getElementById('addPostSection').style.display = 'none';
                    document.getElementById('zipcodeInputSection').style.display = 'none';
                    document.getElementById('newNoteForm').style.display = 'none';
                }
            } catch {
                // hide if not your profile page
                document.getElementById('addPostSection').style.display = 'none';
                document.getElementById('zipcodeInputSection').style.display = 'none';
                document.getElementById('newNoteForm').style.display = 'none';
            }
            showPage("profile");
            showPage("instagram");
        }
    });

    // if the page is the homepage
    if (notHomepage == false) {
        // adds click listeners for update zipcode button
        document.getElementById('zipcodeSubmit').onclick = a => {
            newZipcode = true;
            loadWeather();
        };

        // adds click listeners for add note button
        document.getElementById('noteSubmit').onclick = a => {
            addNewNote();
        };
    }

});


// show and hide correct sections of the page
function showPage(page) {
    if (page == "profile") {
        document.querySelector(`#${page}`).style.display = 'block';
        document.querySelector("#allUsers").style.display = 'none';
    } else if (page == "allUsers") {
        try {
            document.querySelector(`#${page}`).style.display = 'block';
            document.querySelector("#profile").style.display = 'none';
        } catch {
            notHomepage = true;
        }
    }

    if (page == "instagram") {
        document.querySelector(`#${page}`).style.display = 'block';
        document.querySelector("#taskList").style.display = 'none';
        document.querySelector("#weather").style.display = 'none';
        document.querySelector("#newPost").style.display = 'none';
        counter = 1;
        document.getElementById('postContainer').innerHTML = ""
        load();
    } else if (page == "taskList") {
        loadNotes();
        document.querySelector(`#${page}`).style.display = 'block';
        document.querySelector("#instagram").style.display = 'none';
        document.querySelector("#weather").style.display = 'none';
        document.querySelector("#newPost").style.display = 'none';
    } else if (page == "weather") {
        newZipcode = false;
        document.getElementById("weatherContainer").innerHTML = "";
        loadWeather();
        document.querySelector(`#${page}`).style.display = 'block';
        document.querySelector("#taskList").style.display = 'none';
        document.querySelector("#instagram").style.display = 'none';
        document.querySelector("#newPost").style.display = 'none';
    } else if (page == "newPost") {
        document.getElementById('addImageDiv').style.display = "block";
        document.querySelector(`#${page}`).style.display = 'block';
        document.querySelector("#instagram").style.display = 'none';
        document.querySelector("#taskList").style.display = 'none';
        document.querySelector("#weather").style.display = 'none';
    }
}


function addPost() {
    // get post info
    const imgURL = document.getElementById("imgURL").innerHTML;
    const imgFilter = document.getElementById("newPostImg").className;
    const postTitle = document.getElementById("postTitle").value;
    const postBody = document.getElementById("postBody").value;

    // send post info add new post
    fetch('/newpost', {
        headers: {
            'X-CSRFToken': token
        },
        method: 'POST',
        body: JSON.stringify({
            imgURL: imgURL,
            imgFilter: imgFilter,
            postTitle: postTitle,
            postBody: postBody
        })
    })
    .then(result =>{
        // refresh the page when the post has been added
        window.location.href = window.location.href;
    })
}


function load() {
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;

    // get new posts and add new posts
    fetch(`/postList?start=${start}&end=${end}`, {
        headers: {
            'X-CSRFToken': token
        },
        method: 'PUT',
        body: JSON.stringify({
            activeProfile: activeProfile
        })
    })
    .then(response => response.json())
    .then(data => {
        data.posts.forEach(add_post);

        // check if no posts are loaded and display message if no posts
        try {
            if (document.getElementById('postContainer').innerHTML === "") {
                document.getElementById('noPosts').style.display = "block";
            } else {
                document.getElementById('noPosts').style.display = "none";
            }
        } catch {}

        // adds click listeners for hide/show comments button
        document.querySelectorAll('.showComments').forEach(a => {
            a.onclick = function() {
                const thisCommentsDiv = document.getElementById('commentSectionDiv' + this.id);
                if (thisCommentsDiv.style.display == 'none') {
                    thisCommentsDiv.style.display = 'block';
                } else if (thisCommentsDiv.style.display == 'block') {
                    thisCommentsDiv.style.display = 'none';
                }
            }
        });
        // listen for comment added and add comment
        document.querySelectorAll('.addComment').forEach(a => {
            a.onclick = function() {
                const buttonID = this.id;
                const postID = buttonID.replace(/\D/g,'');
                const newComment = document.getElementById(this.id).value;

                fetch('/newcomment', {
                    headers: {
                        'X-CSRFToken': token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        postID: postID,
                        newComment: newComment
                    })
                })
                .then(response => response.json())
                .then(data => {
                    add_comment(data.newComment[0]);
                    const commentInfo = JSON.parse(data.newComment[0]);
                    document.getElementById('commentForm' + commentInfo.postID).value = "";
                })
            }
        });
    })
}


function addNewNote(){
    // add a new note to the tasklist
    const newNote = document.getElementById('newNote').value;

    fetch('/notes', {
        headers: {
            'X-CSRFToken': token
        },
        method: 'POST',
        body: JSON.stringify({
            newNote: newNote,
            activeProfile: activeProfile
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("notesList").innerHTML = "";
        document.getElementById('newNote').value = "";
        loadNotes();
    })
}


function loadNotes() {
    // load the notes/tasklist
    document.getElementById("notesList").innerHTML = "";
    fetch('/notes', {
        headers: {
            'X-CSRFToken': token
        },
        method: 'PUT',
        body: JSON.stringify({
            activeProfile: activeProfile
        })
    })
    .then(response => response.json())
    .then(data => {
        data.notes.forEach(addNote);

        // check if there are no notes
        const noteList = document.getElementById('notesList')
        const notes = noteList.innerHTML
        if (!notes.replace(/\s/g, '').length) {
            try {
                let username = document.getElementById('username').innerHTML;
                if (username !== activeProfile) {
                    noteList.innerHTML = "<h4>Looks like this user has nothing in their checklist right now :(</h4>";
                }
            } catch {
                noteList.innerHTML = "<h4>Looks like this user has nothing in their checklist right now :(</h4>";
            }
        }

        // adds click listeners for checkbox button for notes
        document.querySelectorAll('.checklistButton').forEach(a => {
            a.onclick = function() {
                fetch('/noteStatus', {
                    headers: {
                        'X-CSRFToken': token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        noteStatus: this.checked,
                        noteID: this.id
                    })
                })
            }
        });

        // adds click listeners for remove note button
        document.querySelectorAll('.deleteNoteButton').forEach(a => {
            a.onclick = function() {
                fetch('/noteDelete', {
                    headers: {
                        'X-CSRFToken': token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        noteID: this.id
                    })
                })
                .then(response => response.json())
                .then(data => {
                    loadNotes();
                })
            }
        });
    })
}


function loadWeather() {
    // loads the weather based on zipcode
    const apiKey = "c6d933af732235270599670ab420cf42";
    const countryCode = "us";

    // add weather info
    if (newZipcode == false) {
        fetch('/weather', {
            headers: {
                'X-CSRFToken': token
            },
            method: 'PUT',
            body: JSON.stringify({
                activeProfile: activeProfile
            })
        })
        .then(response => response.json())
        .then(data => {
            const dataArray = data.posts;
            const parsedData = JSON.parse(dataArray);
            const zipCode = parsedData.zipcode;
            if (zipCode != "") {
                fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${apiKey}`, {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    weatherInfo = data;
                    addWeather(weatherInfo);
                })
            } else {
                // if user hasn't set their location display
                const weatherContainer = document.getElementById("weatherContainer");
                weatherContainer.innerHTML = "<h4>User has not set their location.</h4>"
            }
        })
    } else if (newZipcode == true) {
        // update weather zipcode
        const updatedZipcode = document.getElementById("zipcode").value;

        fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${updatedZipcode},${countryCode}&appid=${apiKey}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // error check 404 and 400 responses
            if (data.cod == "404" || data.cod == "400") {
                document.getElementById('invalidZip').style.display = "block";
            } else {
                document.getElementById('zipcode').value = "";
                document.getElementById('invalidZip').style.display = "none";
                fetch('/weather', {
                    headers: {
                        'X-CSRFToken': token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        activeProfile: activeProfile,
                        updatedZipcode: updatedZipcode
                    })
                })
                .then(response => response.json())
                .then(data => {
                    showPage("weather");
                })
            }
        })
    }
}


function add_post(contents) {
    try {
        username = document.getElementById('username').innerHTML;
    } catch {
        username = null;
    }

    parsedContent = JSON.parse(contents)

    // card
    const card = document.createElement('div');
    card.classList.add('card', 'card-shadow', 'bg-dark');
    const image = document.createElement('img');
    image.classList.add('card-img-top', parsedContent.imgFilter);
    image.src = parsedContent.imgURL;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-body');
    cardInfo.id = "cardInfo" + parsedContent.id;
    const title = document.createElement('h5');
    title.classList = 'card-title';
    title.innerHTML = parsedContent.title;
    const body = document.createElement('p');
    body.classList = 'card-text';
    body.innerHTML = parsedContent.postBody;
    const timestamp = document.createElement('p');
    timestamp.classList = 'card-text';
    const timestampText = document.createElement('small');
    timestampText.classList = 'text-muted';
    timestampText.innerHTML = parsedContent.timestamp;
    timestamp.append(timestampText);

    // comments
    const commentButton = document.createElement('a');
    commentButton.classList.add('pointer', 'showComments');
    commentButton.id = parsedContent.id;
    commentButton.setAttribute('style', 'margin-bottom: 20px;')
    commentButton.innerHTML = "Comments";
    const commentsFormDiv = document.createElement('div');
    commentsFormDiv.classList.add('form-inline');
    const line = document.createElement('hr');
    const commentInput = document.createElement('input');
    commentInput.classList.add('form-control', 'input-sm');
    commentInput.setAttribute('style', 'width: 100% !important');
    commentInput.id = 'commentForm' + parsedContent.id
    commentInput.placeholder = 'comment';
    const commentSubmit = document.createElement('button');
    commentSubmit.innerHTML = 'Submit';
    commentSubmit.classList.add('btn', 'btn-outline-primary', 'addComment', 'commentForm' + parsedContent.id);
    commentSubmit.id = 'commentForm' + parsedContent.id
    commentsFormDiv.append(commentInput);
    commentsFormDiv.append(commentSubmit);
    const commentsDiv = document.createElement('div');
    commentsDiv.id = "post" + parsedContent.id;
    commentsDiv.classList.add('bg-dark');

    const commentSectionDiv = document.createElement('div');
    commentSectionDiv.id = "commentSectionDiv" + parsedContent.id;
    commentSectionDiv.style.display = 'none';
    commentSectionDiv.append(line);
    if (username !== null) {
        commentSectionDiv.append(commentsFormDiv);
    }
    commentSectionDiv.append(line);
    commentSectionDiv.append(commentsDiv);

    loadComments();

    cardInfo.append(title);
    cardInfo.append(body);
    cardInfo.append(timestamp);
    cardInfo.append(commentButton);
    cardInfo.append(commentSectionDiv);
    card.append(image);
    card.append(cardInfo);

    const postContainer = document.getElementById('postContainer');
    postContainer.append(card);
}


function loadComments() {
    // load comments in the posts
    fetch('comments', {
        headers: {
            'X-CSRFToken': token
        },
        method: 'PUT',
        body: JSON.stringify({
            postID: parsedContent.id,
        })
    })
    .then(response => response.json())
    .then(data => {
        try {
            data.comments.forEach(add_comment);
        } catch {
        }
    })
}


function add_comment(content) {
    // creates and adds comment
    const commentInfo = JSON.parse(content);

    const comment = document.createElement('p');
    comment.classList.add('bg-dark');
    comment.innerHTML = "<b>" + commentInfo.commenter + "</b>" + ": " + commentInfo.commentBody + "<br>" + "<small>" + commentInfo.timestamp + "</small>";
    commentSectionDiv = document.getElementById("commentSectionDiv" + commentInfo.postID);
    const commentsDiv = document.getElementById('post' + commentInfo.postID);
    commentsDiv.append(comment);
    const line = document.createElement('hr');
    commentSectionDiv.append(commentsDiv);
    commentsDiv.append(line);
}


function addNote(noteContents){
    // creates and adds notes
    const parsedContent = JSON.parse(noteContents);
    
    // checks if user is signed in
    try {
        username = document.getElementById('username').innerHTML;
    } catch {
        username = null;
    }

    const noteItem = document.createElement('li');
    noteItem.classList.add('list-group-item', 'bg-dark');
    const noteRow = document.createElement('div');
    noteRow.classList.add('row', 'form-inline');
    noteItem.append(noteRow);
    const noteCol = document.createElement('div');
    noteCol.classList.add('col-md-10', 'form-inline');
    noteRow.append(noteCol);
    const checkbox = document.createElement('input');
    if (username == activeProfile) {
        checkbox.classList.add('pointer', 'checklistButton');
    } else {
        checkbox.disabled = true;
    }
    checkbox.type = "checkbox";
    checkbox.id = parsedContent.id;
    // check checkbox if note is marked complete
    if (parsedContent.noteStatus == "complete") {
        checkbox.checked = true
    }
    noteCol.append(checkbox);
    const noteBody = document.createElement('div');
    noteBody.setAttribute('style', 'margin-left: 15px;')
    noteBody.innerHTML = parsedContent.noteBody;
    noteCol.append(noteBody);
    const noteDeleteCol = document.createElement('div');
    noteDeleteCol.classList.add('col-md-2');
    noteRow.append(noteDeleteCol);
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-outline-light', 'deleteNoteButton');
    deleteButton.id = parsedContent.id;
    deleteButton.innerHTML = "Remove";
    if (username == activeProfile) {
        noteDeleteCol.append(deleteButton);
    }
    const noteList = document.getElementById("notesList");
    noteList.append(noteItem);
}


function addWeather(weatherInfo) {
    // creates and adds weather
    tempF = (parseInt(weatherInfo.main.temp) - 273.15) * 9/5 + 32;

    const weatherCard = document.createElement('div');
    weatherCard.classList.add('card', 'text-white', 'bg-dark', 'mb-3', 'weatherCard', 'card-shadow');
    weatherCard.setAttribute('style', 'max-width: 25rem;');
    const weatherIconSpot = document.createElement('div');
    weatherIconSpot.classList.add('card-header');
    const weatherIcon = document.createElement('img');
    weatherIcon.src = '/media/weather_icons/PNG/' + weatherInfo.weather[0].icon + ".png";
    weatherIcon.width = "150";
    weatherIconSpot.append(weatherIcon);
    weatherCard.append(weatherIconSpot);
    const location = document.createElement("div");
    location.classList.add('card-header');
    const locationName = document.createElement("h3");
    locationName.innerHTML = weatherInfo.name;
    location.append(locationName);
    weatherCard.append(location);
    const weatherStatus = document.createElement('ul');
    weatherStatus.classList.add('list-group', 'list-group-flush');
    weatherCard.append(weatherStatus);
    const description = document.createElement('div');
    description.innerHTML = weatherInfo.weather[0].description;
    weatherStatus.append(description);
    const temperature = document.createElement('div');
    temperature.innerHTML = Math.round(tempF) + '&#176; F';
    weatherStatus.append(temperature);

    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.append(weatherCard);
}


// for X-CSRFToken
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
