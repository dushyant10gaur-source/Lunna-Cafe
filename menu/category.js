javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializePreloader();
  initializeMobileNavigation();
  initializeScrollReveal();
  initializeMenuCards();
  initializeSmoothScrolling();
  initializeImageFallbacks();
});


/* =========================================
   1. LOADING SCREEN
   ========================================= */

function initializePreloader() {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add("preloader-hidden");

    window.setTimeout(() => {
      preloader.remove();
    }, 800);
  };

  // Allow a short branded introduction.
  window.setTimeout(hidePreloader, 650);
}


/* =========================================
   2. MOBILE NAVIGATION
   ========================================= */

function initializeMobileNavigation() {
  const toggle = document.getElementById("mobileMenuToggle");
  const navigation = document.getElementById("primaryNavigation");

  if (!toggle || !navigation) return;

  function closeMenu() {
    toggle.classList.remove("is-open");
    navigation.classList.remove("is-open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}


/* =========================================
   3. GENERAL SCROLL REVEALS
   ========================================= */

function initializeScrollReveal() {
  const elements = document.querySelectorAll(
    ".category-page .reveal"
  );

  if (!elements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================================
   4. STAGGERED COFFEE CARD ANIMATIONS
   ========================================= */

function initializeMenuCards() {
  const cards = document.querySelectorAll(
    ".category-menu-card"
  );

  if (!cards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  cards.forEach((card, index) => {
    card.style.setProperty(
      "--card-delay",
      `${(index % 3) * 100}ms`
    );
  });

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    cards.forEach((card) => {
      card.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}


/* =========================================
   5. SMOOTH SCROLLING
   ========================================= */

function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        return;
      }

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });
}


/* =========================================
   6. IMAGE ERROR HANDLING
   ========================================= */

function initializeImageFallbacks() {
  const images = document.querySelectorAll(
    ".category-hero-image img, .category-menu-image img"
  );

  images.forEach((image) => {
    const container = image.parentElement;

    function handleImageError() {
      container.classList.add("image-unavailable");
      image.style.display = "none";

      // Keep the layout intact if an external image fails.
      if (!container.querySelector(".image-fallback-label")) {
        const label = document.createElement("span");

        label.className = "image-fallback-label";
        label.textContent = "LUNNA CAFE";

        container.appendChild(label);
      }
    }

    image.addEventListener("error", handleImageError);

    if (image.complete && image.naturalWidth === 0) {
      handleImageError();
    }
  });
}
