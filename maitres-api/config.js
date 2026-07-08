/* Config condivisa con il sito pubblico */

module.exports = {
  adminPin: process.env.MAITRES_ADMIN_PIN || 'maitres2026',
  adminKey: process.env.MAITRES_ADMIN_KEY || 'maitres-admin-secret-key',

  hours: {
    0: null,
    1: null,
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '19:00' },
    5: { open: '09:00', close: '19:00' },
    6: { open: '09:00', close: '19:00' }
  },

  staff: [
    { id: 'any', name: 'Primo disponibile', role: 'Auto-assegnazione' },
    { id: 'arti', name: 'Arti', role: 'Colorista · Tecnico · Olaplex' },
    { id: 'jem', name: 'Jem', role: 'Stylist Donna · Shampoo' },
    { id: 'daniel', name: 'Daniel', role: 'Consulente · Beauty Ritual' }
  ],

  services: [
    { id: 'taglio-piega', name: 'Taglio Donna + Piega liscia', price: 70, duration: 75, staff: ['arti', 'jem', 'daniel'] },
    { id: 'colore-piega', name: 'Colore di base + Piega liscia', price: 70, duration: 105, staff: ['arti', 'jem'] },
    { id: 'colore-taglio-piega', name: 'Colore + Taglio + Piega liscia', price: 110, duration: 135, staff: ['arti', 'jem', 'daniel'] },
    { id: 'balayage-consulenza', name: 'Balayage — Consulenza', price: 25, duration: 15, staff: ['arti', 'daniel'] },
    { id: 'beauty-ritual', name: 'Consulenza Beauty Ritual', price: 39, duration: 30, staff: ['daniel'] },
    { id: 'olaplex-piega', name: 'Ricostruzione Olaplex + Piega', price: 60, duration: 60, staff: ['arti'] },
    { id: 'taglio-uomo', name: 'Taglio Uomo', price: null, duration: 45, staff: ['any'] },
    { id: 'ponytail-balayage', name: 'Ponytail Balayage — Consulenza', price: 25, duration: 30, staff: ['arti', 'daniel'] }
  ]
};
