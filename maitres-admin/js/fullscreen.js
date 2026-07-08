/* Toggle schermo intero — admin */
function initFullscreen(btnId = 'fullscreenBtn') {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const doc = document.documentElement;
  const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const updateBtn = () => {
    const on = isFs();
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'Esci da schermo intero' : 'Schermo intero';
    btn.classList.toggle('is-fullscreen', on);
    const expand = btn.querySelector('.fs-icon--expand');
    const shrink = btn.querySelector('.fs-icon--shrink');
    if (expand) expand.hidden = on;
    if (shrink) shrink.hidden = !on;
  };
  btn.addEventListener('click', () => {
    if (isFs()) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    else (doc.requestFullscreen || doc.webkitRequestFullscreen)?.call(doc);
  });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, updateBtn));
  updateBtn();
}
