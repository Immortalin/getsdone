GETSDONE  = "http://192.168.174.135:9292/";
REST      = GETSDONE + "api";
AUTH      = GETSDONE + "auth";

function login() {

  $.ajax({
    type: "GET",
    url: AUTH + "/login",
    success: function( data, textStatus, xhr ) {
      console.log(xhr);
      window.location.href = data.msg;
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    dataType: "json"
  });

} // login


function logout() {

  $.ajax({
    type: "PUT",
    url: AUTH + "/logout",
    success: function( data, textStatus, xhr ) {
      console.log(xhr);
      window.location.href = "/";
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });

} // logout


function follow(id) {

   $.ajax({
    type: "PUT",
    url: REST + "/users/" + id + "/followers",
    success: function( data, textStatus, xhr ) {
      console.log(xhr);
      window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });
 
} // follow


function unfollow(id) {

  $.ajax({
    type: "DELETE",
    url: REST + "/users/" + id + "/followers",
    success: function( data, textStatus, xhr ) {
      console.log(xhr);
      window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });

} // unfollow


function addAction(isReassign) {

  if(isReassign) {
    var reassignid = document.getElementById("actionid").value;
    var text = document.getElementById("reassignment").value;
  }
  else {
    var reassignid = null;
    var text = document.getElementById("action").value;
  }

  var owners   = twttr.txt.extractMentions(text);
  var hashtags = twttr.txt.extractHashtags(text);

  $.ajax({
    type: "POST",
    url: REST + "/actions",
    data: {
      "reassignid": reassignid,
      "action": text,
      "hashtags": hashtags,
      "owners": owners
    },
    success: function( data, textStatus, xhr ) {
      console.log(data);
      window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    dataType: "json"
  });

} // addAction


function deleteAction(id) {

  $.ajax({
    type: "DELETE",
    url: REST + "/actions/" + id,
    success: function( data, textStatus, xhr ) {
      console.log(data);
      window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });

} // deleteAction


function completeAction(id) {

   $.ajax({
    type: "PUT",
    url: REST + "/actions/" + id,
    success: function( data, textStatus, xhr ) {
      console.log(data);
      window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });

 
} // completeAction


function reassignDialog(id) {

  $("#rcounter").text("140");
  original = $("#"+id).html();

  $("#current").html(original);
  $("#actionid").val(id);

  $("#reassign-dialog").dialog("open");

  $("#reassignment").val("");
  $("#reassignment").focus();

} // reassignDialog


function addComment(id) {

  var comment = document.getElementById("comment" + id).value;

  $.ajax({
    type: "POST",
    url: REST + "/actions/" + id + "/comments",
    data: {
      comment: comment
    },
    success: function( data, textStatus, xhr ) {
      //window.location.reload();
      prependComment( id, data );
      clearComment(id);
      //window.location.hash = id;
      //window.location.reload();
    },
    error: function( xhr, textStatus, msg ) {
      console.log(msg);
    },
    datatype: "json"
  });

   
  
} // addComment


function prependComment( id, data ) {

  response = JSON.parse(data);
  console.log(response.msg.comment);
  console.log(response.msg.comment.id);
  var comments = document.getElementById("clist" + id);
  console.log(comments.childNodes);

  var comment = document.createElement("div");
  var header  = document.createElement("div");
  var icon    = document.createElement("img");
  var user    = document.createElement("a");
  var text    = document.createElement("p");

  comment.setAttribute( "id", "dd" + response.msg.comment.id );
  comment.className = "comment";

  header.className = "comment-header form-inline";

  icon.setAttribute( "src", "images/glyphicons_003_user.png" );
  icon.setAttribute( "width", "32" );
  icon.className = "pull-left spacing";

  user.setAttribute( "href", "/users/stephenhu" );
  user.className = "pull-left spacing";
  user.innerHTML = "@stephenhu: ";

  text.className = "since";
  text.innerHTML = response.msg.comment.comment + " (now)";

  header.appendChild(icon);
  header.appendChild(user);
  header.appendChild(text);
  comment.appendChild(header);

  comments.insertBefore( comment, comments.childNodes[0] );

} // prependComment


function clearComment(id) {

  var comment = document.getElementById("comment" + id);

  comment.value = "";

} // clearComment


function viewComments(id) {

  if( $("#c" + id).hasClass("hide") ) {
    $("#c" + id).removeClass("hide");
  }
  else {
    window.location.hash = "";
    $("#c" + id).addClass("hide");
  }

} // viewComments


function openComments() {

  var hash = window.location.hash.replace( "#", "" );
  viewComments(hash);
  
} // reloadComments


function parseReassign(text) {

  var before = text[0].trim();
  //var users  = before.match(/(?:\s|^)@[a-zA-Z0-9]+/g);

  if( users != null ) {
    alert(users);
  }
  else {
    alert("please add a user to reassign, e.g. @stephen");
  }

} // parseReassign


function parsePriority(text) {

  var priority = text.match("\B!{1}[1-3]");
  
  if( priority != null ) {
    return priority[0].replace( "!", "" );  
  }
  else {
    return null;
  }
  
} // parsePriority


function count( element, counter_name ) {
 
  var action  = element.value;
  var counter = document.getElementById(counter_name);
  
  counter.firstChild.nodeValue = 140 - action.length;
  
} // count


function goto(hashtag) {

  window.location.href = "/hashtags/" + hashtag;

} // goto

