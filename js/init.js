const CATEGORIES_URL =
  "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL =
  "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const CURRENCY_URL =
  "https://cotizaciones-brou.herokuapp.com/api/currency/latest";

const user = undefined;
var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
  window.location.replace("https://nickpazfernande.github.io/e-comercio");
}
function getUser() {
  document.getElementById("idGoogle").innerHTML =
    localStorage.getItem("userLocal");
}

function SignOutTotal() {
  removeUser();
  signOut();
}
function removeUser() {
  localStorage.removeItem("userLocal");
  localStorage.removeItem("userGoogle");
}

function verLogin() {
  if (
    window.localStorage.getItem("userLocal") === null &&
    window.localStorage.getItem("userGoogle") === null
  ) {
    window.location.replace("index.html");
  }
}

function addNavBar() {
  let htmlContentToAppend = `<nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark p-3">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">e-Mercado</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="categories.html">Categorías</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="products.html">Productos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="sell.html">Vender</a>
        </li>
        <li class="nav-item dropdown navbar-dark bg-dark text-white">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            NombreUser
          </a>
          <ul class="dropdown-menu navbar-dark bg-dark text-white " aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item text-white" href="cart.html">Ver Carrito</a></li>
            <li><a class="dropdown-item text-white" href="my-profile.html">Mi Perfil</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-white" onclick="SignOutTotal()" href="index.html">Cerrar sesión</a></li>
          </ul>
        </li>
      </ul> 
    </div>
  </div>
</nav>
  `;

  document.getElementById("navBar").innerHTML = htmlContentToAppend;
  document.getElementById("navbarDropdown").innerHTML =
    localStorage.getItem("userLocal");
}

//Funcion que carga la imagen en pantalla.
//Siempre y cuando exista en localStoragge.  
function loadImage(){
  const imgUrl = window.localStorage.getItem("imgPerfil")
  if (imgUrl){
    
    document.getElementById("pic").setAttribute("src", imgUrl)
  }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
  //Al iniciar todas las paginas menos el login, se ejecutan estas dos funciones.

  //Cargamos el nombre de usuario en el menu
  getUser();

  //Verificamos si existe usuario logueado sino rediriguimos al login.
  verLogin();

  //Cargamos el menu superior para pantallas menores a 1000px.
  addNavBar();
  loadImage();
});
