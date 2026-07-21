/* ==========================================================================
   BASIOX CONTROLS â€” Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll behavior ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // --- Animated counters ---
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        countObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // --- Solution card â†’ row-drawer toggle ---
  document.querySelectorAll('.sol-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.sol;
      const drawer = document.getElementById('drawer-' + key);
      if (!drawer) return;

      const rowDrawer = drawer.closest('.sol-row-drawer');
      const isOpen = card.classList.contains('active');

      // Close all
      document.querySelectorAll('.sol-card').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.sol-row-drawer').forEach(rd => rd.classList.remove('open'));
      document.querySelectorAll('.sol-drawer').forEach(d => d.classList.remove('open'));

      if (!isOpen) {
        card.classList.add('active');
        rowDrawer.classList.add('open');
        drawer.classList.add('open');
        setTimeout(() => rowDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      }
    });
  });

  // --- RFQ Form â€” client-side validation only, FormSubmit.co handles delivery ---
  const form = document.getElementById('rfq-form');
  form?.addEventListener('submit', (e) => {
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#f87171';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) {
      e.preventDefault();
      return;
    }
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sendingâ€¦';
    btn.disabled = true;
  });

  // --- Smooth active nav link highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + e.target.id
            ? 'white'
            : '';
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => sectionObserver.observe(s));

});