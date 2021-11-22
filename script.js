function fetch_products_from_local_storage() {
  var products = [];
  var products_string = localStorage.getItem("products");
  if (products_string) {
    products = JSON.parse(products_string);
  }
  return products;
}

product = {
  id: 1,
  name: "chleb",
  amount: "1",
};

add_new_product_to_local_storage = function (product) {
  var products = fetch_products_from_local_storage();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
};

console.log(fetch_products_from_local_storage());

function create_product() {
  console.log(
    document.querySelectorAll('#addProductToReceipe form input[type="text"]')
  );
}

function clear_text_inputs() {
  document
    .querySelectorAll('#addProductToReceipe form input[type="text"]')
    .forEach(function (input) {
      input.value = "";
    });
}
