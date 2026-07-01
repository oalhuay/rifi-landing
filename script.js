const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const loader = document.querySelector(".loader");
const progress = document.querySelector("[data-progress]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setScrollProgress = () => {
  if (!progress) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const amount = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
};

const closeMenu = () => {
  nav?.classList.remove("is-open");
  menuToggle?.classList.remove("is-active");
  document.body.classList.remove("is-menu-open");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
};

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
  }, prefersReducedMotion ? 0 : 520);
});

setHeaderState();
setScrollProgress();
window.addEventListener(
  "scroll",
  () => {
    setHeaderState();
    setScrollProgress();
  },
  { passive: true },
);
window.addEventListener("resize", setScrollProgress);

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", Boolean(isOpen));
  document.body.classList.toggle("is-menu-open", Boolean(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const menuTabs = document.querySelectorAll("[data-menu-tab]");
const menuPanels = document.querySelectorAll("[data-menu-panel]");

const animateMenuPanel = (panel) => {
  if (!window.gsap || prefersReducedMotion || !panel) return;

  gsap.fromTo(
    panel.querySelectorAll("article"),
    { opacity: 0, y: 28, rotateX: -10 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.62,
      ease: "power3.out",
      stagger: 0.07,
    },
  );
};

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menuTab;

    menuTabs.forEach((button) => {
      button.classList.toggle("is-active", button === tab);
    });

    menuPanels.forEach((panel) => {
      const isActive = panel.dataset.menuPanel === target;
      panel.classList.toggle("is-active", isActive);
      if (isActive) animateMenuPanel(panel);
    });

    if (window.gsap && !prefersReducedMotion) {
      gsap.fromTo(
        ".menu-visual img",
        { scale: 1.08, rotate: 0.001 },
        { scale: 1, duration: 0.9, ease: "power3.out" },
      );
    }
  });
});

if (window.Lenis && !prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.85,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

if (canHover && !prefersReducedMotion) {
  document.querySelectorAll("[data-magnetic]").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.14}px, ${y * 0.2}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });

  document.querySelectorAll("[data-tilt]").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-5px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(window.ScrollTrigger);

  document.querySelectorAll("[data-scrub-title]").forEach((title) => {
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      title.append(span);
      if (index < words.length - 1) title.append(" ");
    });
  });

  const heroTimeline = gsap.timeline({
    defaults: { ease: "power3.out", duration: 1 },
    delay: prefersReducedMotion ? 0 : 0.28,
  });

  heroTimeline
    .from("[data-hero-media]", {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.15,
      ease: "power4.out",
    })
    .from(
      "[data-hero-line]",
      {
        opacity: 0,
        y: 54,
        rotate: 1.4,
        stagger: 0.1,
      },
      "-=0.72",
    )
    .from(
      ".scroll-badge",
      {
        opacity: 0,
        scale: 0.76,
        duration: 0.72,
      },
      "-=0.42",
    );

  gsap.from(".site-header", {
    opacity: 0,
    y: -24,
    duration: 0.9,
    delay: 0.45,
    ease: "power3.out",
  });

  gsap.utils.toArray("[data-reveal]").forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 58,
      rotate: 0.4,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true,
      },
    });
  });

  gsap.utils.toArray("[data-scrub-title]").forEach((title) => {
    gsap.from(title.querySelectorAll(".word"), {
      opacity: 0.18,
      y: 22,
      duration: 0.78,
      ease: "power3.out",
      stagger: 0.028,
      scrollTrigger: {
        trigger: title,
        start: "top 86%",
        once: true,
      },
    });
  });

  gsap.to("[data-hero-media] img", {
    scale: 1.15,
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".hero-flavor-a", {
    y: -14,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(".hero-flavor-b", {
    y: 12,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.utils.toArray("[data-parallax]").forEach((image) => {
    gsap.to(image, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: image.closest("section"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  gsap.utils.toArray(".signature-card").forEach((card, index) => {
    gsap.to(card, {
      x: index % 2 === 0 ? 18 : -18,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
