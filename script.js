function fetch_products_from_local_storage() {
  var products = [];
  var products_string = localStorage.getItem("products");
  if (products_string) {
    products = JSON.parse(products_string);
  }
  return products;
}

add_new_product_to_local_storage = function(product) {
    var products = fetch_products_from_local_storage();
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
}

console.log(fetch_products_from_local_storage());