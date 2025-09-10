const scrollBtn = document.getElementById("scrollToTopBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.remove(
      "opacity-0",
      "pointer-events-none",
      "translate-y-8"
    );
    scrollBtn.classList.add("opacity-100", "translate-y-0");
  } else {
    scrollBtn.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-8" // translate-y-8 means move the element down by 2rem (32px) (transform: translateY(2rem);).
    );
    scrollBtn.classList.remove("opacity-100", "translate-y-0");
  }
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Banner Text Animation
window.addEventListener("DOMContentLoaded", function () {
  const bannerElements = document.querySelectorAll(".banner-animate");
  setTimeout(function () {
    bannerElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("opacity-100", "translate-y-0");
        element.classList.remove("opacity-0", "translate-y-8");
      }, index * 150); // Stagger animation by 150ms for each element
    });
  }, 100);
});

// Scroll-triggered Animation
window.addEventListener("DOMContentLoaded", function () {
  const scrollElements = document.querySelectorAll(".scroll-animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  scrollElements.forEach((element) => {
    observer.observe(element);
  });
});

// For mobile menu animation
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("navToggle");
  const closeBtn = document.getElementById("navClose");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("drawerOverlay");

  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");

    // slide in & fade overlay
    drawer.classList.remove("translate-x-full");
    overlay.classList.remove("pointer-events-none");
    requestAnimationFrame(() => {
      overlay.classList.add("opacity-100");
      overlay.classList.remove("opacity-0");
    });

    // prevent body scroll
    body.style.overflow = "hidden";

    // focus first focusable inside drawer
    const focusable = drawer.querySelector(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();

    // swap overlay classes helper
    overlay.classList.add("pointer-events-auto");
  }

  function closeDrawer() {
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");

    // slide out & fade overlay
    drawer.classList.add("translate-x-full");
    overlay.classList.remove("opacity-100");
    overlay.classList.add("opacity-0");

    // allow body scroll after transition
    setTimeout(() => {
      overlay.classList.add("pointer-events-none");
      overlay.classList.remove("pointer-events-auto");
      body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }, 300); // match transition duration
  }

  // Toggle handlers
  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.getAttribute("aria-hidden") === "false") {
      closeDrawer();
    }
  });

  // Trap focus inside drawer when open (basic trap)
  document.addEventListener("focusin", (e) => {
    if (
      drawer.getAttribute("aria-hidden") === "false" &&
      !drawer.contains(e.target)
    ) {
      // bounce focus back into drawer
      const focusables = drawer.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length) focusables[0].focus();
    }
  });
})();
