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

(function () {
  var confettiContainer = document.getElementById("goal-confetti");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var colors = ["#ff5d8f", "#ff9f43", "#ffd166", "#06d6a0", "#44b3ff", "#7c5cff", "#c77dff"];
  var pieceCount = 72;

  if (!confettiContainer || reduceMotion) {
    return;
  }

  for (var index = 0; index < pieceCount; index += 1) {
    var piece = document.createElement("span");
    var width = 6 + Math.floor(Math.random() * 7);
    var height = 10 + Math.floor(Math.random() * 12);
    var drift = -18 + Math.floor(Math.random() * 37);
    var duration = 4.8 + Math.random() * 4.5;

    piece.className = "goal-confetti-piece";
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.setProperty("--left", Math.random() * 100 + "%");
    piece.style.setProperty("--width", width + "px");
    piece.style.setProperty("--height", height + "px");
    piece.style.setProperty("--radius", index % 3 === 0 ? "50%" : "2px");
    piece.style.setProperty("--drift", drift + "vw");
    piece.style.setProperty("--duration", duration + "s");
    piece.style.setProperty("--delay", -Math.random() * duration + "s");
    piece.style.setProperty("--spin", (360 + Math.floor(Math.random() * 720)) + "deg");
    confettiContainer.appendChild(piece);
  }
}());
