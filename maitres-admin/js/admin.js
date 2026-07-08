/* MAÎTRES Admin Dashboard */

const STATUS_LABELS = {
  pending: { label: 'In attesa', cls: 'badge--pending' },
  confirmed: { label: 'Confermato', cls: 'badge--confirmed' },
  completed: { label: 'Completato', cls: 'badge--done' },
  cancelled: { label: 'Annullato', cls: 'badge--cancel' },
  no_show: { label: 'No show', cls: 'badge--cancel' }
};

let CONFIG = { services: [], staff: [], hours: {} };
let currentView = 'dashboard';
let selectedDate = new Date().toISOString().split('T')[0];

async function init() {
  if (!API.isLogged()) {
    window.location.href = 'login.html';
    return;
  }
  try {
    CONFIG = await API.config();
  } catch (e) {
    alert('API non raggiungibile. Avvia maitres-api su porta 8787.');
  }
  bindNav();
  await renderView('dashboard');
  setInterval(refreshCurrentView, 30000);
}

function bindNav() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderView(btn.dataset.view);
    });
  });
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    API.logout();
    window.location.href = 'login.html';
  });
  document.getElementById('refreshBtn')?.addEventListener('click', refreshCurrentView);
}

async function refreshCurrentView() {
  await renderView(currentView);
}

async function renderView(view) {
  currentView = view;
  const main = document.getElementById('mainContent');
  main.innerHTML = '<div class="loading">Caricamento...</div>';

  try {
    switch (view) {
      case 'dashboard': main.innerHTML = await renderDashboard(); bindDashboard(); break;
      case 'agenda': main.innerHTML = await renderAgenda(); bindAgenda(); break;
      case 'appointments': main.innerHTML = await renderAppointments(); bindAppointments(); break;
      case 'new': main.innerHTML = renderNewBooking(); bindNewBooking(); break;
      case 'blocks': main.innerHTML = await renderBlocks(); bindBlocks(); break;
      case 'orders': main.innerHTML = await renderOrders(); bindOrders(); break;
      case 'clients': main.innerHTML = await renderClients(); break;
      case 'staff': main.innerHTML = renderStaffView(); break;
    }
  } catch (e) {
    main.innerHTML = `<div class="error-box">${e.message}</div>`;
  }
}

function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
}

function fmtPrice(p) {
  if (p == null) return '—';
  return '€' + Number(p).toFixed(2).replace('.', ',');
}

function statusBadge(s) {
  const st = STATUS_LABELS[s] || { label: s, cls: '' };
  return `<span class="badge ${st.cls}">${st.label}</span>`;
}

async function renderDashboard() {
  const stats = await API.stats();
  return `
    <div class="page-head">
      <h1>Dashboard</h1>
      <p>Panoramica salone · ${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card stat-card--pink"><span class="stat-card__n">${stats.todayCount}</span><span class="stat-card__l">Oggi</span></div>
      <div class="stat-card"><span class="stat-card__n">${stats.pendingCount}</span><span class="stat-card__l">In attesa</span></div>
      <div class="stat-card"><span class="stat-card__n">${stats.confirmedCount}</span><span class="stat-card__l">Confermati</span></div>
      <div class="stat-card"><span class="stat-card__n">${stats.pendingOrders}</span><span class="stat-card__l">Ordini shop</span></div>
    </div>
    <section class="panel">
      <div class="panel__head"><h2>Appuntamenti di oggi</h2></div>
      <div class="panel__body">
        ${stats.todayAppointments.length ? stats.todayAppointments.map(a => aptRow(a, true)).join('') : '<p class="empty">Nessun appuntamento oggi</p>'}
      </div>
    </section>
  `;
}

function bindDashboard() {
  bindAptActions();
}

function aptRow(a, compact) {
  return `
    <div class="apt-row" data-id="${a.id}">
      <div class="apt-row__time">${a.time}</div>
      <div class="apt-row__info">
        <strong>${a.clientName}</strong>
        <span>${a.serviceName} · ${a.staffName}</span>
        ${!compact ? `<small>${a.clientPhone}${a.clientEmail ? ' · ' + a.clientEmail : ''}</small>` : ''}
      </div>
      <div class="apt-row__status">${statusBadge(a.status)}</div>
      <div class="apt-row__actions">
        ${a.status === 'pending' ? `<button class="btn-sm btn-confirm" data-action="confirm" data-id="${a.id}">✓</button>` : ''}
        ${a.status !== 'cancelled' ? `<button class="btn-sm btn-cancel" data-action="cancel" data-id="${a.id}">✕</button>` : ''}
      </div>
    </div>
  `;
}

