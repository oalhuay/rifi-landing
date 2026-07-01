const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const loader = document.querySelector(".loader");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("load", () => {
  loader?.classList.add("is-hidden");
});

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("is-menu-open", Boolean(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  });
});

document.querySelectorAll("[data-menu-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menuTab;

    document.querySelectorAll("[data-menu-tab]").forEach((button) => {
      button.classList.toggle("is-active", button === tab);
    });

    document.querySelectorAll("[data-menu-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.menuPanel === target);
    });
  });
});

if (window.Lenis) {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

if (window.gsap) {
  gsap.registerPlugin(window.ScrollTrigger);

  gsap.from("[data-hero-line]", {
    opacity: 0,
    y: 44,
    duration: 1.05,
    stagger: 0.12,
    delay: 0.2,
    ease: "power3.out",
  });

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
      y: 54,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 84%",
        once: true,
      },
    });
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
}
