// Scroll reveal
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => revealObs.observe(el));
}

// Service carousel
const track = document.querySelector('.carousel__track');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
if (track && prevBtn && nextBtn) {
  const scrollAmount = () => track.querySelector('.pillar-card')?.offsetWidth + 20 || 360;
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
}

// Gallery lightbox
const tiles = document.querySelectorAll('.gallery__tile');
const lightbox = document.getElementById('lightbox');
if (tiles.length && lightbox) {
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIndex = 0;
  const lbImages = [...tiles].map(t => ({
    src: t.querySelector('img').src,
    alt: t.querySelector('img').alt
  }));

  function openLb(i) {
    lbIndex = i;
    lbImg.src = lbImages[i].src;
    lbImg.alt = lbImages[i].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function navLb(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    lbImg.src = lbImages[lbIndex].src;
    lbImg.alt = lbImages[lbIndex].alt;
  }

  tiles.forEach((t, i) => t.addEventListener('click', () => openLb(i)));
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', () => navLb(-1));
  lbNext?.addEventListener('click', () => navLb(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });
}
