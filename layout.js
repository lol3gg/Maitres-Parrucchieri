/* Layout condiviso — navigazione e footer unici su tutte le pagine */

const SITE = {
  /* Sezioni home (anchor) + Shop pagina separata */
  nav: [
    { href: '#about', label: 'Chi siamo', page: 'about', section: true },
    { href: '#servizi', label: 'Servizi', page: 'servizi', section: true },
    { href: '#staff', label: 'Staff', page: 'staff', section: true },
    { href: '#galleria', label: 'Galleria', page: 'galleria', section: true },
    { href: '#contatti', label: 'Contatti', page: 'contatti', section: true },
    { href: 'shop.html', label: 'Shop', page: 'shop', section: false }
  ],
  footer: [
    { href: '#about', label: 'Chi siamo', section: true },
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
      <a href="prenota.html" class="nav__book"><span>Prenota</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
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
    if (currentPage !== 'home') header.classList.add('scrolled');
  }
  if (footer) footer.innerHTML = buildFooter();
  if (breadcrumb && options.breadcrumb) breadcrumb.innerHTML = buildBreadcrumb(options.breadcrumb);

  initNavUI();
  initSectionSpy();
  initHashScroll();
}

function initNavUI() {
  const header = document.getElementById('header');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40 || document.body.dataset.page !== 'home');
    }, { passive: true });
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
          const el = document.getElementById(href.slice(1));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', href);
            setActiveSection(href.slice(1));
          }
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
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.05 });

  sections.forEach(s => obs.observe(s));

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    if (sections.some(s => s.id === id)) setActiveSection(id);
  }
}

function initHashScroll() {
  if (document.body.dataset.page !== 'home' || !window.location.hash) return;
  const id = window.location.hash.slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  });
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
