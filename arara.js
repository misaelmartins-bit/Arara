document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     NAV: scrolled state + mobile toggle
  --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.textContent = '☰';
    });
  });

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     GALLERY CAROUSEL
  --------------------------------------------------------- */
  const track = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('galleryDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  if (track) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', () => { next(); restartAuto(); });
    prevBtn.addEventListener('click', () => { prev(); restartAuto(); });

    function startAuto() {
      autoTimer = setInterval(next, 5500);
    }
    function restartAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) startAuto();

    const viewport = track.closest('.gallery__viewport');
    viewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
    viewport.addEventListener('mouseleave', () => { if (!prefersReducedMotion) startAuto(); });

    // basic swipe support
    let startX = 0;
    viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) {
        diff < 0 ? next() : prev();
        restartAuto();
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     DEMO VIDEO PLAY BUTTON
  --------------------------------------------------------- */
  const video = document.getElementById('demoVideo');
  const playBtn = document.getElementById('demoPlay');

  if (video && playBtn) {
    playBtn.addEventListener('click', () => {
      video.play();
    });
    video.addEventListener('play', () => playBtn.classList.add('is-hidden'));
    video.addEventListener('pause', () => playBtn.classList.remove('is-hidden'));
    video.addEventListener('ended', () => playBtn.classList.remove('is-hidden'));
  }

});
