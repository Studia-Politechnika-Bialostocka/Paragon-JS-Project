function fetch_products_from_local_storage() {
  var products = [];
  var products_string = localStorage.getItem("products");
  if (products_string) {
    products = JSON.parse(products_string);
  }
  return products;
}

add_new_product_to_local_storage = function (product) {
  var products = fetch_products_from_local_storage();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
};

function create_product() {
  product = parse_product_from_form();
  add_new_product_to_local_storage(product);
}

function parse_product_from_form() {
  var product = {};
  var form = document.querySelector("#addProductToReceipe form");
  var inputs = form.querySelectorAll("input[type=text]");
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
