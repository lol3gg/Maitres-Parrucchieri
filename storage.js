/* Storage layer — pronto per integrazione web app / backend */

const STORAGE_KEYS = {
  appointments: 'maitres_appointments',
  cart: 'maitres_cart',
  orders: 'maitres_orders'
};

const MaitresStorage = {
  _read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },

  _write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('maitres-storage-update', { detail: { key } }));
  },

  /* ── Appuntamenti ── */
  getAppointments() {
    return this._read(STORAGE_KEYS.appointments);
  },

  saveAppointment(appointment) {
    const all = this.getAppointments();
    const entry = {
      id: 'apt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...appointment
    };
    all.unshift(entry);
    this._write(STORAGE_KEYS.appointments, all);
    return entry;
  },

  updateAppointment(id, updates) {
    const all = this.getAppointments().map(a => a.id === id ? { ...a, ...updates } : a);
    this._write(STORAGE_KEYS.appointments, all);
  },

  deleteAppointment(id) {
    this._write(STORAGE_KEYS.appointments, this.getAppointments().filter(a => a.id !== id));
  },

  exportAppointments() {
    return JSON.stringify(this.getAppointments(), null, 2);
  },

  importAppointments(json) {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) throw new Error('Formato non valido');
    this._write(STORAGE_KEYS.appointments, data);
  },

  /* ── Carrello shop ── */
  getCart() {
    return this._read(STORAGE_KEYS.cart);
  },

  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.productId === productId);
    if (existing) existing.qty += qty;
    else cart.push({ productId, qty });
    this._write(STORAGE_KEYS.cart, cart);
    return cart;
  },

  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) cart = cart.filter(i => i.productId !== productId);
    else cart = cart.map(i => i.productId === productId ? { ...i, qty } : i);
    this._write(STORAGE_KEYS.cart, cart);
    return cart;
  },

  clearCart() {
    this._write(STORAGE_KEYS.cart, []);
  },

  getCartTotal(products) {
    const cart = this.getCart();
    return cart.reduce((sum, item) => {
      const p = products.find(x => x.id === item.productId);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  /* ── Ordini shop ── */
  saveOrder(order) {
    const all = this._read(STORAGE_KEYS.orders);
    const entry = { id: 'ord_' + Date.now(), createdAt: new Date().toISOString(), status: 'pending', ...order };
    all.unshift(entry);
    this._write(STORAGE_KEYS.orders, all);
    return entry;
  },

  getOrders() {
    return this._read(STORAGE_KEYS.orders);
  }
};

/* Utility prenotazioni */
const BookingUtils = {
  formatDuration(min) {
    if (min < 60) return `${min}min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}min` : `${h}h`;
  },

  formatPrice(price) {
    if (price === null || price === 0) return 'Su richiesta';
    return '€' + price.toFixed(2).replace('.', ',');
  },

  getStaffName(id) {
    const s = MAITRES.staff.find(x => x.id === id);
    return s ? s.name : id;
  },

  getServiceById(id) {
    return MAITRES.services.find(s => s.id === id);
  },

  isSlotTaken(date, time, staffId, duration, excludeId) {
    const appointments = MaitresStorage.getAppointments().filter(a =>
      a.status !== 'cancelled' && a.date === date && a.id !== excludeId
    );

    const [h, m] = time.split(':').map(Number);
    const start = h * 60 + m;
    const end = start + duration;

    return appointments.some(apt => {
      if (staffId !== 'any' && apt.staffId !== 'any' && apt.staffId !== staffId) return false;
      const [ah, am] = apt.time.split(':').map(Number);
      const aStart = ah * 60 + am;
      const aEnd = aStart + (apt.duration || 60);
      return start < aEnd && end > aStart;
    });
  },

  generateTimeSlots(date, duration, staffId) {
    const day = new Date(date + 'T12:00:00').getDay();
    const hours = MAITRES.hours[day];
    if (!hours) return [];

    const slots = [];
    const [openH, openM] = hours.open.split(':').map(Number);
    const [closeH, closeM] = hours.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;

    for (let t = openMin; t + duration <= closeMin; t += 15) {
      const hh = String(Math.floor(t / 60)).padStart(2, '0');
      const mm = String(t % 60).padStart(2, '0');
      const time = `${hh}:${mm}`;
      if (!this.isSlotTaken(date, time, staffId, duration)) {
        slots.push(time);
      }
    }
    return slots;
  },

  getAvailableDates(count = 21) {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; dates.length < count; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const day = d.getDay();
      if (MAITRES.hours[day]) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  }
};
