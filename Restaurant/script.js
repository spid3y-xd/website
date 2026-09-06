/**
 * URBAN FORK — HAUTE GASTRONOMIE
 * Master Shared Script (Vanilla JavaScript - No Frameworks)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // ---------------------------------------------------------------------------
  const THEME_KEY = 'urban_fork_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

    applyTheme(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        showToast(`Switched to ${newTheme === 'dark' ? 'Atmospheric Dark' : 'Alabaster Light'} mode`);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
      btn.innerHTML = theme === 'dark' 
        ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Navigation & Sticky Scroll Behavior
  // ---------------------------------------------------------------------------
  function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function handleScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile navigation drawer
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

    if (mobileToggle && mobileDrawer && mobileBackdrop) {
      function openMenu() {
        mobileToggle.classList.add('open');
        mobileDrawer.classList.add('open');
        mobileBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        mobileBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }

      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) closeMenu();
        else openMenu();
      });

      mobileBackdrop.addEventListener('click', closeMenu);

      const mobileLinks = mobileDrawer.querySelectorAll('a');
      mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          closeMenu();
        }
      });
    }

    // Mark current active link based on pathname
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === pageName || (pageName === '' && href === 'index.html') || (pageName === 'index.html' && href === '/')) {
        link.classList.add('active');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ---------------------------------------------------------------------------
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach((el) => observer.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 4. Parallax Scroll Effect
  // ---------------------------------------------------------------------------
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;

        // Only calculate if visible near viewport
        if (scrollY + windowHeight > elementTop && scrollY < elementTop + rect.height) {
          const distance = scrollY - elementTop;
          const translateY = distance * speed;
          el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  // ---------------------------------------------------------------------------
  // 5. Interactive Menu Filter (Category + Dietary)
  // ---------------------------------------------------------------------------
  function initMenuFilter() {
    const categoryTabs = document.querySelectorAll('.category-tabs .tab-pill');
    const dietaryBtns = document.querySelectorAll('.dietary-filters .dietary-btn');
    const menuGrid = document.querySelector('.menu-grid');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!categoryTabs.length || !menuGrid || !menuItems.length) return;

    let activeCategory = 'all';
    let activeDietary = 'all';

    function filterMenu() {
      menuGrid.style.opacity = '0.3';
      menuGrid.style.transform = 'translateY(10px)';
      menuGrid.style.transition = 'opacity 0.22s ease, transform 0.22s ease';

      setTimeout(() => {
        let visibleCount = 0;

        menuItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          const itemDietary = (item.getAttribute('data-dietary') || '').split(' ');

          const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
          const matchesDietary = activeDietary === 'all' || itemDietary.includes(activeDietary);

          if (matchesCategory && matchesDietary) {
            item.style.display = 'flex';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });

        // Empty state check
        let emptyNotice = document.getElementById('menu-empty-notice');
        if (visibleCount === 0) {
          if (!emptyNotice) {
            emptyNotice = document.createElement('div');
            emptyNotice.id = 'menu-empty-notice';
            emptyNotice.style.gridColumn = '1 / -1';
            emptyNotice.style.textAlign = 'center';
            emptyNotice.style.padding = '4rem 1rem';
            emptyNotice.style.color = 'var(--text-muted)';
            emptyNotice.innerHTML = `
              <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">No dishes found matching selection</p>
              <p style="font-size: 0.875rem;">Please select another category or clear your dietary preferences.</p>
            `;
            menuGrid.appendChild(emptyNotice);
          }
          emptyNotice.style.display = 'block';
        } else if (emptyNotice) {
          emptyNotice.style.display = 'none';
        }

        menuGrid.style.opacity = '1';
        menuGrid.style.transform = 'translateY(0)';
      }, 220);
    }

    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.getAttribute('data-filter') || 'all';
        filterMenu();
      });
    });

    dietaryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        dietaryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeDietary = btn.getAttribute('data-dietary') || 'all';
        filterMenu();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Gallery Lightbox with Keyboard & Touch
  // ---------------------------------------------------------------------------
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    if (!galleryItems.length || !lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const itemsData = Array.from(galleryItems).map((item) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-caption')?.textContent || img?.getAttribute('alt') || 'Urban Fork Gallery';
      const category = item.querySelector('.gallery-category')?.textContent || 'Ambiance';
      const src = img?.getAttribute('src') || '';
      return { src, title, category };
    });

    function openLightbox(index) {
      currentIndex = (index + itemsData.length) % itemsData.length;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % itemsData.length;
      updateLightboxContent();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + itemsData.length) % itemsData.length;
      updateLightboxContent();
    }

    function updateLightboxContent() {
      const item = itemsData[currentIndex];
      if (!item) return;

      lightboxImg.style.opacity = '0.4';
      lightboxImg.style.transform = 'scale(0.96)';
      lightboxImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxCategory) lightboxCategory.textContent = item.category;
        if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${itemsData.length}`;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 150);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Reservation Form (Validation & Confirmation State)
  // ---------------------------------------------------------------------------
  function initReservationForm() {
    const form = document.getElementById('reservation-form');
    const successCard = document.getElementById('reservation-success');
    if (!form) return;

    // Set default minimum date to today
    const dateInput = form.querySelector('input[name="res_date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
      if (!dateInput.value) dateInput.value = today;
    }

    // Real-time input validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateInput(input);
        }
      });
    });

    function validateInput(input) {
      if (!input.hasAttribute('required')) return true;

      let valid = true;
      const value = input.value.trim();

      if (!value) {
        valid = false;
      } else if (input.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      } else if (input.type === 'tel') {
        valid = value.length >= 7;
      }

      if (valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isAllValid = true;
      inputs.forEach((input) => {
        if (!validateInput(input)) {
          isAllValid = false;
        }
      });

      if (!isAllValid) {
        showToast('Please verify required fields before proceeding');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Confirming...';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; margin-right: 8px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
          Securing Table...
        `;
      }

      // Collect data
      const formData = new FormData(form);
      const name = formData.get('res_name') || 'Guest';
      const guests = formData.get('res_party') || '2 Guests';
      const date = formData.get('res_date') || 'Today';
      const time = formData.get('res_time') || '7:30 PM';
      const area = formData.get('res_seating') || 'Main Dining Room';
      const bookingCode = 'UF-' + Math.floor(1000 + Math.random() * 9000);

      setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;

        form.style.display = 'none';
        if (successCard) {
          const codeEl = successCard.querySelector('.booking-code');
          const detailsEl = successCard.querySelector('.booking-summary-details');

          if (codeEl) codeEl.textContent = bookingCode;
          if (detailsEl) {
            detailsEl.innerHTML = `
              <p><strong>Lead Guest:</strong> ${escapeHtml(name)}</p>
              <p><strong>Party Size:</strong> ${escapeHtml(guests)}</p>
              <p><strong>Date & Time:</strong> ${escapeHtml(date)} at ${escapeHtml(time)}</p>
              <p><strong>Seating Experience:</strong> ${escapeHtml(area)}</p>
            `;
          }

          successCard.style.display = 'block';
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast(`Reservation confirmed! Reference ${bookingCode}`);
        }
      }, 850);
    });

    // Reset button inside confirmation card
    const newBookingBtn = document.getElementById('book-another-btn');
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', () => {
        form.reset();
        inputs.forEach((input) => input.classList.remove('is-valid', 'is-invalid'));
        form.style.display = 'block';
        if (successCard) successCard.style.display = 'none';
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Contact Form
  // ---------------------------------------------------------------------------
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Transmitting Message...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message';
        }
        showToast('Your message has been delivered to our concierge team.');
      }, 700);
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Newsletter Signup Form
  // ---------------------------------------------------------------------------
  function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');
        if (input && input.value.trim()) {
          input.value = '';
          showToast('Thank you for subscribing to Urban Fork Private Notes.');
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Toast Notification System
  // ---------------------------------------------------------------------------
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: var(--accent-gold); font-size: 1.1rem;">✦</span>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ---------------------------------------------------------------------------
  // 11. Page Loader Dismissal
  // ---------------------------------------------------------------------------
  function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 250);
    });

    // Fallback in case load takes longer
    setTimeout(() => {
      if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
      }
    }, 1500);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Self-initialization
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initScrollReveal();
    initParallax();
    initMenuFilter();
    initLightbox();
    initReservationForm();
    initContactForm();
    initNewsletter();
    initPageLoader();
  });
})();
