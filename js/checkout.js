(function () {
  var cartItemsElement = document.getElementById("cart-items");
  var totalElement = document.getElementById("cart-total");
  var completeButton = document.getElementById("complete-order");
  var cart = JSON.parse(localStorage.getItem("petParadiseCart") || "[]");
  var total = cart.reduce(function (sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    cartItemsElement.innerHTML = "<p class=\"text-muted mb-0\">購物車目前沒有商品。</p>";
    completeButton.disabled = true;
    return;
  }

  cartItemsElement.innerHTML = cart.map(function (item) {
    return "<div class=\"cart-item d-flex justify-content-between\"><span>" + item.name + " × " + item.quantity + "</span><span>NT$ " + (item.price * item.quantity) + "</span></div>";
  }).join("");
  totalElement.textContent = "NT$ " + total;

  completeButton.addEventListener("click", function () {
    var order = {
      transaction_id: "DEMO-" + Date.now(),
      currency: "TWD",
      value: total,
      items: cart.map(function (item) {
        return {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        };
      })
    };

    sessionStorage.setItem("petParadiseCompletedOrder", JSON.stringify(order));
    localStorage.removeItem("petParadiseCart");
    window.location.href = "order-success.html";
  });
}());