async function renderAgenda() {
  const apts = await API.appointments(`?date=${selectedDate}`);
  apts.sort((a, b) => a.time.localeCompare(b.time));

  const dates = [];
  const today = new Date();
  for (let i = -2; i < 12; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    if (CONFIG.hours[d.getDay()] || i <= 0) dates.push(iso);
  }

  return `
    <div class="page-head">
      <h1>Agenda</h1>
      <div class="date-strip">${dates.map(d =>
        `<button class="date-chip ${d === selectedDate ? 'active' : ''}" data-date="${d}">${fmtDate(d)}</button>`
      ).join('')}</div>
    </div>
    <div class="agenda-grid">
      ${CONFIG.staff.filter(s => s.id !== 'any').map(s => `
        <div class="agenda-col">
          <h3>${s.name}</h3>
          <div class="agenda-slots">
            ${apts.filter(a => a.staffId === s.id || a.staffId === 'any').map(a => `
              <div class="agenda-slot agenda-slot--${a.status}">
                <span class="agenda-slot__time">${a.time}</span>
                <strong>${a.clientName}</strong>
                <small>${a.serviceName}</small>
              </div>
            `).join('') || '<p class="empty-sm">Libero</p>'}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function bindAgenda() {
  document.querySelectorAll('.date-chip').forEach(btn => {
    btn.addEventListener('click', async () => {
      selectedDate = btn.dataset.date;
      await renderView('agenda');
    });
  });
}

async function renderAppointments() {
  const apts = await API.appointments();
  return `
    <div class="page-head"><h1>Tutti gli appuntamenti</h1></div>
    <div class="filters">
      <select id="filterStatus">
        <option value="">Tutti gli stati</option>
        <option value="pending">In attesa</option>
        <option value="confirmed">Confermati</option>
        <option value="completed">Completati</option>
        <option value="cancelled">Annullati</option>
      </select>
    </div>
    <div class="panel"><div class="panel__body" id="aptList">
      ${apts.map(a => aptRow(a)).join('') || '<p class="empty">Nessun appuntamento</p>'}
    </div></div>
  `;
}

function bindAppointments() {
  document.getElementById('filterStatus')?.addEventListener('change', async (e) => {
    const q = e.target.value ? `?status=${e.target.value}` : '';
    const apts = await API.appointments(q);
    document.getElementById('aptList').innerHTML = apts.map(a => aptRow(a)).join('') || '<p class="empty">Nessun appuntamento</p>';
    bindAptActions();
  });
  bindAptActions();
}

function bindAptActions() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.dataset.action === 'confirm') await API.updateAppointment(id, { status: 'confirmed' });
      if (btn.dataset.action === 'cancel') await API.updateAppointment(id, { status: 'cancelled' });
      await refreshCurrentView();
    });
  });
}

function renderNewBooking() {
  return `
    <div class="page-head"><h1>Nuovo appuntamento</h1><p>Inserimento manuale dal salone</p></div>
    <form class="admin-form" id="newAptForm">
      <label>Cliente<input name="clientName" required placeholder="Nome cognome"></label>
      <label>Telefono<input name="clientPhone" required placeholder="+39 ..."></label>
      <label>Email<input name="clientEmail" type="email" placeholder="opzionale"></label>
      <label>Servizio<select name="serviceId" required>
        ${CONFIG.services.map(s => `<option value="${s.id}" data-duration="${s.duration}">${s.name} (${s.duration}min)</option>`).join('')}
      </select></label>
      <label>Operatore<select name="staffId" required>
        ${CONFIG.staff.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select></label>
      <label>Data<input name="date" type="date" required></label>
      <label>Ora<select name="time" id="slotSelect" required><option value="">Seleziona data e servizio</option></select></label>
      <label>Note<textarea name="notes" rows="2"></textarea></label>
      <button type="submit" class="btn-primary">Salva appuntamento</button>
    </form>
  `;
}

function bindNewBooking() {
  const form = document.getElementById('newAptForm');
  const slotSelect = document.getElementById('slotSelect');

  async function loadSlots() {
    const fd = new FormData(form);
    const date = fd.get('date');
    const serviceId = fd.get('serviceId');
    const staffId = fd.get('staffId');
    const service = CONFIG.services.find(s => s.id === serviceId);
    if (!date || !service) return;

    slotSelect.innerHTML = '<option>Caricamento...</option>';
    try {
      const { slots } = await API.slots(date, service.duration, staffId);
      slotSelect.innerHTML = slots.length
        ? slots.map(t => `<option value="${t}">${t}</option>`).join('')
        : '<option value="">Nessuno slot libero</option>';
    } catch {
      slotSelect.innerHTML = '<option value="">Errore caricamento</option>';
    }
  }

  form.date.addEventListener('change', loadSlots);
  form.serviceId.addEventListener('change', loadSlots);
  form.staffId.addEventListener('change', loadSlots);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const service = CONFIG.services.find(s => s.id === fd.get('serviceId'));
    const staff = CONFIG.staff.find(s => s.id === fd.get('staffId'));
    try {
      await API.createAppointment({
        serviceId: fd.get('serviceId'),
        serviceName: service.name,
        duration: service.duration,
        price: service.price,
        staffId: fd.get('staffId'),
        staffName: staff.name,
        date: fd.get('date'),
        time: fd.get('time'),
        clientName: fd.get('clientName'),
        clientPhone: fd.get('clientPhone'),
        clientEmail: fd.get('clientEmail'),
        notes: fd.get('notes'),
        status: 'confirmed'
      });
      alert('Appuntamento creato!');
      form.reset();
      await renderView('agenda');
      document.querySelector('[data-view="agenda"]').click();
    } catch (err) {
      alert(err.message);
    }
  });
}

