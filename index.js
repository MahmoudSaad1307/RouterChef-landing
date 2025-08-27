AOS.init({
  duration: 1000,
  once: true,
  easing: "ease-in-out",
});

window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  const backToTop = document.getElementById("back-to-top");
  if (window.scrollY > 300) {
    backToTop.style.opacity = "1";
    backToTop.style.visibility = "visible";
    backToTop.style.bottom = "20px";
  } else {
    backToTop.style.opacity = "0";
    backToTop.style.visibility = "hidden";
    backToTop.style.bottom = "-50px";
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.getElementById("back-to-top").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const activeIndicator = document.querySelector(".nav-active-indicator");
  const revealEls = document.querySelectorAll(".reveal");
  const parallaxEls = document.querySelectorAll("[data-parallax-speed]");

  setActiveState(navLinks[0]);

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);

      setActiveState(this);
    });
  });

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - sectionHeight * 0.25) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        setActiveState(link);
      }
    });

    // parallax
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  function setActiveState(activeLink) {
    navLinks.forEach((link) => link.classList.remove("active"));

    activeLink.classList.add("active");

    const linkRect = activeLink.getBoundingClientRect();
    const containerRect =
      activeLink.parentElement.parentElement.getBoundingClientRect();

    activeIndicator.style.width = `${linkRect.width}px`;
    activeIndicator.style.left = `${linkRect.left - containerRect.left}px`;
  }

  const navbarCollapse = document.getElementById("navbarNav");
  navbarCollapse.addEventListener("show.bs.collapse", function () {
    activeIndicator.style.opacity = "0";
  });

  navbarCollapse.addEventListener("hidden.bs.collapse", function () {
    activeIndicator.style.opacity = "1";
  });

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  // simple tilt
  const tiltEls = document.querySelectorAll(".tilt");
  tiltEls.forEach((el) => {
    let rect;
    const handleMove = (e) => {
      rect = rect || el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(
        x * 6
      ).toFixed(2)}deg)`;
    };
    const reset = () => {
      el.style.transform = "";
      rect = undefined;
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    el.addEventListener("blur", reset);
  });
});
