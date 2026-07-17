var cartStorageKey = "petParadiseCart";
var cartItems = document.getElementById("cart-items");
var cartTotal = document.getElementById("cart-total");
var cartSummary = document.getElementById("cart-summary");
var emptyCart = document.getElementById("empty-cart");
var clearCartButton = document.getElementById("clear-cart");

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function formatPrice(value) {
  return "NT$ " + value.toLocaleString("zh-TW");
}

function renderCart() {
  var cart = getCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.hidden = false;
    cartSummary.hidden = true;
    clearCartButton.hidden = true;
    return;
  }

  emptyCart.hidden = true;
  cartSummary.hidden = false;
  clearCartButton.hidden = false;

  var total = 0;

  cart.forEach(function (item, index) {
    var subtotal = item.price * item.quantity;
    total += subtotal;

    var row = document.createElement("tr");
    row.innerHTML =
      "<td data-label=\"序號\">" + (index + 1) + "</td>" +
      "<td data-label=\"商品項目\" class=\"cart-product-name\">" + item.name + "</td>" +
      "<td data-label=\"單價\">" + formatPrice(item.price) + "</td>" +
      "<td data-label=\"數量\"><span class=\"quantity-badge\">" + item.quantity + "</span></td>" +
      "<td data-label=\"小計\" class=\"cart-subtotal\">" + formatPrice(subtotal) + "</td>" +
      "<td><button class=\"remove-cart-item\" type=\"button\" data-item-id=\"" + item.id + "\" aria-label=\"移除 " + item.name + "\"><i class=\"bi bi-x-lg\"></i></button></td>";
    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);
}

cartItems.addEventListener("click", function (event) {
  var removeButton = event.target.closest(".remove-cart-item");

  if (!removeButton) {
    return;
  }

  var updatedCart = getCart().filter(function (item) {
    return item.id !== removeButton.dataset.itemId;
  });

  saveCart(updatedCart);
  renderCart();
});

clearCartButton.addEventListener("click", function () {
  if (window.confirm("確定要清空購物車嗎？")) {
    localStorage.removeItem(cartStorageKey);
    renderCart();
  }
});

renderCart();
