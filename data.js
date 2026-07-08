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

  productImageBase: 'https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products',

  products: [
    { id: 1, bcId: 308, name: 'Alterna Canvas More To Love Bodifying Conditioner ml 251', brand: 'Alterna Canvas', category: 'CONDITIONER', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/alterna-canvas-more-to-love-bodifying-conditioner-ml-251/308' },
    { id: 2, bcId: 307, name: 'Alterna Canvas More To Love Bodifying Shampoo ml 251', brand: 'Alterna Canvas', category: 'Shampoo', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/alterna-canvas-more-to-love-bodifying-shampoo-ml-251/307' },
    { id: 3, bcId: 117, name: 'Caviar Ceramide Shots', brand: 'Alterna Caviar', category: 'Siero', price: 84, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/siero/caviar-ceramide-shots/117' },
    { id: 4, bcId: 118, name: 'Caviar Conditioner Bond Repair 250 ml', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 55, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/caviar-conditioner-bond-repair-250-ml/118' },
    { id: 5, bcId: 124, name: 'Caviar Moisture CC Cream', brand: 'Alterna Caviar', category: 'CREMA', price: 49, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/caviar-moisture-cc-cream/124' },
    { id: 6, bcId: 383, name: 'Caviar Moisture Conditioner 250 ml', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 55, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/caviar-moisture-conditioner-250-ml/383' },
    { id: 7, bcId: 125, name: 'Caviar Moisture Priming Leave-in Conditioner', brand: 'Alterna Caviar', category: 'CONDITIONER', price: 48, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/caviar-moisture-priming-leave-in-conditioner/125' },
    { id: 8, bcId: 126, name: 'Caviar Moisture Shampoo 250 ml', brand: 'Alterna Caviar', category: 'Shampoo', price: 55, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/caviar-moisture-shampoo-250-ml/126' },
    { id: 9, bcId: 119, name: 'Caviar Perfect Texture Spray', brand: 'Alterna Caviar', category: 'Finishing', price: 49, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/caviar-perfect-texture-spray/119' },
    { id: 10, bcId: 343, name: 'Caviar Shampoo Bond Repair 250 ml', brand: 'Alterna Caviar', category: 'Shampoo', price: 55, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/caviar-shampoo-bond-repair-250-ml/343' },
    { id: 11, bcId: 120, name: 'Caviar Working Hairspray nil.250', brand: 'Alterna Caviar', category: 'Finishing', price: 41, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/caviar-working-hairspray-nil-250/120' },
    { id: 12, bcId: 106, name: 'Iles Formula Conditioner ml.200', brand: 'Iles Formula', category: 'CONDITIONER', price: 55, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/iles-formula-conditioner-ml-200/106' },
    { id: 13, bcId: 241, name: 'Iles Formula Finishing Serum ml.200', brand: 'Iles Formula', category: 'Finishing', price: 57, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/iles-formula-finishing-serum-ml-200/241' },
    { id: 14, bcId: 105, name: 'Iles Formula Shampoo 200 ml', brand: 'Iles Formula', category: 'Shampoo', price: 44, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/iles-formula-shampoo-200-ml/105' },
    { id: 15, bcId: 640, name: 'Maria Nila Clay ml.50', brand: 'Maria Nila', category: 'Styling', price: 16, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/styling/maria-nila-clay-ml-50/640' },
    { id: 16, bcId: 715, name: 'Maria Nila Conditioner Heal ml.100', brand: 'Maria Nila', category: 'CONDITIONER', price: 15, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/maria-nila-conditioner-heal-ml-100/715' },
    { id: 17, bcId: 712, name: 'Maria Nila Conditioner Heal ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 31, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/maria-nila-conditioner-heal-ml-300/712' },
    { id: 18, bcId: 131, name: 'Maria Nila Conditioner Luminous Colour ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 28, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/maria-nila-conditioner-luminous-colour-ml-300/131' },
    { id: 19, bcId: 133, name: 'Maria Nila Conditioner Silver ml.300', brand: 'Maria Nila', category: 'CONDITIONER', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/maria-nila-conditioner-silver-ml-300/133' },
    { id: 20, bcId: 697, name: 'Maria Nila Extreme Spray', brand: 'Maria Nila', category: 'Finishing', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/maria-nila-extreme-spray/697' },
    { id: 21, bcId: 135, name: 'Maria Nila Finishing Spray', brand: 'Maria Nila', category: 'Finishing', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/maria-nila-finishing-spray/135' },
    { id: 22, bcId: 134, name: 'Maria Nila Hair Lotion Luminous Color', brand: 'Maria Nila', category: 'Lotion', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/lotion/maria-nila-hair-lotion-luminous-color/134' },
    { id: 23, bcId: 716, name: 'Maria Nila Masque Head e Hair Heal ml.50', brand: 'Maria Nila', category: 'Mask', price: 33, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/mask/maria-nila-masque-head-e-hair-heal-ml-50/716' },
    { id: 24, bcId: 729, name: 'Maria Nila Schist ml.100', brand: 'Maria Nila', category: 'Styling', price: 25, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/styling/maria-nila-schist-ml-100/729' },
    { id: 25, bcId: 642, name: 'Maria Nila Schist ml.50', brand: 'Maria Nila', category: 'Styling', price: 16, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/styling/maria-nila-schist-ml-50/642' },
    { id: 26, bcId: 714, name: 'Maria Nila Shampoo Heal ml.100', brand: 'Maria Nila', category: 'Shampoo', price: 15, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/maria-nila-shampoo-heal-ml-100/714' },
    { id: 27, bcId: 713, name: 'Maria Nila Shampoo Heal ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 31, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/maria-nila-shampoo-heal-ml-350/713' },
    { id: 28, bcId: 129, name: 'Maria Nila Shampoo Luminous Colour ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 28, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/maria-nila-shampoo-luminous-colour-ml-350/129' },
    { id: 29, bcId: 130, name: 'Maria Nila Shampoo Silver ml.350', brand: 'Maria Nila', category: 'Shampoo', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/maria-nila-shampoo-silver-ml-350/130' },
    { id: 30, bcId: 730, name: 'Maria Nila Slate ml.100', brand: 'Maria Nila', category: 'Styling', price: 25, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/styling/maria-nila-slate-ml-100/730' },
    { id: 31, bcId: 138, name: 'Maria Nila Styling Mousse', brand: 'Maria Nila', category: 'Styling', price: 27, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/styling/maria-nila-styling-mousse/138' },
    { id: 32, bcId: 349, name: 'Maria Nila Styling Spray', brand: 'Maria Nila', category: 'Finishing', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/finishing/maria-nila-styling-spray/349' },
    { id: 33, bcId: 248, name: 'Maria Nila True Soft Argan Oil 100ml', brand: 'Maria Nila', category: 'Olio', price: 35, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/olio/maria-nila-true-soft-argan-oil-100ml/248' },
    { id: 34, bcId: 661, name: 'Maria Nila True Soft Argan Oil 30ml', brand: 'Maria Nila', category: 'Olio', price: 17, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/olio/maria-nila-true-soft-argan-oil-30ml/661' },
    { id: 35, bcId: 136, name: 'Maria Nila Volume Spray', brand: 'Maria Nila', category: 'Spray', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/spray/maria-nila-volume-spray/136' },
    { id: 36, bcId: 95, name: 'Olaplex n.0 Intensive Bond Building', brand: 'Olaplex', category: 'Trattamento', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/trattamento/olaplex-n-0-intensive-bond-building/95' },
    { id: 37, bcId: 100, name: 'Olaplex n.3 Hair Perfector 100ml', brand: 'Olaplex', category: 'CREMA', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/crema/olaplex-n-3-hair-perfector-100ml/100' },
    { id: 38, bcId: 128, name: 'Olaplex n.4 Shampoo Bond Maintenance ml.250', brand: 'Olaplex', category: 'Shampoo', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/olaplex-n-4-shampoo-bond-maintenance-ml-250/128' },
    { id: 39, bcId: 127, name: 'Olaplex n.4P Shampoo Blonde Enhancer Toning ml.250', brand: 'Olaplex', category: 'Shampoo', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/olaplex-n-4p-shampoo-blonde-enhancer-toning-ml-250/127' },
    { id: 40, bcId: 97, name: 'Olaplex n.7 Bonding Oil', brand: 'Olaplex', category: 'Olio', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/olio/olaplex-n-7-bonding-oil/97' },
    { id: 41, bcId: 96, name: 'Olaplex n.8 Bond Intense Moisture Mask', brand: 'Olaplex', category: 'Mask', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/mask/olaplex-n-8-bond-intense-moisture-mask/96' },
    { id: 42, bcId: 101, name: 'Olaplex n.9 Bond Protector', brand: 'Olaplex', category: 'Siero', price: 30, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/siero/olaplex-n-9-bond-protector/101' },
    { id: 43, bcId: 271, name: 'R+Co Analog Cleansing Foam Conditioner ml 177', brand: 'R+Co', category: 'CONDITIONER', price: 32, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/conditioner/r-co-analog-cleansing-foam-conditioner-ml-177/271' },
    { id: 44, bcId: 270, name: 'R+Co Ballon Dry Volume Spray ml 176', brand: 'R+Co', category: 'Spray', price: 33, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/spray/r-co-ballon-dry-volume-spray-ml-176/270' },
    { id: 45, bcId: 261, name: 'R+Co Cassette Curl Shampoo ml 241', brand: 'R+Co', category: 'Shampoo', price: 32, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/r-co-cassette-curl-shampoo-ml-241/261' },
    { id: 46, bcId: 265, name: 'R+Co Crown Scalp Scrub ml 147', brand: 'R+Co', category: 'Mask', price: 38, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/mask/r-co-crown-scalp-scrub-ml-147/265' },
    { id: 47, bcId: 304, name: 'R+Co Death Valley Dry Shampoo ml 300', brand: 'R+Co', category: 'Shampoo', price: 33, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/shampoo/r-co-death-valley-dry-shampoo-ml-300/304' },
    { id: 48, bcId: 266, name: 'R+Co Twister Curl Primer ml 147', brand: 'R+Co', category: 'CREMA', price: 29, url: 'https://maitresparrucchieri.beautycheck.it/prodotti/crema/r-co-twister-curl-primer-ml-147/266' }
  ]
};

MAITRES.products.forEach(p => {
  p.image = `${MAITRES.productImageBase}/${p.bcId}/Images/1_Image.jpg`;
});

if (typeof module !== 'undefined') module.exports = MAITRES;
