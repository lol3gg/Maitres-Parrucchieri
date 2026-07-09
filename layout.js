/* Layout condiviso — navigazione e footer unici su tutte le pagine */

const SITE = {
  /* Sezioni home (anchor) + Shop pagina separata */
  nav: [
    { href: '#hero', label: 'Chi siamo', page: 'about', section: true },
    { href: '#servizi', label: 'Servizi', page: 'servizi', section: true },
    { href: '#staff', label: 'Staff', page: 'staff', section: true },
    { href: '#galleria', label: 'Galleria', page: 'galleria', section: true },
    { href: '#contatti', label: 'Contatti', page: 'contatti', section: true },
    { href: 'shop.html', label: 'Shop', page: 'shop', section: false }
  ],
  footer: [
    { href: '#hero', label: 'Chi siamo', section: true },
    { href: '#servizi', label: 'Servizi', section: true },
    { href: '#staff', label: 'Staff', section: true },
    { href: '#galleria', label: 'Galleria', section: true },
    { href: '#contatti', label: 'Contatti', section: true },
    { href: 'shop.html', label: 'Shop', section: false },
    { href: 'prenota.html', label: 'Prenota', section: false }
  ]
};

function resolveHref(item, onHome) {
  if (!item.section) return item.href;
  return onHome ? item.href : `index.html${item.href}`;
}

function buildNavLinks(currentPage) {
  const onHome = currentPage === 'home';
  return SITE.nav.map(item => {
    const href = resolveHref(item, onHome);
    const active = !item.section && item.page === currentPage ? 'active' : '';
    const section = item.section ? item.href.slice(1) : '';
    return `<li><a href="${href}" class="${active}"${section ? ` data-section="${section}"` : ''}>${item.label}</a></li>`;
  }).join('');
}

function buildFooterLinks() {
  const onHome = document.body?.dataset.page === 'home';
  return SITE.footer.map(item => {
    const href = resolveHref(item, onHome);
    return `<a href="${href}">${item.label}</a>`;
  }).join('');
}

function buildHeader(currentPage, extras = '') {
  return `
    <nav class="nav">
      <a href="index.html" class="nav__logo">
        <span class="logo-ring"></span>
        <span class="logo-text">M&nbsp;A&nbsp;Î&nbsp;T&nbsp;R&nbsp;E&nbsp;S</span>
      </a>
      <ul class="nav__links" id="navLinks">${buildNavLinks(currentPage)}</ul>
      ${extras}
      <div class="nav__cta">
        <button type="button" class="nav__fs" id="fullscreenBtn" aria-label="Schermo intero" title="Schermo intero" aria-pressed="false">
          <svg class="fs-icon fs-icon--expand" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/>
          </svg>
          <svg class="fs-icon fs-icon--shrink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true" hidden>
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>
          </svg>
        </button>
        <a href="prenota.html" class="nav__book"><span>Prenota</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <button class="nav__burger" id="navBurger" aria-label="Menu"><span></span><span></span></button>
    </nav>`;
}

function buildFooter() {
  return `
    <div class="marquee marquee--footer" aria-hidden="true">
      <div class="marquee__track marquee__track--reverse">
        <span>MAÎTRES · URBANIA · PREMIUM TRASH · BOOK NOW · </span>
        <span>MAÎTRES · URBANIA · PREMIUM TRASH · BOOK NOW · </span>
      </div>
    </div>
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="logo-text logo-text--footer">M&nbsp;A&nbsp;Î&nbsp;T&nbsp;R&nbsp;E&nbsp;S</span>
        <p>Parrucchieri · For women and men</p>
      </div>
      <nav class="footer__nav">${buildFooterLinks()}</nav>
      <p class="footer__copy">&copy; 2026 M A Î T R E S · Via XXIII Gennaio 101/A, Urbania ·
        <a href="mailto:maitresparrucchieri@gmail.com">maitresparrucchieri@gmail.com</a> · P.IVA 02350230419</p>
    </div>`;
}

