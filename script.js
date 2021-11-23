function main() {
  document.querySelector("tbody").innerHTML = "";

  let products = fetch_products_from_local_storage();
  render_products_in_receipeTable(products);
  render_receipe_total(products);
}
main();

function fetch_products_from_local_storage() {
  var products = [];
  var products_string = localStorage.getItem("products");
  if (products_string) {
    products = JSON.parse(products_string);
  }
  return products;
}

function render_products_in_receipeTable(products) {
  let lp = 0;
  var tbody = document.querySelector("tbody");
  products.forEach((product) => {
    lp += 1;
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr> 
        <td>${lp}</td> 
        <td>${product.nazwa}</td> 
        <td>${product.ilosc}</td> 
        <td>${product.cena}</td> 
        <td>${product.ilosc * product.cena}</td> 
        <td>
        <button class="delete-product" onclick="delete_product(${lp})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
      </tr>`
    );
  });
}

function delete_product(lp) {
  let index_to_del = lp - 1;
  let products = fetch_products_from_local_storage();
  localStorage.removeItem("products");
  products.splice(index_to_del, 1);
  localStorage.setItem("products", JSON.stringify(products));
  main();
}

function render_receipe_total(products) {
  let receipe_total = 0;
  products.forEach((product) => {
    receipe_total += product.ilosc * product.cena;
  });

  var th = document.querySelector("#receipeTotal");
  th.innerHTML = `${receipe_total} zł`;
}

add_new_product_to_local_storage = function (product) {
  var products = fetch_products_from_local_storage();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
};

function create_product() {
  product = parse_product_from_form();
  add_new_product_to_local_storage(product);
  clear_text_inputs();
  main();
}

function parse_product_from_form() {
  var product = {};
  var form = document.querySelector("#addProductToReceipe form");
  var inputs = form.querySelectorAll("input[type=text], input[type=number]");
  inputs.forEach(function (input) {
    product[input.name] = input.value;
  });
  return product;
}

function clear_text_inputs() {
  document
    .querySelectorAll('#addProductToReceipe form input[type="text"]')
    .forEach(function (input) {
      input.value = "";
    });
}
