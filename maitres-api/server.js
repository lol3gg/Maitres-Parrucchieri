const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 8787;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-key'] === config.adminKey) return next();
  res.status(401).json({ error: 'Non autorizzato' });
}

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function getActiveAppointments(excludeId) {
  return readJSON('appointments.json').filter(a =>
    a.status !== 'cancelled' && a.id !== excludeId
  );
}

function isSlotBlocked(date, time, duration, staffId, excludeId) {
  const start = parseTime(time);
  const end = start + duration;
  const appointments = getActiveAppointments(excludeId);
  const blocks = readJSON('blocks.json');

  for (const apt of appointments) {
    if (apt.date !== date) continue;
    if (staffId !== 'any' && apt.staffId !== 'any' && apt.staffId !== staffId) continue;
    const aStart = parseTime(apt.time);
    const aEnd = aStart + (apt.duration || 60);
    if (overlaps(start, end, aStart, aEnd)) return { blocked: true, reason: 'appointment', by: apt };
  }

  for (const block of blocks) {
    if (block.date !== date) continue;
    if (block.staffId !== 'all' && staffId !== 'any' && block.staffId !== staffId) continue;
    const bStart = parseTime(block.start);
    const bEnd = parseTime(block.end);
    if (overlaps(start, end, bStart, bEnd)) return { blocked: true, reason: 'block', by: block };
  }

  return { blocked: false };
}

function generateSlots(date, duration, staffId, excludeId) {
  const day = new Date(date + 'T12:00:00').getDay();
  const hours = config.hours[day];
  if (!hours) return [];

  const slots = [];
  const openMin = parseTime(hours.open);
  const closeMin = parseTime(hours.close);

  for (let t = openMin; t + duration <= closeMin; t += 15) {
    const hh = String(Math.floor(t / 60)).padStart(2, '0');
    const mm = String(t % 60).padStart(2, '0');
    const time = `${hh}:${mm}`;
    if (!isSlotBlocked(date, time, duration, staffId, excludeId).blocked) {
      slots.push(time);
    }
  }
  return slots;
}

function getAvailableDates(count = 21) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; dates.length < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (config.hours[d.getDay()]) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
}

/* ── Public ── */
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'maitres-api' }));

app.get('/api/config', (_, res) => {
  res.json({
    hours: config.hours,
    staff: config.staff,
    services: config.services
  });
});

app.get('/api/slots', (req, res) => {
  const { date, duration, staffId = 'any' } = req.query;
  if (!date || !duration) return res.status(400).json({ error: 'date e duration richiesti' });
  res.json({ slots: generateSlots(date, +duration, staffId) });
});

app.get('/api/dates', (_, res) => {
  res.json({ dates: getAvailableDates() });
});

app.post('/api/appointments', (req, res) => {
  const body = req.body;
  if (!body.serviceId || !body.date || !body.time || !body.staffId || !body.clientName || !body.clientPhone) {
    return res.status(400).json({ error: 'Dati incompleti' });
  }

  const service = config.services.find(s => s.id === body.serviceId);
  if (!service) return res.status(400).json({ error: 'Servizio non valido' });

  const duration = body.duration || service.duration;
  const check = isSlotBlocked(body.date, body.time, duration, body.staffId);
  if (check.blocked) {
    return res.status(409).json({ error: 'Slot non disponibile', detail: check.reason });
  }

  const all = readJSON('appointments.json');
  const entry = {
    id: 'apt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: body.source || 'website',
    serviceId: body.serviceId,
    serviceName: body.serviceName || service.name,
    price: body.price ?? service.price,
    duration,
    staffId: body.staffId,
    staffName: body.staffName || config.staff.find(s => s.id === body.staffId)?.name || body.staffId,
    date: body.date,
    time: body.time,
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    clientEmail: body.clientEmail || '',
    notes: body.notes || ''
  };

  all.unshift(entry);
  writeJSON('appointments.json', all);
  res.status(201).json(entry);
});

app.post('/api/orders', (req, res) => {
  const body = req.body;
  if (!body.clientName || !body.items?.length) {
    return res.status(400).json({ error: 'Ordine incompleto' });
  }
  const all = readJSON('orders.json');
  const entry = {
    id: 'ord_' + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...body
  };
  all.unshift(entry);
  writeJSON('orders.json', all);
  res.status(201).json(entry);
});

/* ── Admin auth ── */
app.post('/api/admin/login', (req, res) => {
  if (req.body.pin === config.adminPin) {
    return res.json({ ok: true, key: config.adminKey });
  }
  res.status(401).json({ error: 'PIN errato' });
});

