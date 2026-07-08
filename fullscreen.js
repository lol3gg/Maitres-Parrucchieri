/* Toggle schermo intero — sito e admin */

const FS_KEY = 'maitres_fullscreen';
const fsButtons = new Set();
let fsReady = false;
let fsNavReady = false;
let fsNavBusy = false;

function isFs() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function fsWanted() {
  return sessionStorage.getItem(FS_KEY) === '1';
}

function setFsWanted(on) {
  if (on) sessionStorage.setItem(FS_KEY, '1');
  else sessionStorage.removeItem(FS_KEY);
}

function initFullscreen(btnId = 'fullscreenBtn') {
  const btn = document.getElementById(btnId);
  if (!btn || fsButtons.has(btn)) return;
  fsButtons.add(btn);

  const doc = document.documentElement;

  function toggleFs() {
    if (isFs()) {
      setFsWanted(false);
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      setFsWanted(true);
      (doc.requestFullscreen || doc.webkitRequestFullscreen)?.call(doc);
    }
  }

  function updateButtons() {
    const on = isFs();
    if (on) setFsWanted(true);
    else if (!fsNavBusy) setFsWanted(false);

    fsButtons.forEach(b => {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.title = on ? 'Esci da schermo intero' : 'Schermo intero';
      b.setAttribute('aria-label', b.title);
      b.classList.toggle('is-fullscreen', on);
      const expand = b.querySelector('.fs-icon--expand');
      const shrink = b.querySelector('.fs-icon--shrink');
      if (expand) expand.hidden = on;
      if (shrink) shrink.hidden = !on;
      const label = b.querySelector('.fs-fab__label');
      if (label) label.textContent = on ? 'Esci' : 'Schermo intero';
    });
  }

  btn.addEventListener('click', toggleFs);

  if (!fsReady) {
    fsReady = true;
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => {
      document.addEventListener(ev, updateButtons);
    });
    initFullscreenNav();
  }

  updateButtons();
}

function isInternalPageLink(a) {
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return false;
  try {
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    const path = url.pathname;
    return path.endsWith('.html') || path.endsWith('/') || !path.split('/').pop().includes('.');
  } catch {
    return false;
  }
}

function loadScriptFresh(src) {
  return new Promise((resolve, reject) => {
    const name = src.split('/').pop();
    document.querySelectorAll('script[src]').forEach(s => {
      if (s.getAttribute('src') === src || s.getAttribute('src')?.endsWith(name)) s.remove();
    });
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('script ' + src));
    document.body.appendChild(el);
  });
}

function rebindFullscreenUI() {
  fsButtons.clear();
  document.getElementById('fullscreenFab')?.remove();
  if (typeof window.injectFullscreenFab === 'function') window.injectFullscreenFab();
  initFullscreen('fullscreenBtn');
  initFullscreen('fullscreenFab');
}

async function softNavigate(url, { replaceHistory = false } = {}) {
  if (fsNavBusy) return;
  fsNavBusy = true;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const base = new URL(url, location.href);

    document.title = doc.title;
    [...document.body.attributes].forEach(attr => document.body.removeAttribute(attr.name));
    [...doc.body.attributes].forEach(attr => document.body.setAttribute(attr.name, attr.value));
    document.body.innerHTML = doc.body.innerHTML;

    const reloadAlways = /(?:^|\/?)(script|shop|booking)\.js$/;
    const skipIfLoaded = /(?:^|\/?)(data|storage|api-client|layout|fullscreen)\.js$/;

    for (const old of doc.querySelectorAll('body script')) {
      if (old.src) {
        const src = old.getAttribute('src');
        const name = src.split('/').pop();
        const loaded = [...document.querySelectorAll('script[src]')].some(s => {
          const v = s.getAttribute('src') || '';
          return v === src || v.endsWith('/' + name) || v === name;
        });
        if (reloadAlways.test(name) || (!loaded && !skipIfLoaded.test(name))) {
          await loadScriptFresh(src);
        }
      } else {
        const el = document.createElement('script');
        el.textContent = old.textContent;
        document.body.appendChild(el);
      }
    }

    if (replaceHistory) history.replaceState({ maitresSoft: true }, '', url);
    else history.pushState({ maitresSoft: true }, '', url);

    rebindFullscreenUI();

    const hash = base.hash;
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo(0, 0);
    }
  } catch {
    location.href = url;
  } finally {
    fsNavBusy = false;
  }
}

function initFullscreenNav() {
  if (fsNavReady) return;
  fsNavReady = true;

  document.addEventListener('click', e => {
    if (!fsWanted() && !isFs()) return;
    const a = e.target.closest('a[href]');
    if (!isInternalPageLink(a)) return;
    e.preventDefault();
    if (!fsWanted()) setFsWanted(true);
    softNavigate(a.href);
  }, true);

  window.addEventListener('popstate', () => {
    if (!fsWanted()) return;
    softNavigate(location.href, { replaceHistory: true });
  });
}

if (typeof module !== 'undefined') module.exports = { initFullscreen };
