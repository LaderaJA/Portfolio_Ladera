document.addEventListener("DOMContentLoaded", () => {
  // === Utility Functions ===
  const throttle = (fn, wait) => {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn(...args);
      }
    };
  };

  // === Cached Elements ===
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");
  const revealElements = document.querySelectorAll(".skill-card, .project-card, .contact-info");
  const aboutSection = document.querySelector(".about");
  const aboutHeading = aboutSection?.querySelector("h2");
  const aboutImage = aboutSection?.querySelector(".about-image");
  const aboutText = aboutSection?.querySelector(".about-text");
  const skillsSection = document.querySelector(".skills");
  const projectsSection = document.querySelector(".projects");
  const profileImg = document.querySelector(".profile-img");

  // === Mobile Nav Toggle ===
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // === Sticky Header ===
  const scrollWatcher = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  // === Scroll Reveal ===
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      if (el.getBoundingClientRect().top < windowHeight - 100) {
        el.classList.add("animate");
      }
    });
  };

  // === Active Nav Highlight ===
  const highlightNav = () => {
    const scrollPosition = window.scrollY;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      if (navLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLink.classList.add("active");
        } else {
          navLink.classList.remove("active");
        }
      }
    });
  };

  // === Smooth Scrolling ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        const offset = header.offsetHeight;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: "smooth",
        });
      }
    });
  });

  // === Typing Effect using IntersectionObserver ===
  if (aboutHeading) {
    const originalText = aboutHeading.textContent;
    aboutHeading.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        aboutHeading.textContent += originalText.charAt(i++);
        setTimeout(typeWriter, 100);
      }
    };

    const observer = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        typeWriter();
        obs.disconnect();
      }
    });
    observer.observe(aboutHeading);
  }

  // === Floating Particles (limited) ===
  function createParticles() {
    sections.forEach((section) => {
      const container = document.createElement("div");
      container.className = "particles";
      section.appendChild(container);

      for (let i = 0; i < 4; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.width = p.style.height = `${Math.random() * 10 + 5}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        p.style.animationDuration = `${Math.random() * 20 + 10}s`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(p);
      }
    });
  }

  // === Parallax Effects ===
  const parallaxScroll = () => {
    const y = window.pageYOffset;

    if (aboutImage && aboutText) {
      aboutImage.style.transform = `translateY(${y * 0.05}px)`;
      aboutText.style.transform = `translateY(${y * 0.03}px)`;
    }

    skillsSection?.querySelectorAll(".skill-card").forEach((card, i) => {
      card.style.transform = `translateY(${y * (0.02 + i * 0.005)}px)`;
    });

    projectsSection?.querySelectorAll(".project-card").forEach((card, i) => {
      card.style.transform = `translateY(${y * (0.03 + i * 0.005)}px)`;
    });
  };

  // === Profile Tilt Effect ===
  if (profileImg) {
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      profileImg.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.05)`;
    });

    document.addEventListener("mouseleave", () => {
      profileImg.style.transform = "perspective(1000px) rotateY(0) rotateX(0) scale(1)";
    });
  }

  // === Glow on Hover ===
  const glowElements = document.querySelectorAll(".btn, .social-link, .skill-card, .project-card");
  document.addEventListener("mousemove", throttle((e) => {
    const { clientX: mx, clientY: my } = e;
    glowElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const dx = mx - (rect.left + rect.width / 2);
      const dy = my - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - dist / 300);
      el.style.boxShadow = intensity > 0 ? `0 0 ${20 * intensity}px rgba(235,121,247,${0.5 * intensity})` : "";
    });
  }, 100));

  // === Run Initial Functions ===
  createParticles();
  scrollWatcher();
  revealOnScroll();
  highlightNav();
  parallaxScroll();

  // === Add Throttled Listeners ===
  window.addEventListener("scroll", throttle(scrollWatcher, 100));
  window.addEventListener("scroll", throttle(revealOnScroll, 100));
  window.addEventListener("scroll", throttle(highlightNav, 100));
  window.addEventListener("scroll", throttle(parallaxScroll, 50));
});
