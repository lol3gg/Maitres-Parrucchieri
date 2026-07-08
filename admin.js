/* Admin dashboard */
(function () {
  let statusFilter = 'all';

  const appointmentsBody = document.getElementById('appointmentsBody');
  const ordersBody = document.getElementById('ordersBody');
  const adminStats = document.getElementById('adminStats');
  const apiSchema = document.getElementById('apiSchema');

  function renderStats() {
    const apts = MaitresStorage.getAppointments();
    const orders = MaitresStorage.getOrders();
    const pending = apts.filter(a => a.status === 'pending').length;
    const today = new Date().toISOString().split('T')[0];
    const todayApts = apts.filter(a => a.date === today && a.status !== 'cancelled').length;

    adminStats.innerHTML = `
      <div class="admin-stat"><span class="admin-stat__n">${apts.length}</span><span>Appuntamenti totali</span></div>
      <div class="admin-stat"><span class="admin-stat__n">${pending}</span><span>In attesa</span></div>
      <div class="admin-stat"><span class="admin-stat__n">${todayApts}</span><span>Oggi</span></div>
      <div class="admin-stat"><span class="admin-stat__n">${orders.length}</span><span>Ordini shop</span></div>
    `;
  }

  function renderAppointments() {
    let apts = MaitresStorage.getAppointments();
    if (statusFilter !== 'all') apts = apts.filter(a => a.status === statusFilter);

    if (!apts.length) {
      appointmentsBody.innerHTML = '<tr><td colspan="7" class="admin-empty">Nessun appuntamento. Le prenotazioni dal sito compariranno qui.</td></tr>';
      return;
    }

    appointmentsBody.innerHTML = apts.map(a => `
      <tr data-id="${a.id}">
        <td>
          <strong>${new Date(a.date + 'T12:00:00').toLocaleDateString('it-IT')}</strong><br>
          ${a.time}
        </td>
        <td>
          <strong>${a.clientName}</strong><br>
          <a href="tel:${a.clientPhone}">${a.clientPhone}</a>
          ${a.clientEmail ? `<br><small>${a.clientEmail}</small>` : ''}
          ${a.notes ? `<br><em>${a.notes}</em>` : ''}
        </td>
        <td>${a.serviceName}<br><small>${BookingUtils.formatDuration(a.duration)}</small></td>
        <td>${a.staffName}</td>
        <td>${BookingUtils.formatPrice(a.price)}</td>
        <td><span class="status-badge status-${a.status}">${labelStatus(a.status)}</span></td>
        <td class="admin-actions-cell">
          ${a.status === 'pending' ? `<button class="btn-xs confirm" data-id="${a.id}">✓</button>` : ''}
          ${a.status !== 'cancelled' ? `<button class="btn-xs cancel" data-id="${a.id}">✕</button>` : ''}
          <button class="btn-xs delete" data-id="${a.id}">🗑</button>
        </td>
      </tr>
    `).join('');

    appointmentsBody.querySelectorAll('.confirm').forEach(b =>
      b.addEventListener('click', () => { MaitresStorage.updateAppointment(b.dataset.id, { status: 'confirmed' }); refresh(); })
    );
    appointmentsBody.querySelectorAll('.cancel').forEach(b =>
      b.addEventListener('click', () => { MaitresStorage.updateAppointment(b.dataset.id, { status: 'cancelled' }); refresh(); })
    );
    appointmentsBody.querySelectorAll('.delete').forEach(b =>
      b.addEventListener('click', () => { if (confirm('Eliminare?')) { MaitresStorage.deleteAppointment(b.dataset.id); refresh(); } })
    );
  }

  function renderOrders() {
    const orders = MaitresStorage.getOrders();
    if (!orders.length) {
      ordersBody.innerHTML = '<tr><td colspan="5" class="admin-empty">Nessun ordine shop.</td></tr>';
      return;
    }

    ordersBody.innerHTML = orders.map(o => `
      <tr>
        <td>${new Date(o.createdAt).toLocaleString('it-IT')}</td>
        <td><strong>${o.clientName}</strong><br>${o.clientPhone}</td>
        <td>${o.items.map(i => `${i.name} ×${i.qty}`).join('<br>')}</td>
        <td>${BookingUtils.formatPrice(o.total)}</td>
        <td><span class="status-badge status-${o.status}">${labelStatus(o.status)}</span></td>
      </tr>
    `).join('');
  }

  function labelStatus(s) {
    return { pending: 'In attesa', confirmed: 'Confermato', cancelled: 'Cancellato' }[s] || s;
  }

  function refresh() {
    renderStats();
    renderAppointments();
    renderOrders();
  }

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)).classList.add('active');
    });
  });

  // Filters
  document.querySelectorAll('.admin-filters .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-filters .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      statusFilter = btn.dataset.status;
      renderAppointments();
    });
  });

  document.getElementById('btnRefresh').addEventListener('click', refresh);

  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([MaitresStorage.exportAppointments()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'maitres-appuntamenti-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
  });

  document.getElementById('btnImport').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        MaitresStorage.importAppointments(reader.result);
        refresh();
        alert('Import completato');
      } catch { alert('File non valido'); }
    };
    reader.readAsText(file);
  });

  apiSchema.textContent = JSON.stringify({
    id: 'apt_xxx',
    status: 'pending|confirmed|cancelled',
    serviceId: 'taglio-piega',
    serviceName: 'Taglio Donna + Piega liscia',
    price: 70,
    duration: 75,
    staffId: 'arti',
    staffName: 'Arti',
    date: '2026-07-15',
    time: '10:00',
    clientName: 'Maria Rossi',
    clientPhone: '+39 333 1234567',
    clientEmail: '',
    notes: '',
    createdAt: 'ISO8601'
  }, null, 2);

  window.addEventListener('maitres-storage-update', refresh);
  window.addEventListener('storage', refresh);

  refresh();
})();
