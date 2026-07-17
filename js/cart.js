document.querySelectorAll(".btnstyle").forEach(function (button) {
  button.addEventListener("click", function (e) {
    // 阻止 <a> 標籤的預設跳轉／回頁首行為
    e.preventDefault();
    button.classList.remove("is-adding");
    void button.offsetWidth;
    button.classList.add("is-adding");

    var productCard = button.closest(".product-card");
    var productName = productCard.querySelector(".card-title").textContent.trim();
    var priceText = productCard.querySelector(".price").textContent;
    var price = Number(priceText.replace(/[^0-9.]/g, ""));

    // 先傳送 GA4 電商「加入購物車」事件。
    if (typeof gtag === "function") {
      gtag("event", "add_to_cart", {
        currency: "TWD",
        value: price,
        items: [{
          item_id: button.dataset.itemId,
          item_name: productName,
          price: price,
          quantity: 1
        }]
      });
    }

    window.setTimeout(function () {
      button.classList.remove("is-adding");
      alert("您已將商品加入購物車");
    }, 750);
  }, false);
});
