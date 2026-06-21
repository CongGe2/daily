/**
 * Portfolio · 金承旭
 * Minimal JavaScript — scroll reveal, nav behavior, mobile menu
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = nav.querySelectorAll('.nav-links a');
  const revealEls = document.querySelectorAll('.reveal');

  // ---------- Scroll: nav background ----------
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;

    // Nav background
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(function (section) {
      const top = section.offsetTop - 160;
      if (y >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    lastScroll = y;
  }

  // ---------- Scroll reveal ----------
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- Mobile menu ----------
  navToggle.addEventListener('click', function () {
    const isOpen = nav.classList.contains('mobile-open');
    if (isOpen) {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-label', '菜单');
      document.body.style.overflow = '';
    } else {
      nav.classList.add('mobile-open');
      navToggle.setAttribute('aria-label', '关闭菜单');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-label', '菜单');
      document.body.style.overflow = '';
    });
  });

  // ---------- Smooth scroll for all anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Init ----------
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check initial state

  // ---------- Project category filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter cards
        projectCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('filtered-out');
          } else {
            card.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // ---------- WeChat placeholder ----------
  const wechatLink = document.getElementById('wechatLink');
  if (wechatLink) {
    wechatLink.addEventListener('click', function (e) {
      e.preventDefault();
      var id = 'JCX-1416907076';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id).then(function () {
          showToast('微信号已复制：' + id);
        }).catch(function () {
          showToast('微信号：' + id);
        });
      } else {
        showToast('微信号：' + id);
      }
    });

    function showToast(msg) {
      var toast = document.createElement('div');
      toast.textContent = msg;
      toast.style.cssText =
        'position:fixed;bottom:40px;left:50%;transform:translateX(-50%);' +
        'background:#121210;color:#e4e2de;padding:14px 28px;border-radius:2px;' +
        'font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;' +
        'font-family:"Inter","PingFang SC",sans-serif;letter-spacing:0.03em;';
      document.body.appendChild(toast);
      requestAnimationFrame(function () {
        toast.style.opacity = '1';
      });
      setTimeout(function () {
        toast.style.opacity = '0';
        setTimeout(function () {
          document.body.removeChild(toast);
        }, 300);
      }, 2500);
    }
  }

})();
