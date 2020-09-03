Final Project: Social Widgets

This project allows users to create their own social widgets account to utilize for themselves and others to view. I've create three
 different 'widgets' to use. There is the Image posting/viewing widget, the task list widget, and the weather widget. I describe the
 functionalities of each below. I didn't divide up the javascript functions to different files so the socialWidgets.js file has all the
 JavaScript in it. I edited the views.py, admin.py, models.py, and settings.py files along with the HTML files.

All Users: If you click on 'All Users' or 'Social Widgets' in the main nav you can get to a page that displays all the users and the users
 latest post image if there is one. Click on their username to view their profile.

PicPosts/Add Post: Allows users to post images to their account. In the 'Add Post' tab within the users profile the user can add a image for
 a new post. Once uploading an image you can add a filter, title, and description to the image. Then you can publish the post and it will 
 show up in the PicPosts tab. When you scroll to the bottom of the PicPosts page more posts will be loaded if there are more. Note that the 
 organization of posts are based on the Bootstrap Card Columns to be organized in masonry-like columns. Cards are ordered from top to bottom 
 and left to right. If you click on the 'Comments' text you can open up and view the existing comments and if signed in you can add a 
 comment to the post.

Task List: This widget allows you to add and remove tasks for yourself. You can also check them off or remove when finished with a task.
When viewing other peoples profiles you can only view the status and different tasks the other user has set for themselves.

Weather Widget: This widget uses the OpenWeather Maps API and retrieves the locations based on US Zipcodes. The widget will pull in an image
 of the weather along with the temp in fahrenheit and the weather description. Users can view other peoples current weather on their profile 
 and can set their own location on their profile.

Note: If you need to access the other accounts, the password is the same as the username.


Resources Used:
Bootstrap
OpenWeather Maps API: https://openweathermap.org/api
Instagram filters: Some CSS filters came from here https://github.com/picturepan2/instagram.css/tree/master/dist
Weather Icons: Used weather icons from https://www.dovora.com/
Image Upload Tutorial: https://www.youtube.com/watch?list=PLLxk3TkuAYnpm24Ma1XenNeq1oxxRcYFT&time_continue=8&v=Zx09vcYq1oc&feature=emb_logo


Hope you like the project!
Thanks for reading and reviewing! :D
-Mike Chen
