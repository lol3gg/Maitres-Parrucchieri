/* M A Î T R E S — Dati centrali (servizi, prodotti, staff) */

const MAITRES = {
  salon: {
    name: 'M A Î T R E S Parrucchieri',
    address: 'Via XXIII Gennaio 101/A, Centro Commerciale Bramante',
    city: '61049 Urbania (PU)',
    phone: '+39 0722 317369',
    email: 'maitresparrucchieri@gmail.com',
    vat: '02350230419',
    website: 'https://maitresparrucchieri.it',
    shopUrl: 'https://maitresparrucchieri.beautycheck.it/prodotti',
    prenotadoUrl: 'https://prenotado.it/salone/ma-tres-parrucchieri_224FA59154E3F5'
  },

  hours: {
    0: null, // Dom
    1: null, // Lun
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '19:00' },
    5: { open: '09:00', close: '19:00' },
    6: { open: '09:00', close: '19:00' }
  },

  brands: ['Olaplex', 'Maria Nila', 'Alterna Caviar', 'Iles Formula', 'R+Co', 'Alterna Canvas'],

  staff: [
    { id: 'any', name: 'Primo disponibile', role: 'Auto-assegnazione' },
    { id: 'arti', name: 'Arti', role: 'Colorista · Tecnico · Olaplex', skills: ['colore', 'balayage', 'piega', 'olaplex', 'shampoo'] },
    { id: 'jem', name: 'Jem', role: 'Stylist Donna · Shampoo', skills: ['taglio', 'colore', 'shampoo'] },
    { id: 'daniel', name: 'Daniel', role: 'Consulente · Beauty Ritual', skills: ['consulenza', 'beauty-ritual', 'taglio', 'balayage'] }
  ],

  serviceCategories: [
    { id: 'donna', label: 'Trattamenti Donna', icon: '♀' },
    { id: 'uomo', label: 'Tagli Uomo', icon: '♂' },
    { id: 'tecnico', label: 'Tecnico Donna', icon: '✦' },
    { id: 'trattamenti', label: 'Trattamenti', icon: '◈' },
    { id: 'offerte', label: 'Offerte', icon: '★' }
  ],

  services: [
    {
      id: 'taglio-piega',
      category: 'donna',
      name: 'Taglio Donna + Piega liscia',
      short: 'TAGLIO DONNA + PIEGA LISCIA',
      price: 70,
      duration: 75,
      staff: ['arti', 'jem', 'daniel'],
      note: 'Include shampoo'
    },
    {
      id: 'colore-piega',
      category: 'donna',
      name: 'Colore di base + Piega liscia',
      short: 'COLORE DI BASE + PIEGA LISCIA',
      price: 70,
      duration: 105,
      staff: ['arti', 'jem']
    },
    {
      id: 'colore-taglio-piega',
      category: 'donna',
      name: 'Colore + Taglio + Piega liscia',
      short: 'COLORE DI BASE + TAGLIO + PIEGA LISCIA',
      price: 110,
      duration: 135,
      staff: ['arti', 'jem', 'daniel']
    },
    {
      id: 'balayage-consulenza',
      category: 'tecnico',
      name: 'Balayage — Consulenza',
      short: 'BALAYAGE SOLO SU CONSULENZA',
      price: 25,
      duration: 15,
      staff: ['arti', 'daniel'],
      note: 'Prenotabile solo dopo consulenza personalizzata con lo staff.'
    },
    {
      id: 'beauty-ritual',
      category: 'trattamenti',
      name: 'Consulenza Beauty Ritual',
      short: 'BEAUTY RITUAL',
      price: 39,
      duration: 30,
      staff: ['daniel'],
      description: 'Diagnosi con microcamera. Idratazione, nutrimento, riparazione o equilibrio — su misura.'
    },
    {
      id: 'olaplex-piega',
      category: 'trattamenti',
      name: 'Ricostruzione Olaplex + Piega',
      short: 'RICOSTRUZIONE OLAPLEX + PIEGA',
      price: 60,
      duration: 60,
      staff: ['arti']
    },
    {
      id: 'taglio-uomo',
      category: 'uomo',
      name: 'Taglio Uomo',
      short: 'TAGLIO UOMO',
      price: null,
      duration: 45,
      staff: ['any'],
      note: 'Barbiere per uomo — prezzo su listino salone.'
    },
    {
      id: 'ponytail-balayage',
      category: 'offerte',
      name: 'Ponytail Balayage — Consulenza',
      short: 'PONYTAIL BALAYAGE',
      price: 25,
      duration: 30,
      staff: ['arti', 'daniel'],
      note: 'Tecnica estiva per capelli raccolti. Consulenza obbligatoria.'
    }
  ],

  productCategories: [
    'Tutte', 'Shampoo', 'CONDITIONER', 'Mask', 'Olio', 'Siero', 'Spray', 'Styling', 'Finishing', 'Lotion', 'CREMA', 'Trattamento'
  ],

  products: [
    { id: 1, name: 'Alterna Canvas More To Love Bodifying Conditioner ml 251', brand: 'Alterna Canvas', category: 'CONDITIONER', price: 30 },
    { id: 2, name: 'Alterna Canvas More To Love Bodifying Shampoo ml 251', brand: 'Alterna Canvas', category: 'Shampoo', price: 30 },
    { id: 3, name: 'Caviar Ceramide Shots', brand: 'Alterna Caviar', category: 'Trattamento', price: 84 },
    { id: 4, name: 'Caviar Conditioner Bond Repair 250 ml', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 55 },
    { id: 5, name: 'Caviar Moisture CC Cream', brand: 'Alterna Caviar', category: 'CREMA', price: 49 },
    { id: 6, name: 'Caviar Moisture Conditioner 250 ml', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 55 },
    { id: 7, name: 'Caviar Moisture Priming Leave-in Conditioner', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 48 },
    { id: 8, name: 'Caviar Moisture Shampoo 250 ml', brand: 'Alterna Caviar', category: 'Shampoo', price: 55 },
    { id: 9, name: 'Caviar Perfect Texture Spray', brand: 'Alterna Caviar', category: 'Spray', price: 49 },
    { id: 10, name: 'Caviar Shampoo Bond Repair 250 ml', brand: 'Alterna Caviar', category: 'Shampoo', price: 55 },
    { id: 11, name: 'Caviar Working Hairspray nil.250', brand: 'Alterna Caviar', category: 'Spray', price: 41 },
    { id: 12, name: 'Iles Formula Conditioner ml.200', brand: 'Iles Formula', category: 'CONDITIONER', price: 55 },
    { id: 13, name: 'Iles Formula Finishing Serum ml.200', brand: 'Iles Formula', category: 'Siero', price: 57 },
    { id: 14, name: 'Iles Formula Shampoo 200 ml', brand: 'Iles Formula', category: 'Shampoo', price: 44 },
    { id: 15, name: 'Maria Nila Clay ml.50', brand: 'Maria Nila', category: 'Styling', price: 16 },
    { id: 16, name: 'Maria Nila Conditioner Heal ml.100', brand: 'Maria Nila', category: 'CONDITIONER', price: 15 },
    { id: 17, name: 'Maria Nila Conditioner Heal ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 31 },
    { id: 18, name: 'Maria Nila Conditioner Luminous Colour ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 28 },
    { id: 19, name: 'Maria Nila Conditioner Silver ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 29 },
    { id: 20, name: 'Maria Nila Extreme Spray', brand: 'Maria Nila', category: 'Spray', price: 29 },
    { id: 21, name: 'Maria Nila Finishing Spray', brand: 'Maria Nila', category: 'Finishing', price: 29 },
    { id: 22, name: 'Maria Nila Hair Lotion Luminous Color', brand: 'Maria Nila', category: 'Lotion', price: 30 },
    { id: 23, name: 'Maria Nila Masque Head e Hair Heal ml.50', brand: 'Maria Nila', category: 'Mask', price: 33 },
    { id: 24, name: 'Maria Nila Schist ml.100', brand: 'Maria Nila', category: 'Styling', price: 25 },
    { id: 25, name: 'Maria Nila Schist ml.50', brand: 'Maria Nila', category: 'Styling', price: 16 },
    { id: 26, name: 'Maria Nila Shampoo Heal ml.100', brand: 'Maria Nila', category: 'Shampoo', price: 15 },
    { id: 27, name: 'Maria Nila Shampoo Heal ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 31 },
    { id: 28, name: 'Maria Nila Shampoo Luminous Colour ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 28 },
    { id: 29, name: 'Maria Nila Shampoo Silver ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 29 },
    { id: 30, name: 'Maria Nila Slate ml.100', brand: 'Maria Nila', category: 'Styling', price: 25 },
    { id: 31, name: 'Maria Nila Styling Mousse', brand: 'Maria Nila', category: 'Styling', price: 27 },
    { id: 32, name: 'Maria Nila Styling Spray', brand: 'Maria Nila', category: 'Styling', price: 29 },
    { id: 33, name: 'Maria Nila True Soft Argan Oil 100ml', brand: 'Maria Nila', category: 'Olio', price: 35 },
    { id: 34, name: 'Maria Nila True Soft Argan Oil 30ml', brand: 'Maria Nila', category: 'Olio', price: 17 },
    { id: 35, name: 'Maria Nila Volume Spray', brand: 'Maria Nila', category: 'Spray', price: 29 },
    { id: 36, name: 'Olaplex n.0 Intensive Bond Building', brand: 'Olaplex', category: 'Trattamento', price: 30 },
    { id: 37, name: 'Olaplex n.3 Hair Perfector 100ml', brand: 'Olaplex', category: 'Trattamento', price: 30 },
    { id: 38, name: 'Olaplex n.4 Shampoo Bond Maintenance ml.250', brand: 'Olaplex', category: 'Shampoo', price: 30 },
    { id: 39, name: 'Olaplex n.4P Shampoo Blonde Enhancer Toning ml.250', brand: 'Olaplex', category: 'Shampoo', price: 30 },
    { id: 40, name: 'Olaplex n.7 Bonding Oil', brand: 'Olaplex', category: 'Olio', price: 30 },
    { id: 41, name: 'Olaplex n.8 Bond Intense Moisture Mask', brand: 'Olaplex', category: 'Mask', price: 30 },
    { id: 42, name: 'Olaplex n.9 Bond Protector', brand: 'Olaplex', category: 'Trattamento', price: 30 },
    { id: 43, name: 'R+Co Analog Cleansing Foam Conditioner ml 177', brand: 'R+Co', category: 'CONDITIONER', price: 32 },
    { id: 44, name: 'R+Co Ballon Dry Volume Spray ml 176', brand: 'R+Co', category: 'Spray', price: 33 },
    { id: 45, name: 'R+Co Cassette Curl Shampoo ml 241', brand: 'R+Co', category: 'Shampoo', price: 32 },
    { id: 46, name: 'R+Co Crown Scalp Scrub ml 147', brand: 'R+Co', category: 'Trattamento', price: 38 },
    { id: 47, name: 'R+Co Death Valley Dry Shampoo ml 300', brand: 'R+Co', category: 'Shampoo', price: 33 },
    { id: 48, name: 'R+Co Twister Curl Primer ml 147', brand: 'R+Co', category: 'Styling', price: 29 }
  ]
};

if (typeof module !== 'undefined') module.exports = MAITRES;
