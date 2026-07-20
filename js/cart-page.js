var cartStorageKey = "petParadiseCart";
var purchaseHistoryKey = "petParadisePurchaseHistory";
var cartItems = document.getElementById("cart-items");
var cartTotal = document.getElementById("cart-total");
var cartSummary = document.getElementById("cart-summary");
var emptyCart = document.getElementById("empty-cart");
var clearCartButton = document.getElementById("clear-cart");
var checkoutButton = document.getElementById("checkout-button");
var historyItems = document.getElementById("history-items");
var emptyHistory = document.getElementById("empty-history");
var clearHistoryButton = document.getElementById("clear-history");
var historySearchInput = document.getElementById("history-search-input");

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

function getPurchaseHistory() {
  try {
    return JSON.parse(localStorage.getItem(purchaseHistoryKey) || "[]");
  } catch (error) {
    return [];
  }
}

function savePurchaseHistory(history) {
  localStorage.setItem(purchaseHistoryKey, JSON.stringify(history));
}

function formatPrice(value) {
  return "NT$ " + value.toLocaleString("zh-TW");
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoDate));
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

function renderHistory(searchText) {
  var history = getPurchaseHistory();
  var keyword = (searchText || "").trim().toLowerCase();

  if (keyword) {
    history = history.filter(function (order) {
      var productNames = order.items.map(function (item) {
        return item.name;
      }).join(" ");
      var searchableText = [order.id, formatDate(order.purchasedAt), productNames].join(" ").toLowerCase();
      return searchableText.includes(keyword);
    });
  }

  historyItems.innerHTML = "";

  if (history.length === 0) {
    emptyHistory.hidden = false;
    emptyHistory.querySelector("p").textContent = keyword ? "找不到符合條件的購買紀錄。" : "目前沒有歷史購買紀錄。";
    clearHistoryButton.hidden = getPurchaseHistory().length === 0;
    return;
  }

  emptyHistory.hidden = true;
  clearHistoryButton.hidden = false;

  history.forEach(function (order) {
    var productDetails = order.items.map(function (item) {
      return item.name + " × " + item.quantity;
    }).join("、");
    var row = document.createElement("tr");
    row.innerHTML =
      "<td data-label=\"訂單編號\" class=\"history-order-id\">" + order.id + "</td>" +
      "<td data-label=\"購買日期\">" + formatDate(order.purchasedAt) + "</td>" +
      "<td data-label=\"商品明細\" class=\"history-products\">" + productDetails + "</td>" +
      "<td data-label=\"總金額\" class=\"history-total\">" + formatPrice(order.total) + "</td>";
    historyItems.appendChild(row);
  });
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

checkoutButton.addEventListener("click", function () {
  var cart = getCart();

  if (cart.length === 0) {
    return;
  }

  var total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  if (!window.confirm("確認完成本次購買，總金額為 " + formatPrice(total) + "？")) {
    return;
  }

  var now = new Date();
  var transactionId = "PP" + now.getTime().toString().slice(-10);
  var history = getPurchaseHistory();

  sessionStorage.setItem("petParadiseCompletedOrder", JSON.stringify({
    transaction_id: transactionId,
    currency: "TWD",
    value: total,
    items: cart.map(function (item) {
      return {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || "寵物用品",
        price: item.price,
        quantity: item.quantity
      };
    })
  }));

  history.unshift({
    id: transactionId,
    purchasedAt: now.toISOString(),
    member: localStorage.getItem("petParadiseCurrentMember") || "訪客",
    items: cart,
    total: total
  });

  savePurchaseHistory(history);
  localStorage.removeItem(cartStorageKey);
  historySearchInput.value = "";
  renderCart();
  renderHistory();
  alert("購買完成，已加入歷史購買紀錄！");
  window.location.href = "goal.html";
});

historySearchInput.addEventListener("input", function () {
  renderHistory(historySearchInput.value);
});

clearHistoryButton.addEventListener("click", function () {
  if (window.confirm("確定要清除所有歷史購買紀錄嗎？")) {
    localStorage.removeItem(purchaseHistoryKey);
    historySearchInput.value = "";
    renderHistory();
  }
});

renderCart();
renderHistory();
