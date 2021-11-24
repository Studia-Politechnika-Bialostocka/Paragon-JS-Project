rerender_page();
function rerender_page() {
  clear_inputs();
  let products = fetch_products_from_local_storage();
  render_products_in_receipeTable(products);
  render_receipe_total_to_cell(products);
  add_events_listeners_for_changing_position_in_table();
}

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
      `<tr draggable="true" class="draggable"> 
        <td class="lp">${lp}</td> 
        <td>${product.nazwa}</td> 
        <td>${product.ilosc}</td> 
        <td>${product.cena} zł</td> 
        <td>${(product.ilosc * product.cena).toFixed(2)} zł</td> 
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

function render_receipe_total_to_cell(products) {
  let receipe_total = 0;
  products.forEach((product) => {
    receipe_total += product.ilosc * product.cena;
  });

  var th = document.querySelector("#receipeTotal");
  th.innerHTML = `${receipe_total.toFixed(2)} zł`;
}

function delete_all_h3_from_form() {
  document.querySelectorAll("#addProductToReceipe h3").forEach((h3) => {
    h3.remove();
  });
}

function insert_data_to_form(lp) {
  let products = fetch_products_from_local_storage();
  let product = products[lp - 1];
  document.querySelector("#addProductToReceipe input[name='nazwa']").value =
    product.nazwa;
  document.querySelector("#addProductToReceipe input[name='ilosc']").value =
    product.ilosc;
  document.querySelector("#addProductToReceipe input[name='cena']").value =
    product.cena;
  document.querySelector("form input[type=submit]").value = "Zmień";
  document.querySelector("form").onsubmit = function () {
    update_product(lp);
    rerender_page();
    return false;
  };
}

function change_title_of_form(lp) {
  delete_all_h3_from_form();
  form = document.querySelector("#addProductToReceipe");
  form.insertAdjacentHTML("afterbegin", `<h3>Edytuj produkt LP: ${lp}</h3>`);
}

function clear_inputs() {
  delete_all_h3_from_form();
  document.querySelector("form input[type=submit]").value = "Dodaj";
  document.querySelector("form").reset();
}

function edit_product(lp) {
  change_title_of_form(lp);
  insert_data_to_form(lp);
  console.info("Product edited");
}

function update_product(lp) {
  let products = fetch_products_from_local_storage();
  let product = parse_product_from_form();
  products[lp - 1] = product;
  localStorage.removeItem("products");
  localStorage.setItem("products", JSON.stringify(products));
  console.info("Product updated");
  display_success_popup("Successfully updated product 😀");
}

function create_product() {
  let product = parse_product_from_form();
  let products = fetch_products_from_local_storage();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
  rerender_page();
  display_success_popup("Successfully created product 🚀");
}

function delete_product(lp) {
  let product_index = lp - 1;
  let products = fetch_products_from_local_storage();
  products.splice(product_index, 1);
  localStorage.removeItem("products");
  localStorage.setItem("products", JSON.stringify(products));
  rerender_page();
  display_success_popup("Successfully deleted product 🗑️");
}

function change_position_of_products_in_local_storage() {
  let products = fetch_products_from_local_storage();
  let products_lp = parse_products_lp_from_table();
  products = products_lp.map((lp) => products[lp - 1]);
  localStorage.removeItem("products");
  localStorage.setItem("products", JSON.stringify(products));
}

function parse_products_lp_from_table() {
  let products = [];
  let tbody = document.querySelector("tbody");
  let trs = tbody.querySelectorAll("tr");
  trs.forEach((tr) => {
    let lp = tr.querySelector("td.lp");
    products.push(parseInt(lp.innerHTML));
  });
  return products;
}

function parse_product_from_form() {
  let product = {};
  let form = document.querySelector("#addProductToReceipe form");
  let inputs = form.querySelectorAll("input[type=text], input[type=number]");
  inputs.forEach((input) => {
    product[input.name] = input.value;
  });
  return product;
}

function add_events_listeners_for_changing_position_in_table() {
  const draggables = document.querySelectorAll(".draggable");
  const container = document.querySelector("tbody");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      change_position_of_products_in_local_storage();
      rerender_page();
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

function display_success_popup(message) {
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", `<div id="popup"></div>`);
  let popup = document.querySelector("#popup");
  popup.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
  setTimeout(() => {
    popup.remove();
  }, 5000);
}