function buildBreadcrumb(label) {
  return `<nav class="breadcrumb" aria-label="Percorso"><a href="index.html">Home</a><span class="breadcrumb__sep">/</span><span aria-current="page">${label}</span></nav>`;
}

function initSiteLayout(currentPage, options = {}) {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const breadcrumb = document.getElementById('breadcrumb');

  if (header) {
    header.innerHTML = buildHeader(currentPage, options.navExtras || '');
    header.classList.add('scrolled');
  }
  if (footer) footer.innerHTML = buildFooter();
  if (breadcrumb && options.breadcrumb) breadcrumb.innerHTML = buildBreadcrumb(options.breadcrumb);

  initNavUI();
  initInPageAnchors();
  initSectionSpy();
  initHashScroll();
  document.getElementById('fullscreenFab')?.remove();
  if (typeof initFullscreen === 'function') initFullscreen('fullscreenBtn');
  if (typeof initMarquees === 'function') initMarquees();
}

function scrollToSection(id, href) {
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#hero');
    setActiveSection('hero');
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', href || `#${id}`);
    setActiveSection(id);
  }
}

let inPageAnchorsReady = false;

function initInPageAnchors() {
  if (inPageAnchorsReady || document.body.dataset.page !== 'home') return;
  inPageAnchorsReady = true;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || document.body.dataset.page !== 'home') return;
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.closest('.nav__links')) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    scrollToSection(href.slice(1), href);
  });
}

function initNavUI() {
  const header = document.getElementById('header');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (header) {
    header.classList.add('scrolled');
  }

  if (burger && navLinks) {
    const closeMenu = () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href?.startsWith('#') && document.body.dataset.page === 'home') {
          e.preventDefault();
          scrollToSection(href.slice(1), href);
        }
        closeMenu();
      });
    });
  }
}

function setActiveSection(id) {
  document.querySelectorAll('.nav__links a[data-section]').forEach(a => {
    a.classList.toggle('active', a.dataset.section === id);
  });
}

function initSectionSpy() {
  if (document.body.dataset.page !== 'home') return;

  const links = document.querySelectorAll('.nav__links a[data-section]');
  const sections = [...links]
    .map(a => document.getElementById(a.dataset.section))
    .filter(Boolean);

  if (!sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;
    const best = visible.reduce((a, b) =>
      a.intersectionRatio >= b.intersectionRatio ? a : b
    );
    setActiveSection(best.target.id);
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.12, 0.3, 0.5] });

  sections.forEach(s => obs.observe(s));

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    if (id === 'hero') setActiveSection('hero');
    else if (sections.some(s => s.id === id)) setActiveSection(id);
  } else if (window.scrollY < 120) {
    setActiveSection('hero');
  }
}

function initHashScroll() {
  if (document.body.dataset.page !== 'home' || !window.location.hash) return;
  const id = window.location.hash.slice(1);
  requestAnimationFrame(() => scrollToSection(id, window.location.hash));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    window.location.href = `mailto:maitresparrucchieri@gmail.com?subject=Contatto da sito&body=${encodeURIComponent('Nome: ' + fd.get('name') + '\nEmail: ' + fd.get('email') + '\n\n' + fd.get('message'))}`;
  });
}

function initShopPreview(containerId, limit = 6) {
  const el = document.getElementById(containerId);
  if (!el || typeof MAITRES === 'undefined') return;
  const featured = MAITRES.products.filter(p => ['Olaplex', 'Maria Nila', 'Alterna Caviar'].includes(p.brand)).slice(0, limit);
  el.innerHTML = featured.map(p => `
    <a href="shop.html" class="product-card product-card--sm">
      <div class="product-card__brand">${p.brand}</div>
      <div class="product-card__img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='assets/products/placeholder.svg'"></div>
      <h4>${p.name}</h4>
      <span class="product-card__price">${BookingUtils.formatPrice(p.price)}</span>
    </a>
  `).join('');
}
