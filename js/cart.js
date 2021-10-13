//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
let USD = 0;
let carrito = [];

document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CURRENCY_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      USD = (resultObj.data.rates.USD.sell + resultObj.data.rates.USD.buy) / 2;
      showCurrency();
    }
  });
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      console.log(resultObj.data);
    }
  });
});

function showCurrency() {
  console.log(USD);
  document.getElementById("usd").innerHTML = USD;
}
