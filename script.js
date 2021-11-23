function main() {
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
  tbody.innerHTML = "";
  products.forEach((product) => {
    lp += 1;
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr> 
        <td>${lp}</td> 
        <td>${product.nazwa}</td> 
        <td>${product.ilosc}</td> 
        <td>${product.cena} zł</td> 
        <td>${product.ilosc * product.cena} zł</td> 
        <td>
        <button class="delete-product" onclick=delete_product(${lp}) title="Usuń produkt">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="edit-product" onclick=edit_product(${lp}) title="Edytuj produkt">
          <i class="fas fa-edit"></i>
        </button>
      </td>
      </tr>`
    );
  });
}

function delete_all_h3_from_form() {
  document.querySelectorAll("#addProductToReceipe h3").forEach((h3) => {
    h3.remove();
  });
}

function update_product(lp) {
  let products = fetch_products_from_local_storage();
  let product = parse_product_from_form();
  products[lp - 1] = product;
  localStorage.removeItem("products");
  localStorage.setItem("products", JSON.stringify(products));
  main();
  clear_text_inputs();
}

function update_form_with_product_value(lp) {
  let products = fetch_products_from_local_storage();
  let product = products[lp - 1];
  document.querySelector("#addProductToReceipe input[name='nazwa']").value =
    product.nazwa;
  document.querySelector("#addProductToReceipe input[name='ilosc']").value =
    product.ilosc;
  document.querySelector("#addProductToReceipe input[name='cena']").value =
    product.cena;
  document.querySelector("form").onsubmit = function () {
    update_product(lp);
    return false;
  };
  document.querySelector("form input[type=submit]").value = "Zmień";
}

function edit_product(lp) {
  delete_all_h3_from_form();
  form = document.querySelector("#addProductToReceipe");
  form.insertAdjacentHTML("afterbegin", `<h3>Edytuj produkt LP: ${lp}</h3>`);
  update_form_with_product_value(lp);
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
  delete_all_h3_from_form();
  document.querySelector("form input[type=submit]").value = "Dodaj";
  document.querySelector("form").reset();
}

// todo: add popup with information about adding new product to receipe and delete product from receipe
