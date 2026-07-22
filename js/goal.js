(function () {
  var measurementId = "G-47TN8S91ZG";
  var completedOrderKey = "petParadiseCompletedOrder";
  var trackedOrderKey = "petParadiseTrackedPurchase";
  var storedOrder = sessionStorage.getItem(completedOrderKey);

  if (!storedOrder || typeof gtag !== "function") {
    return;
  }

  try {
    var order = JSON.parse(storedOrder);

    if (
      !order.transaction_id ||
      !Array.isArray(order.items) ||
      order.items.length === 0 ||
      sessionStorage.getItem(trackedOrderKey) === order.transaction_id
    ) {
      return;
    }

    order.send_to = measurementId;
    order.debug_mode = true;
    order.event_timeout = 3000;
    order.event_callback = function () {
      sessionStorage.setItem(trackedOrderKey, order.transaction_id);
      sessionStorage.removeItem(completedOrderKey);
    };

    gtag("event", "purchase", order);
  } catch (error) {
    console.error("無法送出 GA4 purchase 事件。", error);
  }
}());
