//listas vacias para luego agregarle la informacion desde los json.
var productInfo = [];
var comments = [];
var arrayProduct = [];

//evento que se ejecuta al iniciar la pagina
document.addEventListener("DOMContentLoaded", function (e) {
  //Primer evento trae la informacion del producto, la transforma a JavaScript y
  //ejecuta la funcion showProductInfo
  getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      productInfo = resultObj.data;
      showProductInfo();
    }
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
        arrayProduct = resultObj.data;
        showRelated();
      }
    });
  });

  //Esta funcion tra la informacion de los comentarios.
  //y ejecuta showComments.
  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      comments = resultObj.data;
      showComments();
    }
  });
});

//Funcion que muestra la info del producto en el HTML.
function showProductInfo() {
  //Variable que carga las imagenes en un carousel.
  showCarousel = ` 
  <div id="carouselExampleIndicators" class="carousel slide pb-5 " data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
    </ol>
    <div class="carousel-inner ">
      <div class="carousel-item active">
        <img class=" w-100" src="${productInfo.images[1]}" alt="First slide">
      </div>
      <div class="carousel-item">
        <img class=" w-100" src="${productInfo.images[2]}" alt="Second slide">
      </div>
      <div class="carousel-item">
        <img class=" w-100" src="${productInfo.images[3]}" alt="Third slide">
      </div>
      <div class="carousel-item">
        <img class=" w-100" src="${productInfo.images[4]}" alt="Third slide">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
    `;

  //Variable que carga nombre y descripcion.
  showNameInfo = ` 
    <div class="mt-5 container">
      <div class="card " >
        <div class="card-header" > ${productInfo.name} </div>
        <div class="card-body">
          <h5 class="card-title"> ${productInfo.currency} : ${productInfo.cost}</h5>
          <p class="card-text"> Articulos vendidos: ${productInfo.soldCount}</p>
          <a href="#moreInfo" class="btn btn-primary">Comprar ahora</a> 
          <a href="#comments" class="btn btn-info">Ver comentarios</a> </br>
        </div>
      </div>
  </div>

    `;

  showMoreInfo = `
    <div class=" bg-light mb-5">
      <div class="card " >
        <div class="card-header text-center" > ${productInfo.name} </div>
        <div class="card-body" >
          <p class="card-title"> ${productInfo.description}</p>
        </div>
      </div>
    </div>`;

  document.getElementById("carousel").innerHTML = showCarousel;
  document.getElementById("info").innerHTML = showNameInfo;
  document.getElementById("moreInfo").innerHTML = showMoreInfo;

  document.getElementById("titleProduct").innerHTML = productInfo.name;
}

//Funcion que muesta los comentarios.
function showComments() {
  let commentsActive = "";

  for (let i = 0; i < comments.length; i++) {
    comment = comments[i];
    start = "";
    startOff = "";
    for (let i = 0; i < comment.score; i++) {
      start += `
      <span class="fa fa-star checked"></span>
      `;
    }
    if (comment.score < 5) {
      for (let i = comment.score; i < 5; i++)
        startOff += `
      <span class="fa fa-star"></span>`;
    }
    commentsActive += `
    <div class="card p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div class="user d-flex flex-row align-items-center"> <span><small
                      class="font-weight-bold text-primary">
                       ${comment.user}  
                       ${start}
                       ${startOff}
                        </small> </br> <small class="font-weight-bold">
                      ${comment.description} </small></span> </div> <small> ${comment.dateTime} </small>
              </div>
            </div>  
    `;
  }
  document.getElementById("comments").innerHTML = commentsActive;
}

//Funcion que muestro los comentarios agregados por el usuario.
function sendComments() {
  let comments = document.getElementById("sendComments").value;
  var aviso = document.getElementById("aviso");

  start = "";
  startOff = "";

  //If para verificar si no dejaron campos vacios.
  if (comments === "" || obtenerScore() === 0) {
    //activo el aviso que recuerda al usuario no dejar campos vacios.
    aviso.style.display = "block";
  } else {
    //si esta todo en orden se envia el comentario. Y oculto el aviso.
    aviso.style.display = "none";

    for (let i = 0; i < obtenerScore(); i++) {
      start += `
    <span class="fa fa-star checked"></span>
    `;
    }
    if (obtenerScore() < 5) {
      for (let i = obtenerScore(); i < 5; i++)
        startOff += `
    <span class="fa fa-star"></span>`;
    }

    commentsActive = [];

    commentsActive += `
  <div class="card p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="user d-flex flex-row align-items-center"> <span><small
                    class="font-weight-bold text-primary">
                      ${localStorage.getItem("userLocal")} 
                     ${start}
                     ${startOff}
                      </small> </br> <small class="font-weight-bold">
                    ${comments}</small></span> </div> <small> ${obtenerFechaActual()} </small>
            </div>
          </div>  
  `;

    document.getElementById("comments").innerHTML += commentsActive;
  }
}

//Funcion para obtener la fecha actual en formato adecuado.
function obtenerFechaActual() {
  let date = new Date();
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear().toString().padStart(2, "0");
  var hour = date.getHours().toString().padStart(2, "0");
  var minutes = date.getMinutes().toString().padStart(2, "0");
  var seconds = date.getSeconds().toString().padStart(2, "0");
  //se le da el formato deseado
  var dateTime = `${year}-${month}-${day} ${hour}:${minutes}:${seconds} `;
  return dateTime;
}

//Funcion para obtener la cantidad de estrellas de la calificacion.
function obtenerScore() {
  var estrella1 = document.getElementById("radio5");
  var estrella2 = document.getElementById("radio4");
  var estrella3 = document.getElementById("radio3");
  var estrella4 = document.getElementById("radio2");
  var estrella5 = document.getElementById("radio1");
  var score = 0;
  if (estrella5.checked) score = 5;
  else if (estrella4.checked) score = 4;
  else if (estrella3.checked) score = 3;
  else if (estrella2.checked) score = 2;
  else if (estrella1.checked) score = 1;

  return score;
}

function showRelated() {
  const related = productInfo.relatedProducts;
  let htmlContentToAppend = `<div class="col-md-2"></div>`;
  for (let i = 0; i < related.length; i++) {
    htmlContentToAppend += `<div class="card m-3" style="width: 18rem;">
    <img src=${arrayProduct[related[i]].imgSrc} class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">${arrayProduct[related[i]].name}</h5>
      <p class="card-text">${arrayProduct[related[i]].description}</p>
    </div>
  </div>`;
  }

  document.getElementById("related").innerHTML = htmlContentToAppend;
}
