var cartStorageKey = "petParadiseCart";
var cartCount = document.getElementById("cart-count");

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

function updateCartCount() {
  var itemCount = getCart().reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  if (cartCount) {
    cartCount.textContent = itemCount;
    cartCount.setAttribute("aria-label", "購物車內有 " + itemCount + " 件商品");
  }
}

function addProductToCart(product) {
  var cart = getCart();
  var existingItem = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

document.querySelectorAll(".btnstyle").forEach(function (button) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    button.classList.remove("is-adding");
    void button.offsetWidth;
    button.classList.add("is-adding");

    var productCard = button.closest(".product-card");
    var productName = productCard.querySelector(".card-title").textContent.trim();
    var priceText = productCard.querySelector(".price").textContent;
    var price = Number(priceText.replace(/[^0-9.]/g, ""));
    var productId = button.dataset.itemId;

    addProductToCart({
      id: productId,
      name: productName,
      price: price,
      category: "寵物用品"
    });

    if (typeof gtag === "function") {
      gtag("event", "add_to_cart", {
        currency: "TWD",
        value: price,
        items: [{
          item_id: productId,
          item_name: productName,
          item_category: "寵物用品",
          price: price,
          quantity: 1
        }]
      });
    }

    window.setTimeout(function () {
      button.classList.remove("is-adding");
      alert("您已將商品加入購物車，可至「示範結帳」完成付款。");
    }, 750);
  }, false);
});

updateCartCount();
