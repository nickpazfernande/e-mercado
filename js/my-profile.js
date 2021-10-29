//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  //De existir, cargo los valores guardados.
    loadChange();
    loadImage();
    loadImageProfile();
    
});

  //Funcion que guarda en localstorage los valores de los inputs.
function saveChange() {
  //Guardo los datos ingresados en sus respectivas variables.
  let profile = {};

  profile.nombre = document.getElementById("perfilNombre").value;
  profile.apellido = document.getElementById("perfilApellido").value;
  profile.email = document.getElementById("perfilMail").value;
  profile.telefono = document.getElementById("perfilTelefono").value;

  if (profile.nombre == "" ||  profile.apellido == "" || profile.email == "" || profile.telefono == ""   ) {
    
    document.getElementById("alertPerfil").innerHTML = `*No puedes dejar campos vacios.*`
  } else {
    document.getElementById("alertPerfil").className = "text-secondary text-success mr-3 ";
    document.getElementById("alertPerfil").innerHTML = `*Datos guardados exitosamente.*`
    
    //Creo los sessionStoragge, o los modifico. 
    localStorage.setItem("perfil", JSON.stringify(profile));
     
}
  }


  //Funcion que carga los valores existentes del localStorage. 
function loadChange(){
    //Cargo los valores de los inputs.
    let perfil = JSON.parse(localStorage.getItem("perfil"))
    document.getElementById("perfilNombre").value = perfil.nombre;
    document.getElementById("perfilApellido").value = perfil.apellido;
    document.getElementById("perfilMail").value = perfil.email;
    document.getElementById("perfilTelefono").value = perfil.telefono;

    //Cargo valores debajo de la imagen. 
    document.getElementById("nombreUserTxt").innerHTML = perfil.nombre;
    document.getElementById("emailUserTxt").innerHTML = perfil.email;
}


//Evento que se ejecuta cuando cambia el input de imagen.
document.querySelector("#inputImage").addEventListener("change", function () {
  //creo una nueva variable tipo filReader
  const reader = new FileReader();

  //Evento de la variable, si se cargo algo, settea en el localStoragge su result.
  reader.addEventListener("load", () => {
    localStorage.setItem("imgPerfil", reader.result);
    loadImage();
    loadImageProfile();
  })

  reader.readAsDataURL(this.files[0]);
})

function loadImageProfile () {
  const imgUrl = window.localStorage.getItem("imgPerfil")
  if (imgUrl){
  document.getElementById("imgProfilePrev").setAttribute("src", imgUrl)
  }
}



