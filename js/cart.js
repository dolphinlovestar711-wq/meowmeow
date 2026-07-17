document.querySelectorAll(".btnstyle").forEach(function (button) {
  button.addEventListener("click", function (e) {
    // 阻止 <a> 標籤的預設跳轉／回頁首行為
    e.preventDefault();

    alert("您已將商品加入購物車");
  }, false);
});
