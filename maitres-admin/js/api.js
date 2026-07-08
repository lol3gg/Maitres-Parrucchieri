const API = (() => {
  const BASE = localStorage.getItem('maitres_api') || 'http://localhost:8787';
  const KEY = 'maitres_admin_key';
  /* Demo locale: login senza dipendere dall'API (riavvio server non necessario) */
  const DEMO = true;
  const DEMO_KEY = 'maitres-admin-secret-key';

  function headers(admin = false) {
    const h = { 'Content-Type': 'application/json' };
    if (admin) {
      const k = sessionStorage.getItem(KEY);
      if (k) h['X-Admin-Key'] = k;
    }
    return h;
  }

  async function req(path, opts = {}) {
    const res = await fetch(BASE + path, {
      ...opts,
      headers: { ...headers(opts.admin), ...opts.headers }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Errore server');
    return data;
  }

  return {
    base: BASE,
    login(pin) {
      const p = String(pin || '').trim();
      if (!p) return Promise.reject(new Error('Inserisci un codice'));
      if (DEMO) {
        return Promise.resolve({ ok: true, key: DEMO_KEY, demo: true });
      }
      return req('/api/admin/login', { method: 'POST', body: JSON.stringify({ pin: p }) });
    },
    setKey(key) { sessionStorage.setItem(KEY, key); },
    logout() { sessionStorage.removeItem(KEY); },
    isLogged() { return !!sessionStorage.getItem(KEY); },

    stats: () => req('/api/admin/stats', { admin: true }),
    appointments: (q = '') => req('/api/admin/appointments' + q, { admin: true }),
    createAppointment: (body) => req('/api/admin/appointments', { method: 'POST', admin: true, body: JSON.stringify(body) }),
    updateAppointment: (id, body) => req('/api/admin/appointments/' + id, { method: 'PATCH', admin: true, body: JSON.stringify(body) }),
    deleteAppointment: (id) => req('/api/admin/appointments/' + id, { method: 'DELETE', admin: true }),

    orders: () => req('/api/admin/orders', { admin: true }),
    updateOrder: (id, body) => req('/api/admin/orders/' + id, { method: 'PATCH', admin: true, body: JSON.stringify(body) }),

    blocks: () => req('/api/admin/blocks', { admin: true }),
    createBlock: (body) => req('/api/admin/blocks', { method: 'POST', admin: true, body: JSON.stringify(body) }),
    deleteBlock: (id) => req('/api/admin/blocks/' + id, { method: 'DELETE', admin: true }),

    clients: () => req('/api/admin/clients', { admin: true }),
    config: () => req('/api/config'),
    slots: (date, duration, staffId) => req(`/api/slots?date=${date}&duration=${duration}&staffId=${staffId}`)
  };
})();
