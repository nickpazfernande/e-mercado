//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {

});
var profile;

function onSignIn(googleUser) {

    var profile = googleUser.getBasicProfile();
    var user = profile.getEmail;
    var pass = profile.getGivenName;
    $("#idGoogle").text(profile.getGivenName());
    localStorage.setItem('userGoogle' ,  'inicio' )

    window.location.replace("https://nickpazfernande.github.io/workspace-inicial/home.html");
}

function onSignIn1(googleUser) {

    var profile = googleUser.getBasicProfile();
    $("#idGoogle").text(profile.getGivenName());
    $("#pic").attr('src', profile.getImageUrl());
}


function setUser(){
  var nombre = document.getElementById('user').value ;
  localStorage.setItem('userLocal' ,  nombre);
}

