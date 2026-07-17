const productImages = document.querySelectorAll(".product-card > img");
const lightbox = document.getElementById("product-lightbox");
const lightboxDialog = lightbox.querySelector(".product-lightbox-dialog");
const lightboxTitle = document.getElementById("product-lightbox-title");
const lightboxStage = document.getElementById("product-lightbox-stage");
const lightboxImage = document.getElementById("product-lightbox-image");
const closeButton = document.getElementById("product-lightbox-close");
let lastFocusedElement;

function resetZoom() {
  lightboxStage.classList.remove("is-zoomed");
  lightboxImage.style.transformOrigin = "center";
}

function openLightbox(image) {
  const productName = image.closest(".product-card").querySelector(".card-title").textContent.trim();
  lastFocusedElement = image;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = productName + "商品放大圖";
  lightboxTitle.textContent = productName;
  resetZoom();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  resetZoom();
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

productImages.forEach((image) => {
  image.classList.add("product-zoom-image");
  image.setAttribute("role", "button");
  image.setAttribute("tabindex", "0");
  image.setAttribute("aria-label", "放大查看" + image.alt);

  image.addEventListener("click", () => {
    openLightbox(image);
  });

  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image);
    }
  });
});

lightboxStage.addEventListener("click", () => {
  lightboxStage.classList.toggle("is-zoomed");
});

lightboxStage.addEventListener("mousemove", (event) => {
  if (!lightboxStage.classList.contains("is-zoomed")) {
    return;
  }

  const bounds = lightboxStage.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  lightboxImage.style.transformOrigin = x + "% " + y + "%";
});

lightboxStage.addEventListener("mouseleave", () => {
  lightboxImage.style.transformOrigin = "center";
});

closeButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }

  if (event.key === "Tab" && !lightbox.hidden) {
    const focusableElements = lightboxDialog.querySelectorAll("button, [href], [tabindex]:not([tabindex=\"-1\"])");
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});
