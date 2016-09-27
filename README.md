#__BGgram__

Welcome to BGgram, home of the best and most user friendly online image
and background editor. Choose your like from millions of trending images, 
and edit it to your desires.

The website is held on the `public/` directory.

The main entry point is `index.html`.
All other html files are in `html/`.
All css files are in `css/`.
All used script files are in `scripts/`.
All local images are in `images/`.

Current placeholder images were obtained on:
* https://unsplash.it/

Currently used API:
* __Pixabay__ : https://pixabay.com/api/docs/
* __Pixlr__ : https://apps.pixlr.com/developer/api/

You may access the site at - __From HW3 Onwards__:
* https://bggram-d9ba0.firebaseapp.com/

Github hosted website:
* https://bluedrag.github.io/BGgram/

The github repository is located at
* https://github.com/bluedrag/BGgram

The github releases are located at
* https://github.com/bluedrag/BGgram/releases


##HW3 Scenarios

####__Implemented: Scenario one and two__

###__Scenario one - Using Firebase__: 
* The user will have the ability to login to his account using an account he registers, which will save the information in the Firebase database.
* After the user logs in, he will be able to access to his “myuploads” page where he can upload an image to his account and see the images he has already uploaded or the users have uploaded and have made public. The image’s storage location is the Firebase database.
* After the user clicks the upload button, the image path in the database will be created using user and image info then uploaded..
* The database is then going to re-retrieve the photos and update ‘myuploads’ page.
* The user does not have the ability to login using other methods (google,etc.) yet.

###__Scenario two - Browse Images__:
User can search any image they want on the browse page. If they like an image, they can edit it by clicking the ‘edit’ button and save it to their desktop. The edit button will open up the pixlr editor with the current image. Users will be able to use the full functionality of the editor.

*API used*:
* Pixlr (Image Editor)
* Pixabay (Image search engine)

*Current Restrictions*:
* Toggle between different views(ex. ‘popular’ vs ‘most recent’) not supported. Default is ‘popular’
* Safesearch is always on.
* Browse page is limited to MAX of 12 images. No page functionality(pg 1, pg 2, etc.)


###__Scenario three - Data manipulation with D3.js__:
* The user will have the ability to see the most uploaded photos.
* The browse page will have toggle abilities between different types of views
* Pictures will be browseable using tags

###__Scenario four - View and search for images__:
* The user will have the ability to search public photos (including other users’ photos) from the Firebase database as well as from the pixabay api.
* Browse page will feature a toggle between gallery mode and normal mode. Normal mode will have __expanded__ div on hover.