async function renderBlocks() {
  const blocks = await API.blocks();
  return `
    <div class="page-head"><h1>Blocchi orari</h1><p>Chiudi slot per pausa, ferie o assenza staff</p></div>
    <form class="admin-form admin-form--inline" id="blockForm">
      <label>Data<input name="date" type="date" required></label>
      <label>Dalle<input name="start" type="time" required value="13:00"></label>
      <label>Alle<input name="end" type="time" required value="14:00"></label>
      <label>Staff<select name="staffId">
        <option value="all">Tutti</option>
        ${CONFIG.staff.filter(s => s.id !== 'any').map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select></label>
      <label>Motivo<input name="reason" placeholder="Pausa pranzo..."></label>
      <button type="submit" class="btn-primary">Blocca</button>
    </form>
    <div class="panel"><div class="panel__body">
      ${blocks.length ? blocks.map(b => `
        <div class="block-row">
          <strong>${fmtDate(b.date)} ${b.start}–${b.end}</strong>
          <span>${b.staffId === 'all' ? 'Tutti' : b.staffId} · ${b.reason || '—'}</span>
          <button class="btn-sm btn-cancel" data-block="${b.id}">✕</button>
        </div>
      `).join('') : '<p class="empty">Nessun blocco attivo</p>'}
    </div></div>
  `;
}

function bindBlocks() {
  document.getElementById('blockForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await API.createBlock(Object.fromEntries(fd));
    await renderView('blocks');
    document.querySelector('[data-view="blocks"]').classList.add('active');
  });
  document.querySelectorAll('[data-block]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await API.deleteBlock(btn.dataset.block);
      await renderView('blocks');
    });
  });
}

async function renderOrders() {
  const orders = await API.orders();
  return `
    <div class="page-head"><h1>Ordini Shop</h1></div>
    <div class="panel"><div class="panel__body">
      ${orders.length ? orders.map(o => `
        <div class="order-row">
          <div><strong>${o.clientName}</strong> · ${o.clientPhone || ''}<br>
          <small>${new Date(o.createdAt).toLocaleString('it-IT')} · ${fmtPrice(o.total)}</small></div>
          <div>${(o.items || []).map(i => `${i.name || 'Prodotto'} ×${i.qty}`).join(', ')}</div>
          <div>${statusBadge(o.status === 'pending' ? 'pending' : 'confirmed')}</div>
          ${o.status === 'pending' ? `<button class="btn-sm btn-confirm" data-order="${o.id}">Gestito</button>` : ''}
        </div>
      `).join('') : '<p class="empty">Nessun ordine</p>'}
    </div></div>
  `;
}

function bindOrders() {
  document.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await API.updateOrder(btn.dataset.order, { status: 'completed' });
      await renderView('orders');
    });
  });
}

async function renderClients() {
  const clients = await API.clients();
  return `
    <div class="page-head"><h1>Clienti</h1></div>
    <div class="panel"><div class="panel__body">
      <table class="data-table">
        <thead><tr><th>Nome</th><th>Telefono</th><th>Visite</th><th>Ultima</th></tr></thead>
        <tbody>${clients.map(c => `
          <tr><td>${c.name}</td><td>${c.phone}</td><td>${c.visits}</td><td>${c.lastVisit ? fmtDate(c.lastVisit) : '—'}</td></tr>
        `).join('')}</tbody>
      </table>
    </div></div>
  `;
}

function renderStaffView() {
  return `
    <div class="page-head"><h1>Staff</h1></div>
    <div class="staff-admin-grid">
      ${CONFIG.staff.filter(s => s.id !== 'any').map(s => `
        <div class="staff-admin-card">
          <div class="staff-admin-card__ring">${s.name.charAt(0)}</div>
          <h3>${s.name}</h3>
          <p>${s.role}</p>
        </div>
      `).join('')}
    </div>
    <p class="hint">Orari salone: Mar–Sab 09:00–19:00 · Dom Lun chiuso</p>
  `;
}

document.addEventListener('DOMContentLoaded', init);
