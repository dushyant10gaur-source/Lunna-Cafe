"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializeCategoryCards();
  initializeCategoryBreadcrumb();
  initializeCategoryImageFallbacks();
});

function initializeCategoryCards() {
  const cards = document.querySelectorAll(".category-menu-card");

  cards.forEach((card, index) => {
    card.style.setProperty("--card-delay", `${(index % 3) * 90}ms`);
  });
}

function initializeCategoryBreadcrumb() {
  const breadcrumb = document.querySelector(".category-breadcrumb");
  const currentPage = breadcrumb?.lastElementChild;

  if (currentPage) {
    currentPage.setAttribute("aria-current", "page");
  }
}

function initializeCategoryImageFallbacks() {
  const images = document.querySelectorAll(
    ".category-hero-image img, .category-hero-visual img, .category-menu-image img"
  );

  images.forEach((image) => {
    const container = image.parentElement;

    if (!container) return;

    function showFallback() {
      if (container.querySelector(".image-fallback-label")) return;

      const label = document.createElement("span");
      label.className = "image-fallback-label";
      label.textContent = "LUNNA CAFE";
      container.appendChild(label);
    }

    image.addEventListener("error", showFallback);

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });
}
