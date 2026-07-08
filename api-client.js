/* Client API — collegamento sito ↔ maitres-api */

const MaitresAPI = (() => {
  const BASE = window.MAITRES_API_URL ||
    ((location.hostname === 'localhost' || location.hostname === '127.0.0.1')
      ? 'http://localhost:8787'
      : null);

  const enabled = !!BASE;

  async function req(path, opts = {}) {
    if (!enabled) throw new Error('API non configurata');
    const res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Errore API');
    return data;
  }

  return {
    enabled,
    base: BASE,

    async health() {
      if (!enabled) return false;
      try {
        await req('/api/health');
        return true;
      } catch { return false; }
    },

    getSlots(date, duration, staffId) {
      return req(`/api/slots?date=${date}&duration=${duration}&staffId=${staffId || 'any'}`);
    },

    createAppointment(data) {
      return req('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ ...data, source: 'website' })
      });
    },

    createOrder(data) {
      return req('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  };
})();
