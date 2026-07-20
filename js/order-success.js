(function () {
  var order = JSON.parse(sessionStorage.getItem("petParadiseCompletedOrder") || "null");
  var transactionIdElement = document.getElementById("transaction-id");

  if (!order) {
    document.querySelector(".success-card p").textContent = "找不到訂單資料，請先完成示範結帳。";
    return;
  }

  transactionIdElement.textContent = order.transaction_id;

  if (sessionStorage.getItem("petParadisePurchaseSent") !== order.transaction_id && typeof gtag === "function") {
    gtag("event", "purchase", order);
    sessionStorage.setItem("petParadisePurchaseSent", order.transaction_id);
  }
}());