/* ── Admin routes ── */
app.get('/api/admin/stats', requireAdmin, (_, res) => {
  const appointments = readJSON('appointments.json');
  const orders = readJSON('orders.json');
  const today = new Date().toISOString().split('T')[0];

  const todayApts = appointments.filter(a => a.date === today && a.status !== 'cancelled');
  const pending = appointments.filter(a => a.status === 'pending');
  const confirmed = appointments.filter(a => a.status === 'confirmed');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  res.json({
    todayCount: todayApts.length,
    pendingCount: pending.length,
    confirmedCount: confirmed.length,
    totalAppointments: appointments.length,
    pendingOrders: pendingOrders.length,
    totalOrders: orders.length,
    todayAppointments: todayApts
  });
});

app.get('/api/admin/appointments', requireAdmin, (req, res) => {
  let list = readJSON('appointments.json');
  const { date, status, staffId } = req.query;
  if (date) list = list.filter(a => a.date === date);
  if (status) list = list.filter(a => a.status === status);
  if (staffId) list = list.filter(a => a.staffId === staffId || a.staffId === 'any');
  res.json(list);
});

app.post('/api/admin/appointments', requireAdmin, (req, res) => {
  const body = req.body;
  const duration = body.duration || 60;
  const check = isSlotBlocked(body.date, body.time, duration, body.staffId);
  if (check.blocked) return res.status(409).json({ error: 'Slot occupato' });

  const all = readJSON('appointments.json');
  const entry = {
    id: 'apt_' + Date.now(),
    status: body.status || 'confirmed',
    createdAt: new Date().toISOString(),
    source: 'admin',
    ...body,
    duration
  };
  all.unshift(entry);
  writeJSON('appointments.json', all);
  res.status(201).json(entry);
});

app.patch('/api/admin/appointments/:id', requireAdmin, (req, res) => {
  const all = readJSON('appointments.json');
  const idx = all.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Non trovato' });

  const updated = { ...all[idx], ...req.body, updatedAt: new Date().toISOString() };

  if (req.body.date || req.body.time || req.body.staffId || req.body.duration) {
    const check = isSlotBlocked(updated.date, updated.time, updated.duration, updated.staffId, updated.id);
    if (check.blocked && updated.status !== 'cancelled') {
      return res.status(409).json({ error: 'Slot occupato' });
    }
  }

  all[idx] = updated;
  writeJSON('appointments.json', all);
  res.json(updated);
});

app.delete('/api/admin/appointments/:id', requireAdmin, (req, res) => {
  const all = readJSON('appointments.json').filter(a => a.id !== req.params.id);
  writeJSON('appointments.json', all);
  res.json({ ok: true });
});

app.get('/api/admin/orders', requireAdmin, (_, res) => {
  res.json(readJSON('orders.json'));
});

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const all = readJSON('orders.json');
  const idx = all.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Non trovato' });
  all[idx] = { ...all[idx], ...req.body };
  writeJSON('orders.json', all);
  res.json(all[idx]);
});

app.get('/api/admin/blocks', requireAdmin, (_, res) => {
  res.json(readJSON('blocks.json'));
});

app.post('/api/admin/blocks', requireAdmin, (req, res) => {
  const { date, start, end, staffId = 'all', reason = '' } = req.body;
  if (!date || !start || !end) return res.status(400).json({ error: 'Data e orari richiesti' });
  const all = readJSON('blocks.json');
  const entry = {
    id: 'blk_' + Date.now(),
    date, start, end, staffId, reason,
    createdAt: new Date().toISOString()
  };
  all.push(entry);
  writeJSON('blocks.json', all);
  res.status(201).json(entry);
});

app.delete('/api/admin/blocks/:id', requireAdmin, (req, res) => {
  const all = readJSON('blocks.json').filter(b => b.id !== req.params.id);
  writeJSON('blocks.json', all);
  res.json({ ok: true });
});

app.get('/api/admin/clients', requireAdmin, (_, res) => {
  const appointments = readJSON('appointments.json');
  const map = new Map();
  for (const a of appointments) {
    const key = a.clientPhone || a.clientName;
    if (!map.has(key)) {
      map.set(key, {
        name: a.clientName,
        phone: a.clientPhone,
        email: a.clientEmail,
        visits: 0,
        lastVisit: null
      });
    }
    const c = map.get(key);
    c.visits++;
    if (!c.lastVisit || a.date > c.lastVisit) c.lastVisit = a.date;
  }
  res.json([...map.values()].sort((a, b) => (b.lastVisit || '').localeCompare(a.lastVisit || '')));
});

app.listen(PORT, () => {
  console.log(`MAÎTRES API → http://localhost:${PORT}`);
  console.log(`PIN admin: ${config.adminPin}`);
});
