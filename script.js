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

  // ---------- WeChat placeholder ----------
  const wechatLink = document.getElementById('wechatLink');
  if (wechatLink) {
    wechatLink.addEventListener('click', function (e) {
      e.preventDefault();
      // Replace with your actual WeChat ID below
      alert('微信号：请在此填入你的微信号\n\n（编辑 script.js 中此处的文本即可）');
    });
  }

})();
