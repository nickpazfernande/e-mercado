//Variables locales
let USD = 0;
let carrito = [];
let currencyActive = "UYU ";
let costoEnvio = 0.13;
let finaly = 0;

//Funcion que se ejecuta al cargar la pagina.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      //Guardo la informacion en carrito[] y ejecuto la funcion para mostrarlo en pantalla.
      carrito = resultObj.data;
      showCart();
    }
  });
});

//Funcion para cuando cambian los input, recargar los valores de subtotal.
function subTotalCost(id) {
  let subTotal = currency(id, document.getElementById(id).value);
  document.getElementById("subtotal" + id).innerHTML = subTotal;
  calcularTotal();
}

//Funcion para cargar el carrito en la tabla.
function showCart() {
  let html = "";
  let total = 0;
  finaly = 0;
  //For que recorre el array.
  for (let i = 0; i < carrito.articles.length; i++) {
    total = currency(i, carrito.articles[i].count);
    //finaly es el subtotal de cada producto.
    finaly = finaly + parseInt(total);
    //Variable a cargar en la tabla del carrito
    html += `<tr>
      <th scope="row">${i + 1}</th>
          <td>${carrito.articles[i].name}</td>
          <td class="ocultarTabla">
             <img class="img-fluid h-75 w-75 ocultarTabla" src="${
               carrito.articles[i].src
             }" alt="" />
          </td>
          <td> <input type="number" min ="1" id="${i}" onchange="subTotalCost(${i})" value=${
      carrito.articles[i].count
    }> </td>
          <td>${carrito.articles[i].currency} ${
      carrito.articles[i].unitCost
    }</td>
          <td id="subtotal${i}"> ${total}</td>
      </tr>`;
  }

  //Mostrar total final.
  let totalfinaly = finaly + finaly * costoEnvio;
  //Varias cargas a sus respectivos lugares en el HTML.
  document.getElementById("tableCart").innerHTML = html;
  document.getElementById("finally").innerHTML += finaly;
  document.getElementById("totalFinally").innerHTML += totalfinaly;
  document.getElementById("opcionCuotas").innerHTML =
    "O hasta en 6 pagos de: " + currencyActive + parseInt(finaly / 6);
}

//Funcion para cambiar los valores iniciales a pesos Uruguayos.
//Para trabajar con una moneda en comun en los subtotales.
function currency(id, cont) {
  //Si la moneda es dolar, el valor unitCost lo multiplico por 40 y lo retorno.
  //Si es pesos uruguayos retorno el subtotal.
  if (carrito.articles[id].currency == "USD") {
    return (total = carrito.articles[id].unitCost * 40 * cont);
  } else {
    return (total = carrito.articles[id].unitCost * cont);
  }
}

//Calcular total final de la compra.
function calcularTotal() {
  total = 0;
  //Recorro los subtotales del html, los sumo para luego mostrarlos en pantalla.
  for (let i = 0; i < carrito.articles.length; i++) {
    total += parseInt(document.getElementById("subtotal" + i).textContent);
  }

  finaly = total;

  //Cargas varias al HTML
  document.getElementById("finally").innerHTML = total;
  document.getElementById("totalFinally").innerHTML =
    total + total * costoEnvio;
  document.getElementById("opcionCuotas").innerHTML =
    "O hasta en 6 pagos de: " + currencyActive + parseInt(total / 6);
}

function changeCurrency() {
  console.log(document.getElementById("inputCurrency").value);
  let currencyInPage = document.getElementById("inputCurrency").value;
  if ((currencyInPage = "UYU ")) {
    let total = document.getElementById("totalFinally").textContent;

    if (currencyActive != "UYU ") {
      //Si la moneda de la pagina esta en dolares, cambiamos a UYU.
      finaly = total * 40;
      document.getElementById("totalFinally").innerHTML = finaly;
      currencyActive = "UYU ";
      document.getElementById("opcionCuotas").innerHTML =
        "O hasta en 6 pagos de: " + currencyActive + parseInt((total * 40) / 6);
    } else {
      // Cambiamos a dolares.

      finaly = total / 40;
      document.getElementById("totalFinally").innerHTML = Math.round(finaly);
      currencyActive = "USD ";
      document.getElementById("opcionCuotas").innerHTML =
        "O hasta en 6 pagos de: " + currencyActive + parseInt(total / 40 / 6);
    }
  }
}

