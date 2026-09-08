/**
 * URBAN FORK — Luxury Restaurant Engine
 * Vanilla JavaScript (Theming, Navigation, Scroll Reveals, Filters, Lightbox, Reservations)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollReveals();
  initMenuFilters();
  initGalleryLightbox();
  initReservationEngine();
  initContactAndNewsletter();
  initFaqAccordion();
});

/* ==========================================================================
   1. Theming System (Dark / Light with LocalStorage persistence)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('urban-fork-theme');
  const initialTheme = savedTheme || 'dark';

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeButtonAria(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('urban-fork-theme', newTheme);
      updateThemeButtonAria(newTheme);
    });
  }

  function updateThemeButtonAria(theme) {
    if (!themeToggleBtn) return;
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* ==========================================================================
   2. Professional Fixed Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Subtle header padding compaction on scroll
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu drawer
  if (toggleBtn && navOverlay) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navOverlay.classList.contains('open');
      toggleBtn.classList.toggle('active', isOpen);
      navOverlay.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    toggleBtn.addEventListener('click', () => toggleMenu());

    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) {
        toggleMenu(false);
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // Active page link highlighter based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Scroll Reveal Observer
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }
}

/* ==========================================================================
   4. Menu Filtering & Dietary Tags
   ========================================================================== */
function initMenuFilters() {
  const categoryBtns = document.querySelectorAll('.filter-btn');
  const dietaryPills = document.querySelectorAll('.dietary-pill');
  const menuCards = document.querySelectorAll('.dish-card[data-category]');

  if (categoryBtns.length === 0 || menuCards.length === 0) return;

  let activeCategory = 'all';
  let activeDietary = 'all';

  function applyFilters() {
    menuCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardDietary = card.getAttribute('data-dietary') || '';
      
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesDietary = activeDietary === 'all' || cardDietary.includes(activeDietary);

      if (matchesCategory && matchesDietary) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 20);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px) scale(0.97)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 250);
      }
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      applyFilters();
    });
  });

  dietaryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetDietary = pill.getAttribute('data-dietary');
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
        activeDietary = 'all';
      } else {
        dietaryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeDietary = targetDietary;
      }
      applyFilters();
    });
  });
}

/* ==========================================================================
   5. Accessible Lightbox Gallery
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox || galleryItems.length === 0) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const titleEl = lightbox.querySelector('.lightbox-title');
  const catEl = lightbox.querySelector('.lightbox-cat');
  const counterEl = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const itemsData = Array.from(galleryItems).map((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-caption-title')?.textContent || 'Urban Fork Dining';
    const cat = item.querySelector('.gallery-caption-cat')?.textContent || 'Atmosphere';
    return {
      src: img?.src || '',
      alt: img?.alt || 'Urban Fork Experience',
      title,
      cat,
      index
    };
  });

  function showSlide(index) {
    if (index < 0) index = itemsData.length - 1;
    if (index >= itemsData.length) index = 0;
    currentIndex = index;

    const data = itemsData[currentIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.cat;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${itemsData.length}`;
  }

  function openLightbox(index) {
    showSlide(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });
}

/* ==========================================================================
   6. Reservation Engine with Validation & Voucher Simulation
   ========================================================================== */
function initReservationEngine() {
  const form = document.getElementById('reservation-form');
  const guestBtns = document.querySelectorAll('.guest-btn');
  const guestInput = document.getElementById('res-guests');
  const modal = document.getElementById('confirmation-modal');
  const modalClose = document.getElementById('modal-close-btn');

  // Party size selector pills
  if (guestBtns.length > 0 && guestInput) {
    guestBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        guestBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        guestInput.value = btn.getAttribute('data-guests');
      });
    });
  }

  // Set minimum date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (!form) return;

  // Real-time input validation styling
  const inputs = form.querySelectorAll('input[required], select[required]');
  inputs.forEach(input => {
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
  });

  function validateField(field) {
    let isValid = true;
    if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailPattern.test(field.value.trim());
    } else if (field.type === 'tel') {
      isValid = field.value.trim().length >= 7;
    } else {
      isValid = field.value.trim() !== '';
    }

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
    }
    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let formIsValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Extract form data
    const name = document.getElementById('res-name')?.value || 'Honored Guest';
    const email = document.getElementById('res-email')?.value || '';
    const date = document.getElementById('res-date')?.value || '2026-09-15';
    const time = document.getElementById('res-time')?.value || '19:30';
    const guests = guestInput?.value || '2';
    const area = document.getElementById('res-seating')?.value || 'Main Dining Hall';

    // Format date nicely
    const dateObj = new Date(date);
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Generate reference code
    const refCode = 'UF-' + Math.floor(100000 + Math.random() * 900000);

    // Populate modal ticket
    if (modal) {
      const refEl = modal.querySelector('.ticket-ref');
      const nameEl = document.getElementById('confirm-name');
      const dateEl = document.getElementById('confirm-date');
      const timeEl = document.getElementById('confirm-time');
      const guestsEl = document.getElementById('confirm-guests');
      const areaEl = document.getElementById('confirm-area');

      if (refEl) refEl.textContent = refCode;
      if (nameEl) nameEl.textContent = name;
      if (dateEl) dateEl.textContent = dateFormatted;
      if (timeEl) timeEl.textContent = time;
      if (guestsEl) guestsEl.textContent = `${guests} Guests`;
      if (areaEl) areaEl.textContent = area;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    form.reset();
    inputs.forEach(inp => inp.classList.remove('is-valid'));
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   7. Contact Form & Newsletter Toast Feedback
   ========================================================================== */
function initContactAndNewsletter() {
  const contactForm = document.getElementById('contact-form');
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-gold);"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for reaching out. Our Maître d\' will contact you shortly.');
      contactForm.reset();
    });
  }

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        showToast('Welcome to the Urban Fork Chronicle. You have been subscribed.');
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close other accordion items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
