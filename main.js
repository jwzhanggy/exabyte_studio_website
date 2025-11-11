// ===== EXABYTE STUDIO - MAIN JAVASCRIPT =====
// Navigation, smooth scroll, mobile menu, and general utilities

(function() {
  'use strict';

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    updateNavbar();
  }, { passive: true });

  updateNavbar();

  // ===== MOBILE MENU TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    navToggle?.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      navToggle?.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
      navMenu?.classList.remove('active');
      navToggle?.classList.remove('active');
    }
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar?.offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = navbar?.offsetHeight || 70;
    const scrollY = window.scrollY + navHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ===== FADE IN ON SCROLL ANIMATIONS =====
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeElements = document.querySelectorAll('.feature-card, .capability-item, .contact-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // ===== COPY TO CLIPBOARD UTILITY =====
  window.copyToClipboard = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Copied to clipboard:', text);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textarea);
    }
  };

  // ===== HANDLE EXTERNAL LINKS =====
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ===== PREVENT FORM SUBMISSION (if any forms exist) =====
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Form submission prevented (add your own handler)');
    });
  });

  // ===== LOG INITIALIZATION =====
  console.log('%cExabyte Studio', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #FFB300, #7E57C2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
  console.log('%cProfessional 3D Spatial Intelligence Platform', 'font-size: 14px; color: #b0b0b0;');
  console.log('Website initialized successfully');

})();
