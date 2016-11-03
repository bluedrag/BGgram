/*
    JavaScript for uploads.html, the main function is to upload a file to the firebase database and drive
    to then display this photo in a gallery where only available photos are the user's photos.
*/
 var ModalPanel,RenderedModalPanel;
 var storage;
 var saveVar, up;
 var snapshot;
$(function ()
{ 
    var waitInterval = setInterval(function(){
        if(user)
        {
            clearInterval(waitInterval);
            initializePage();
        }
    },1000);
/*
        For getting photos from firebase.
*/
    // Shows all public pictures at start of page
    function initializePage() {
        firebase.auth().onAuthStateChanged(function (){
        // Get a reference to the storage service, which is used to create references in your storage bucket
            storage = firebase.storage();
            var arr = new Set(); 
            var retriveData = firebase.database().ref('users/');

            // Function to load images to a set, calls get photo to display photos after loading images to set.
            function loadImgs(){
                arr = new Set();
                retriveData.on('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        // Key will be the UID
                        // This looks for photo in firebase database if they are from user and adds it to a set.
                        var uid = childSnapshot.key;
                        var path = uid + "/";
                        // ChildData will be the actual contents of the child
                        if(childSnapshot.key==user.uid){
                            for (var photoIndex in childSnapshot.val().photos) {
                                if (childSnapshot.val().photos.hasOwnProperty(photoIndex)) {
                                        var photoName = photoIndex.replace(/_(?!.*?_)/gi, ".");
                                        var photoPath = path + photoName;
                                        arr.add({src:photoPath,name:photoName});
                                }
                            }
                            loadingComplete=true;
                            $("#loadingGif").remove();
                            getPhotos();
                        }
                    });
                });
            }
            loadImgs();

            //This gets the photo from the set and displays them. 
            function getPhotos() {
                arr.forEach(function (val) {
                    var pr = storage.ref("Photo/" + val.src);
                    var imgsrc = "";

                    pr.getDownloadURL().then(function (url) {
                        var pixlrcommand = "javascript:pixlr.overlay.show({image:'"+encodeURIComponent(url)+"', title:'"+"image" +"', service:'editor'});";
                        // Temp Element acting as grid.
                        var tempElement = document.createElement('div');
                        tempElement.className= "col-lg-3 col-md-4 col-sm-6 col-xs-12 imageOuter";

                        // Rendering the element that contains the photo.
                        ReactDOM.render(
                          React.createElement(PhotoContainer, {src: url,pixlrcommand:pixlrcommand,name:val.name}),
                          tempElement
                        );                   

                        // Adding each photo to the main container.
                        $("#galleryrow").append(tempElement);

                        // When clicking the like button of a photo takes the value stored in the firebase dataase of
                        // the amount of likes that the photo has, and adds one to it.
                        $(".likeLinked").unbind().click(function(){
                                 var photoName = $(this).data("name").replace(".","_");
                                 var userData = firebase.database().ref('users/' + user.uid + "/photos/" + photoName);
                                 likes = 0;
                                 userData.on('value', function (snapshot) {
                                        if(snapshot.val().like!=null)
                                            likes = snapshot.val().like;
                                   });
                                 userData.update({like:(parseInt(likes)+1)});  
                        });
                    })
                });                
            }

        });
    }
