/* Booking wizard */
(function () {
  if (!document.getElementById('bookingWizard')) return;

  const state = {
    step: 1,
    serviceId: null,
    staffId: null,
    date: null,
    time: null,
    client: {}
  };

  const els = {
    steps: document.querySelectorAll('.booking-step'),
    progress: document.querySelectorAll('.booking-progress__step'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    nav: document.getElementById('bookingNav'),
    serviceFilters: document.getElementById('serviceFilters'),
    serviceList: document.getElementById('serviceList'),
    staffList: document.getElementById('staffList'),
    dateList: document.getElementById('dateList'),
    timeList: document.getElementById('timeList'),
    clientForm: document.getElementById('clientForm'),
    sidebar: document.getElementById('sidebarSummary'),
    successSummary: document.getElementById('successSummary'),
    newBooking: document.getElementById('newBooking')
  };

  function renderFilters() {
    els.serviceFilters.innerHTML = MAITRES.serviceCategories.map(c =>
      `<button type="button" class="filter-chip ${c.id === 'donna' ? 'active' : ''}" data-cat="${c.id}">${c.icon} ${c.label}</button>`
    ).join('');

    els.serviceFilters.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        els.serviceFilters.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderServices(btn.dataset.cat);
      });
    });
  }

  function renderServices(category) {
    const services = MAITRES.services.filter(s => s.category === category);
    els.serviceList.innerHTML = services.map(s => `
      <button type="button" class="service-pick ${state.serviceId === s.id ? 'selected' : ''}" data-id="${s.id}">
        <div class="service-pick__top">
          <span class="service-pick__cat">${s.short}</span>
          <span class="service-pick__price">${BookingUtils.formatPrice(s.price)}</span>
        </div>
        <h4>${s.name}</h4>
        <span class="service-pick__dur">${BookingUtils.formatDuration(s.duration)}</span>
        ${s.note ? `<p class="service-pick__note">${s.note}</p>` : ''}
      </button>
    `).join('');

    els.serviceList.querySelectorAll('.service-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        state.serviceId = btn.dataset.id;
        state.staffId = null;
        state.date = null;
        state.time = null;
        renderServices(category);
        renderStaff();
        updateSidebar();
      });
    });
  }

  function renderStaff() {
    const service = BookingUtils.getServiceById(state.serviceId);
    if (!service) return;

    const available = MAITRES.staff.filter(s =>
      s.id === 'any' || service.staff.includes(s.id)
    );

    els.staffList.innerHTML = available.map(s => `
      <button type="button" class="staff-pick ${state.staffId === s.id ? 'selected' : ''}" data-id="${s.id}">
        <span class="staff-pick__initial">${s.name.charAt(0)}</span>
        <div>
          <strong>${s.name}</strong>
          <span>${s.role}</span>
        </div>
      </button>
    `).join('');

    els.staffList.querySelectorAll('.staff-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        state.staffId = btn.dataset.id;
        state.date = null;
        state.time = null;
        renderStaff();
        renderDates();
        updateSidebar();
      });
    });
  }

  function renderDates() {
    const dates = BookingUtils.getAvailableDates();
    els.dateList.innerHTML = dates.map(d => {
      const dt = new Date(d + 'T12:00:00');
      const label = dt.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
      return `<button type="button" class="date-pick ${state.date === d ? 'selected' : ''}" data-date="${d}">${label}</button>`;
    }).join('');

    els.dateList.querySelectorAll('.date-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        state.date = btn.dataset.date;
        state.time = null;
        renderDates();
        renderTimes();
        updateSidebar();
      });
    });
  }

  function renderTimes() {
    const service = BookingUtils.getServiceById(state.serviceId);
    if (!state.date || !service || !state.staffId) {
      els.timeList.innerHTML = '<p class="booking-hint">Seleziona data e operatore</p>';
      return;
    }

    const slots = BookingUtils.generateTimeSlots(state.date, service.duration, state.staffId);

    if (!slots.length) {
      els.timeList.innerHTML = '<p class="booking-hint">Nessuno slot disponibile. Prova un\'altra data.</p>';
      return;
    }

    els.timeList.innerHTML = slots.map(t =>
      `<button type="button" class="time-pick ${state.time === t ? 'selected' : ''}" data-time="${t}">${t}</button>`
    ).join('');

    els.timeList.querySelectorAll('.time-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        state.time = btn.dataset.time;
        renderTimes();
        updateSidebar();
      });
    });
  }

  function updateSidebar() {
    const service = BookingUtils.getServiceById(state.serviceId);
    if (!service) {
      els.sidebar.innerHTML = '<p class="sidebar-empty">Seleziona un servizio per iniziare</p>';
      return;
    }

    els.sidebar.innerHTML = `
      <div class="sidebar-item"><span>Servizio</span><strong>${service.name}</strong></div>
      <div class="sidebar-item"><span>Durata</span><strong>${BookingUtils.formatDuration(service.duration)}</strong></div>
      <div class="sidebar-item"><span>Prezzo</span><strong>${BookingUtils.formatPrice(service.price)}</strong></div>
      ${state.staffId ? `<div class="sidebar-item"><span>Operatore</span><strong>${BookingUtils.getStaffName(state.staffId)}</strong></div>` : ''}
      ${state.date ? `<div class="sidebar-item"><span>Data</span><strong>${new Date(state.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></div>` : ''}
      ${state.time ? `<div class="sidebar-item"><span>Ora</span><strong>${state.time}</strong></div>` : ''}
    `;
  }

  function goToStep(n) {
    state.step = n;
    els.steps.forEach(s => s.classList.toggle('active', +s.dataset.step === n));
    els.progress.forEach(p => {
      p.classList.toggle('active', +p.dataset.step <= n);
      p.classList.toggle('done', +p.dataset.step < n);
    });
    els.btnPrev.disabled = n === 1;
    els.btnNext.textContent = n === 4 ? 'Conferma prenotazione ✓' : 'Avanti →';
    els.nav.style.display = n === 5 ? 'none' : 'flex';
  }

  function validateStep() {
    if (state.step === 1 && !state.serviceId) return alert('Seleziona un servizio');
    if (state.step === 2 && !state.staffId) return alert('Seleziona un operatore');
    if (state.step === 3 && (!state.date || !state.time)) return alert('Seleziona data e ora');
    if (state.step === 4) {
      if (!els.clientForm.checkValidity()) {
        els.clientForm.reportValidity();
        return false;
      }
      submitBooking();
      return false;
    }
    return true;
  }

  function submitBooking() {
    const service = BookingUtils.getServiceById(state.serviceId);
    const fd = new FormData(els.clientForm);

    const appointment = {
      serviceId: state.serviceId,
      serviceName: service.name,
      serviceShort: service.short,
      price: service.price,
      duration: service.duration,
      staffId: state.staffId,
      staffName: BookingUtils.getStaffName(state.staffId),
      date: state.date,
      time: state.time,
      clientName: fd.get('name'),
      clientPhone: fd.get('phone'),
      clientEmail: fd.get('email') || '',
      notes: fd.get('notes') || ''
    };

    const saved = MaitresStorage.saveAppointment(appointment);

    els.successSummary.innerHTML = `
      <p><strong>${saved.serviceName}</strong></p>
      <p>${new Date(saved.date + 'T12:00:00').toLocaleDateString('it-IT')} · ${saved.time}</p>
      <p>Con ${saved.staffName}</p>
      <p class="sidebar-ref">Ref: ${saved.id}</p>
    `;

    goToStep(5);
  }

  els.btnNext.addEventListener('click', () => {
    if (!validateStep()) return;
    if (state.step < 4) goToStep(state.step + 1);
  });

  els.btnPrev.addEventListener('click', () => {
    if (state.step > 1) goToStep(state.step - 1);
  });

  els.newBooking.addEventListener('click', () => {
    Object.assign(state, { step: 1, serviceId: null, staffId: null, date: null, time: null });
    els.clientForm.reset();
    renderServices('donna');
    renderStaff();
    renderDates();
    renderTimes();
    updateSidebar();
    goToStep(1);
    els.nav.style.display = 'flex';
  });

  // Pre-select from URL ?service=xxx
  const params = new URLSearchParams(location.search);
  const preService = params.get('service');
  if (preService && BookingUtils.getServiceById(preService)) {
    state.serviceId = preService;
  }

  renderFilters();
  const initCat = preService
    ? MAITRES.services.find(s => s.id === preService)?.category || 'donna'
    : 'donna';
  els.serviceFilters.querySelector(`[data-cat="${initCat}"]`)?.click();
  if (!preService) renderServices('donna');
  renderStaff();
  renderDates();
  updateSidebar();
  goToStep(1);
})();
