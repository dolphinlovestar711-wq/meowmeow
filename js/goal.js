(function () {
  var completedOrderKey = "petParadiseCompletedOrder";
  var trackedOrderKey = "petParadiseTrackedPurchase";
  var storedOrder = sessionStorage.getItem(completedOrderKey);

  if (!storedOrder || typeof gtag !== "function") {
    return;
  }

  try {
    var order = JSON.parse(storedOrder);

    if (!order.transaction_id || sessionStorage.getItem(trackedOrderKey) === order.transaction_id) {
      return;
    }

    gtag("event", "purchase", order);
    sessionStorage.setItem(trackedOrderKey, order.transaction_id);
  } catch (error) {
    console.error("無法送出 GA4 purchase 事件。", error);
  }
}());