/*
        For uploading a photo to firebase.
        ModalPanel creates a React element that is displayed when the user clicks on uploads.
        After the users chooses the properties of the photo to be uploaded and clicks on the
        upload button, this then calls a function that updates the firebase database and storage.
*/var panelState = false;
             ModalPanel = React.createClass({
                displayName:"ModalPanel",
                state:this.state,
                  getInitialState:function(){
                        return {showModal:false};
                  },
                  statics:{
                    getState:function(){
                        return state.showModal;
                    }
                  },
                  close:function(){
                        panelState = false;
                        this.setState({showModal:false});
                  },
                  open:function(){
                        panelState = true;
                        this.setState({showModal:true});
                  },
                  save:function(){
                        this.setState({showModal:false});
                        onSave();
                  },
                  render: function(){
                    return React.createElement("div",null,
                              React.createElement("button",{
                              className: "btn btn-default upload1",
                              onClick:this.open
                            },"Upload a Photo"),
                             React.createElement(ReactBootstrap.Modal,{show:this.state.showModal,onHide:this.close},
                                React.createElement(ReactBootstrap.Modal.Header,null,
                                        React.createElement("b",null,"Upload a New Photo"),
                                        React.createElement("br")),
                                React.createElement(ReactBootstrap.Modal.Body,null,
                                    React.createElement("div",null,
                                        React.createElement("b",null,"Privacy:"),
                                        React.createElement("br"),
                                        React.createElement("label",{className:"radioLabel"},"Private ",
                                            React.createElement("input",{type:"radio",name:"privacy",value:"private"})
                                        ),
                                        React.createElement("label",{className:"radioLabel"},"Public ",
                                            React.createElement("input",{type:"radio",name:"privacy",value:"public"})
                                        ),
                                        React.createElement("br",null),
                                        React.createElement("b",null,"Type:"),
                                        React.createElement("br"),
                                        React.createElement("label",{className:"radioLabel"},"Food ",
                                            React.createElement("input",{type:"radio",name:"type",value:"food"})
                                        ),
                                        React.createElement("label",{className:"radioLabel"},"Landscape ",
                                            React.createElement("input",{type:"radio",name:"type",value:"landscape"})
                                        ),
                                        React.createElement("label",{className:"radioLabel"},"Cars ",
                                            React.createElement("input",{type:"radio",name:"type",value:"cars"})
                                        ),
                                        React.createElement("label",{className:"radioLabel"},"People ",
                                            React.createElement("input",{type:"radio",name:"type",value:"people"})
                                        )
                                    )
                                ),
                                React.createElement(ReactBootstrap.Modal.Footer,null,
                                    React.createElement("button",{ 
                                      className: "btn btn-default cancel",
                                      onClick:this.close
                                    },"Cancel"),
                                    React.createElement("button",{
                                     className: "btn btn-default save",
                                      onClick:this.save
                                    },"Upload")
                                )
                                ) 
                    );
   
                }
            }); 
            var modalPanel = document.getElementById("modalPanel");
            RenderedModalPanel = ReactDOM.render( React.createElement(ModalPanel),modalPanel);


            function onSave(){
                var privacy =  $("input[name='privacy']:checked").val();
                var theme =  $("input[name='type']:checked").val();
                $("#typeId").val($("input[name='privacy']:checked").val());
                $("#privacyId").val($("input[name='type']:checked").val());

                if(privacy && theme){
                    $(".imageOuter").remove();
                    //$("#uploadForm").submit();
                    var formData = new FormData();

                    // loop through all the selected files
                    var files = $("#uploads")[0].files;
                    for (var i = 0; i < files.length; i++) {
                      var file = files[i];

                      // add the files to formData object for the data payload
                      formData.append('uploads', file, file.name);
                    }
                    formData.append("typeId",$("input[name='privacy']:checked").val());
                    formData.append("privacyId",$("input[name='type']:checked").val());
                    formData.append("userId",$("#userId").val());

                   $.ajax({
                      url: '/uploads',
                      type: 'POST',
                      data: formData,
                      processData: false,
                      contentType: false,
                      success: function(data){
                          console.log('upload successful!\n' + data);
                      },
                      xhr: function() {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();

                        // listen to the 'progress' event
                        xhr.upload.addEventListener('progress', function(evt) {

                          if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            console.log(percentComplete + '%');

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                              console.log('Done');
                            }

                          }

                        }, false);

                        return xhr;
                      }
                    });
                }
            }

            // This is to make the file chooser button look better.
            $(".topFile").click(function(){
                $("#userId").val(user.uid);
                $(".fileInput").click();
            });

            // This uploads a photo by updating the storage of firebase with
            // new added photos.
            function uploadPhoto(privacy, theme) {
                var photo = $(".fileInput")[0].files[0];
                var photoFile = new FormData();
                photoFile.append("img", photo);
                $.ajax({
                    type: "POST",
                    contentType: false,
                    url: "/uploads",
                    data: {"img":photoFile},
                    processData: false,
                    cache: false,
                    sucess: function(data){
                        console.log(data);
                    },
                    error: function(data){
                        console.log(data);
                    }

                });
                // $.ajax({
                //     url: "/uploads",
                //     type: 'PUT',
                //     data: { fileInput: "photo"}});
                updateDatabase(photo.name, privacy, theme);
                window.location.reload();
            }

            //Updating firebase database if a new photo has been uploaded. 
            function updateDatabase(name, privacy, theme) {
                var userData = firebase.database().ref('users/' + user.uid + "/photos/" + name.replace(/\./g, "_"));
                userData.set
                ({
                    Privacy: privacy,
                    Theme: theme,
                    Like: 0
                }); 
            }
   
   // Using React; One element containing a photo with all its properties, each photo is then, added to the 'gallery'.
    var PhotoContainer = React.createClass({
        displayName:"PhotoContainer",
        render: function(){
            return React.createElement("div",{className:"hovereffect"},//Adding each class to photos.
                                       React.createElement(PhotoImg, {src: this.props.src,name:this.props.name}),
                                       React.createElement("div", {className: "overlay"},
                                           React.createElement("h2",null,
                                                 React.createElement("a",{className:"imageedit",href:this.props.src},"Full Screen") ),
                                            React.createElement("p",null,
                                                 React.createElement("a",{className:"imageedit",href:this.props.pixlrcommand},"Edit") ),
                                            React.createElement("p",null,
                                                 React.createElement("a",{className:"imageedit likeLinked","data-name":this.props.name,href:"javascript://"},"Like") )
                                           )
                                       );
        }
    });
    // For each image.
    var PhotoImg = React.createClass({
        displayName:"PhotoImg",
        render: function(){
            return React.createElement("img",{className:"img-responsive","data-name":this.props.name,src:this.props.src});
        }
    });    
});

