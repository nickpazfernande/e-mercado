//Variables locales
let USD = 0;
let carrito = [];
let currencyActive = "UYU ";

//Funcion que se ejecuta al cargar la pagina.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      //Guardo la informacion en carrito[] y ejecuto la funcion para mostrarlo en pantalla.
      carrito = resultObj.data
      showCart();
    }
  });
});

//Funcion para cuando cambian los input, recargar los valores de subtotal.
function subTotalCost (id) {
  let subTotal =  currency(id, document.getElementById(id).value)
  document.getElementById("subtotal" + id).innerHTML = subTotal;
  calcularTotal();
}

//Funcion para cargar el carrito en la tabla.
function showCart () {
  let html="";
  let total=0;
  let finaly=0;
  //For que recorre el array. 
  for (let i = 0; i < carrito.articles.length; i++) {
    total = currency(i, carrito.articles[i].count)
    //finaly es el subtotal de cada producto. 
    finaly = finaly + parseInt(total);
    //Variable a cargar en la tabla del carrito
    html += `<tr>
      <th scope="row">${i+1}</th>
          <td>${carrito.articles[i].name}</td>
          <td class="ocultarTabla">
             <img class="img-fluid h-75 w-75 ocultarTabla" src="${carrito.articles[i].src}" alt="" />
          </td>
          <td> <input type="number" min ="1" id="${i}" onchange="subTotalCost(${i})" value=${carrito.articles[i].count}> </td>
          <td>${carrito.articles[i].currency} ${carrito.articles[i].unitCost}</td>
          <td id="subtotal${i}"> ${total}</td>
      </tr>`
  }
  //Mostrar total final. 
  let totalfinaly = finaly + (finaly * 0.15)
  //Varias cargas a sus respectivos lugares en el HTML.
  document.getElementById("tableCart").innerHTML = html;
  document.getElementById("finally").innerHTML += finaly;
  document.getElementById("totalFinally").innerHTML += totalfinaly;
  document.getElementById("opcionCuotas").innerHTML = "O hasta en 6 pagos de: "+ currencyActive + parseInt( finaly/6)
}

//Funcion para cambiar los valores iniciales a pesos Uruguayos.
//Para trabajar con una moneda en comun en los subtotales.
function currency (id, cont){
  //Si la moneda es dolar, el valor unitCost lo multiplico por 40 y lo retorno.
  //Si es pesos uruguayos retorno el subtotal.
  if (carrito.articles[id].currency == "USD" ){
    return total = (carrito.articles[id].unitCost * 40) * cont ;
  } else {
    return total = carrito.articles[id].unitCost * cont;
  }
}

//Calcular total final de la compra. 
function calcularTotal(){
  total = 0;
  //Recorro los subtotales del html, los sumo para luego mostrarlos en pantalla.
  for (let i = 0; i  < carrito.articles.length; i++ ){
    total += parseInt(document.getElementById("subtotal" + i).textContent);
  }

  //Cargas varias al HTML
  document.getElementById("finally").innerHTML = currencyActive + total;
  document.getElementById("totalFinally").innerHTML = currencyActive + (total + (total * 0.15));
  document.getElementById("opcionCuotas").innerHTML = "O hasta en 6 pagos de: "+ currencyActive + parseInt( total/6)

}

function changeCurrency (){

}