// Single-open accordion with open & close animations
(function () {
  const items = document.querySelectorAll(
    "#faq-accordion [data-accordion-btn]"
  );
  let openIndex = null;
  const ANIM_MS = 300; // keep in sync with duration-300

  function openItem(btn, panel) {
    // Close other items first
    items.forEach((b) => {
      if (b !== btn) {
        const p = document.getElementById(b.getAttribute("aria-controls"));
        closeItem(b, p);
      }
    });

    btn.setAttribute("aria-expanded", "true");
    btn.classList.add(
      "bg-gradient-to-r",
      "dark:from-gray-800/80",
      "from-blue-50/80",
      "to-indigo-50/80",
      "shadow-inner",
    );
    btn
      .querySelector("svg")
      ?.classList.add("text-blue-600", "rotate-180", "scale-110");

    // Unhide panel and start from CLOSED state to allow animation
    panel.hidden = false;
    panel.classList.add("max-h-0", "opacity-0", "py-0");
    panel.classList.remove("max-h-96", "opacity-100", "py-3", "bg-gray-50");

    // Force a reflow, then apply OPEN classes so the transition runs
    // Either of these works; we'll use rAF for clarity
    requestAnimationFrame(() => {
      // touch layout to ensure previous state is committed
      // eslint-disable-next-line no-unused-expressions
      panel.offsetHeight;

      panel.classList.remove("max-h-0", "opacity-0", "py-0");
      panel.classList.add("py-3", "max-h-96", "opacity-100", "bg-gray-50");
    });

    openIndex = Array.from(items).indexOf(btn);
  }

  function closeItem(btn, panel) {
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove(
      "bg-gradient-to-r",
      "from-blue-50/80",
      "to-indigo-50/80",
      "shadow-inner"
    );
    btn
      .querySelector("svg")
      ?.classList.remove("text-blue-600", "rotate-180", "scale-110");

    panel.classList.add("max-h-0", "opacity-0", "py-0");
    panel.classList.remove("py-3", "max-h-96", "opacity-100", "bg-gray-50");

    // Hide for a11y only after the transition completes
    clearTimeout(panel._hideTimer);
    panel._hideTimer = setTimeout(() => {
      panel.hidden = true;
    }, ANIM_MS);

    if (openIndex === Array.from(items).indexOf(btn)) openIndex = null;
  }

  items.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      expanded ? closeItem(btn, panel) : openItem(btn, panel);
    });

    // Optional keyboard nav
    btn.addEventListener("keydown", (e) => {
      const all = Array.from(items);
      const i = all.indexOf(btn);
      if (["ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        all[(i + 1) % all.length].focus();
      } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        all[(i - 1 + all.length) % all.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        all[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        all[all.length - 1].focus();
      }
    });
  });
})();
