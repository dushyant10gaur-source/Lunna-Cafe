/* =====================================================
   LUNNA CAFE — INTERACTIONS & ANIMATIONS
   Works with the supplied index.html and style.css
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializePreloader();
  initializeScrollReveal();
  initializeMobileNavigation();
  initializeHeader();
  initializeActiveNavigation();
  initializeHeroParallax();
  initializeImageFallbacks();
  initializeAnchorScrolling();
});


/* =====================================================
   1. CINEMATIC LOADING SCREEN
   ===================================================== */

function initializePreloader() {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  // Prevent the loading screen from getting stuck if an image loads slowly.
  const minimumDisplayTime = 900;
  const startedAt = performance.now();
  let hideScheduled = false;

  function hidePreloader() {
    if (hideScheduled) return;

    hideScheduled = true;

    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, minimumDisplayTime - elapsed);

    window.setTimeout(() => {
      preloader.classList.add("is-hidden");

      document.body.classList.add("site-ready");

      // Remove the preloader after its fade transition.
      window.setTimeout(() => {
        if (preloader.isConnected) {
          preloader.remove();
        }
      }, 1000);
    }, remaining);
  }

  // The page remains usable even if window.load takes a while.
  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader, { once: true });

    // Fallback in case a third-party resource is slow.
    window.setTimeout(hidePreloader, 3500);
  }
}


/* =====================================================
   2. SCROLL-REVEAL ANIMATIONS
   ===================================================== */

function initializeScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  // Make everything visible when reduced motion is requested
  // or IntersectionObserver is unavailable.
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // Each element reveals only once.
        currentObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}


/* =====================================================
   3. MOBILE NAVIGATION
   ===================================================== */

function initializeMobileNavigation() {
  const toggle = document.getElementById("mobileMenuToggle");
  const navigation = document.getElementById("primaryNavigation");

  if (!toggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("is-open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  function openMenu() {
    navigation.classList.add("is-open");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu after a visitor chooses a navigation link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu when clicking outside it.
  document.addEventListener("click", (event) => {
    const clickedInsideNavigation = navigation.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideNavigation && !clickedToggle) {
      closeMenu();
    }
  });

  // Escape closes the mobile menu.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.blur();
    }
  });

  // Reset navigation if the viewport changes to desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}


/* =====================================================
   4. HEADER SCROLL EFFECT
   ===================================================== */

function initializeHeader() {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  let ticking = false;

  function updateHeader() {
    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 60
    );

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );

  updateHeader();
}


/* =====================================================
   5. ACTIVE NAVIGATION LINKS
   ===================================================== */

function initializeActiveNavigation() {
  const navigationLinks = [
    ...document.querySelectorAll(
      '.navigation-link[href^="#"]'
    )
  ];

  const sections = navigationLinks
    .map((link) => {
      const id = link.getAttribute("href");

      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (!visibleSections.length) return;

      const currentId = `#${visibleSections[0].target.id}`;

      navigationLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === currentId
        );
      });
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0, 0.15, 0.35, 0.6]
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* =====================================================
   6. SUBTLE HERO PARALLAX
   ===================================================== */

function initializeHeroParallax() {
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".hero-visual");

  if (!hero || !visual) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isCoarsePointer = window.matchMedia(
    "(pointer: coarse)"
  ).matches;

  // Disable pointer parallax on mobile and reduced-motion devices.
  if (reducedMotion || isCoarsePointer) return;

  let animationFrame = null;

  hero.addEventListener("mousemove", (event) => {
    const bounds = hero.getBoundingClientRect();

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    const moveX = (x - 0.5) * 10;
    const moveY = (y - 0.5) * 10;

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {
      visual.style.setProperty(
        "--parallax-x",
        `${moveX}px`
      );

      visual.style.setProperty(
        "--parallax-y",
        `${moveY}px`
      );

      visual.style.transform =
        `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  hero.addEventListener("mouseleave", () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    visual.style.transform = "";
    animationFrame = null;
  });
}


/* =====================================================
   7. IMAGE ERROR HANDLING
   ===================================================== */

function initializeImageFallbacks() {
  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      const container = image.parentElement;

      image.style.display = "none";

      if (container) {
        container.classList.add("image-unavailable");
      }
    });

    // Handle images that already failed before this listener.
    if (image.complete && image.naturalWidth === 0) {
      image.dispatchEvent(new Event("error"));
    }
  });
}


/* =====================================================
   8. SMOOTH INTERNAL ANCHOR NAVIGATION
   ===================================================== */

function initializeAnchorScrolling() {
  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (target === document.getElementById("siteHeader")) {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? "auto" : "smooth"
        });
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }

      // Keep the browser URL in sync with the selected section.
      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });
}