function changeCostoEnvio() {
  let costoEnvioInPage = document.getElementById("costoEnvio").value;
  console.log(costoEnvioInPage);
  let porcentaje = 0;
  if (costoEnvioInPage == 1) {
    costoEnvio = 0.05;
    porcentaje = "$5%";
  }
  if (costoEnvioInPage == 2) {
    costoEnvio = 0.07;
    porcentaje = "$7%";
  }
  if (costoEnvioInPage == 3) {
    costoEnvio = 0.15;
    porcentaje = "$15%";
  }
  document.getElementById("costoEnvioTd").innerHTML = porcentaje;

  calcularTotal();
}

//Funcion que verifica los campos de direccion
//Dependiendo de donde se la llame termina la compra.
function confirmarCompra(evt, num) {
  evt.preventDefault();
  let calle = document.getElementById("inputCalle").value;
  let numero = document.getElementById("numeroDir").value;
  let ciudad = document.getElementById("inputCiudad").value;
  let check = document.getElementById("checkPoliticas").checked;

  //Si acepta la politica se avanza.
  if (check) {
    if (calle == "" || numero == "" || ciudad == "") {
      //Si alguno de los campos queda vacio se notifica al usuario.
      document.getElementById("mensajeModal").className =
        "text-secondary text-danger mr-3 ";
      document.getElementById("mensajeModal").innerHTML =
        "*Algunos campos han quedado vacios.";
    } else {
      
      //Si solo se tiene que verificar esto se realiza la compra.
      //De lo contrario no se muestra nada, ya que aun se debe de verificar la tarjeta.
      if (num == 1) {
        document.getElementById("mensajeModal").className =
          "text-secondary text-success mr-3 ";
        document.getElementById("mensajeModal").innerHTML =
          "*Compra realizada con exito.";
        //Se muestra el mensaje de compra exitosa y a los 3 segundos se redirige al home.
        setTimeout(function () {
          window.location.replace("home.html");
        }, 2000);
        
      }
      return "ok";
    }
  } else {
    //de lo contrario se muestra un mensaje
    document.getElementById("mensajeModal").className =
      "text-secondary text-danger mr-3 ";
    document.getElementById("mensajeModal").innerHTML =
      "*No ha aceptado las políticas de seguridad.";
  }
}

//Funcion que se encarga de llamar a la funcion que verifica los campos de direccion
//Y luego verifica los campos de la tarjeta y realiza la compra de estar todo ok. 
function confirmarCompraTarjeta(evt) {
  //Confirmo los primeros campos.
  let confirmation = confirmarCompra(evt, 2);
  //Guardo los campos de tarjeta,
  let ccv = document.getElementById("cc-cvv").value;
  let expiration = document.getElementById("cc-expiration").value;
  let numeroTarjeta = document.getElementById("cc-number").value;
  let nombre = document.getElementById("cc-name").value;
  if (confirmation == "ok") {
    //Realizo la verificacion de los mismos.
    if (ccv == "" || expiration == "" || numeroTarjeta == "" || nombre == "") {
      //Si alguno de los campos queda vacio se notifica al usuario.
      document.getElementById("mensajeModal").className =
        "text-secondary text-danger mr-3 ";
      document.getElementById("mensajeModal").innerHTML =
        "*Algunos campos han quedado vacios.";
    } else {
      //Si esta todo correcto se realiza la compra.
      document.getElementById("mensajeModal").className =
        "text-secondary text-success mr-3 ";
      document.getElementById("mensajeModal").innerHTML =
        "*Compra realizada con exito.";
      //Se muestra el mensaje de compra exitosa y a los 3 segundos se redirige al home.
      setTimeout(function () {
        window.location.replace("home.html");
      }, 2000);
    }
  }
}
