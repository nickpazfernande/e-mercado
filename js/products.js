//Declaro variables globales.
const ORDER_ASC_BY_name = "AZ";
const ORDER_DESC_BY_name = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
const ORDER_ASC_BY_PRECIO = "Menor-Mayor";
const ORDER_DESC_BY_PRECIO = "Mayor-Menor";
const ORDER_BY_relevancia = "masVendidos";
var arrayProduct = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
const busqueda = document.querySelector("#search");

//Funcion que ordena el array, con su correspondiente filtro.
function sortProduct(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_name) {
    result = array.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_name) {
    result = array.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_ASC_BY_PRECIO) {
    //*Cuando el criterio es por precio, de Menor a Mayor.
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_PRECIO) {
    //* Cuando el criterio es por precio, de mayor a menor.
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_relevancia) {
    result = array.sort(function (a, b) {
      if (a.soldCount > b.soldCount) {
        return -1;
      }
      if (a.soldCount < b.soldCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

//Function final que carga el contenedor en el HTML
function showProductList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < arrayProduct.length; i++) {
    let product = arrayProduct[i];

    if (
      (minCount == undefined ||
        (minCount != undefined && parseInt(product.cost) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(product.cost) <= maxCount))
    ) {
      htmlContentToAppend +=
        `<div class="col-md-4">
        <a href="categories.html" class="card mb-4 shadow-sm custom-card">
          <img class="bd-placeholder-img card-img-top" src="${product.imgSrc}">
          <h3 class="m-3 text-center">${product.name}</h3>
          <small class="text-secondary ml-auto mr-2" > Productos vendido: ${product.soldCount} </small>
          <p class=" ml-auto mr-2"> ${product.currency} ${product.cost} </p> 
          <div class="card-body">
            <p class="card-text">
            ${product.description}
            </p>
          </div>
        </a>
      </div>
            `;
    }

    document.getElementById("cat-list-container").innerHTML =
      htmlContentToAppend;
  }
}

//Function que llena el array y llama a otra funcion para que lo ordene con el criterio correspondiente.
function sortAndShowProduct(sortCriteria, productArray) {
  currentSortCriteria = sortCriteria;

  if (productArray != undefined) {
    arrayProduct = productArray;
  }

  arrayProduct = sortProduct(currentSortCriteria, arrayProduct);

  //Muestro las categorías ordenadas
  showProductList();
}

//function que se ejecuta al cargar la pagina.
//Se encarga de obtener los datos, tanto del json como de los filtros para listar los productos.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      sortAndShowProduct(ORDER_ASC_BY_name, resultObj.data);
    }
  });

  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProduct(ORDER_ASC_BY_name);
  });

  document.getElementById("MayorPrecio").addEventListener("click", function () {
    sortAndShowProduct(ORDER_DESC_BY_PRECIO);
  });
  document.getElementById("MenorPrecio").addEventListener("click", function () {
    sortAndShowProduct(ORDER_ASC_BY_PRECIO);
  });

  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProduct(ORDER_DESC_BY_name);
  });

  document.getElementById("sortByCount").addEventListener("click", function () {
    sortAndShowProduct(ORDER_BY_PROD_COUNT);
  });

  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";

      minCount = undefined;
      maxCount = undefined;

      showProductList();
    });

  document
    .getElementById("rangeFilterCount")
    .addEventListener("click", function () {
      //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
      //de productos por categoría.
      minCount = document.getElementById("rangeFilterCountMin").value;
      maxCount = document.getElementById("rangeFilterCountMax").value;

      if (minCount != undefined && minCount != "" && parseInt(minCount) >= 0) {
        minCount = parseInt(minCount);
      } else {
        minCount = undefined;
      }

      if (maxCount != undefined && maxCount != "" && parseInt(maxCount) >= 0) {
        maxCount = parseInt(maxCount);
      } else {
        maxCount = undefined;
      }

      showProductList();
    });
});

function mostrarFiltros() {
  var x = document.getElementById("filtros");
  if (window.getComputedStyle(x).display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//Evento que con cada tecla pulsada en #search, ejecuta la funcion searchGo
search.addEventListener("keyup", searchGo);

//Funcion que filtra por el nombre de los productos, actualizando el div cat-list-container
function searchGo() {
  let resultadoSearch = "";
  const texto = busqueda.value.toLowerCase();

  //for recorre el array de productos, y va comparando el texto del input con el nombre de los productos
  //en caso de coincidencia se agrega a la variable resultadoSearch que al final se ingresa de forma dinamica al div.
  for (let product of arrayProduct) {
    let nombre = product.name.toLowerCase();

    //indexOff es la funcion para verificar coincidencias. si no devuelve -1 es porque coincide.
    if (nombre.indexOf(texto) !== -1) {
      resultadoSearch +=
        `
           <a href="product-info.html" class="list-group-item list-group-item-action">
               <div class="row">
                   <div class="col-3">
                       <img src="` +
        product.imgSrc +
        `" alt="` +
        product.description +
        `" class="img-thumbnail">
                   </div>
                   <div class="col"> 
                       <div class="d-flex w-100 justify-content-between">
                           <h4 class="mb-1">` +
        product.name +
        `</h4>
                           <small class="text-muted">` +
        product.soldCount +
        ` artículos vendidos.</small>
                       </div>
                       <p class="mb-1">` +
        product.description +
        `</p>
                       <p class="mb-1" style="font-weight: bold; color: red">` +
        product.currency +
        `: ` +
        product.cost +
        `</p>
                   </div>
               </div>
           </a>
           `;
      document.getElementById("cat-list-container").innerHTML = resultadoSearch;
    }

    //De no encontrar resultados, ingresa un div avisando de la situacion.
    if (resultadoSearch === "") {
      document.getElementById("cat-list-container").innerHTML = `
            <div class="list-group-item list-group-item-action mb-3">
                <div class="row">
                    <label> Producto no encontrado. </label>
                </div>
            <div>
            `;
    }
  }
}
