/* Shop catalog + cart */
(function () {
  if (!document.getElementById('productGrid')) return;

  const REMOTE_IMG = (bcId) =>
    `https://files200a.areabeauty.it/Companies/5c5bb52f-5b6c-4ac1-98c7-9dca7f1c0a1a/Products/${bcId}/Images/1_Image.jpg`;

  let activeCategory = 'Tutte';
  let activeBrand = 'Tutti';
  let searchQuery = '';

  const grid = document.getElementById('productGrid');
  const catList = document.getElementById('categoryList');
  const brandFilters = document.getElementById('brandFilters');
  const brandStrip = document.getElementById('brandStrip');
  const resultCount = document.getElementById('resultCount');
  const searchInput = document.getElementById('shopSearch');
  const cartToggle = document.getElementById('cartToggle');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const cartOrder = document.getElementById('cartOrder');

  const brands = ['Tutti', ...MAITRES.brands];

  function getFilteredProducts() {
    return MAITRES.products.filter(p => {
      if (activeCategory !== 'Tutte' && p.category !== activeCategory) return false;
      if (activeBrand !== 'Tutti' && p.brand !== activeBrand) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }

  function renderCategories() {
    catList.innerHTML = MAITRES.productCategories.map(c =>
      `<li><button type="button" class="${c === activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button></li>`
    ).join('');

    catList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderCategories();
        renderProducts();
      });
    });
  }

  function renderBrandFilters() {
    brandFilters.innerHTML = brands.map(b =>
      `<li><button type="button" class="${b === activeBrand ? 'active' : ''}" data-brand="${b}">${b}</button></li>`
    ).join('');

    brandFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        activeBrand = btn.dataset.brand;
        renderBrandFilters();
        renderProducts();
      });
    });

    brandStrip.innerHTML = MAITRES.brands.map(b => `<span>${b}</span>`).join('');
  }

  function renderProducts() {
    const products = getFilteredProducts();
    resultCount.textContent = `${products.length} prodotti`;

    grid.innerHTML = products.map(p => `
      <article class="product-card">
        <div class="product-card__brand">${p.brand}</div>
        <div class="product-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="240" height="240"
            onerror="this.onerror=null;this.src='${REMOTE_IMG(p.bcId)}';this.onerror=function(){this.src='assets/products/placeholder.svg'}">
          <span class="product-card__cat">${p.category}</span>
        </div>
        <h4>${p.name}</h4>
        <div class="product-card__foot">
          <span class="product-card__price">${BookingUtils.formatPrice(p.price)}</span>
          <button type="button" class="btn btn--hot btn--sm add-cart" data-id="${p.id}">Aggiungi</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        MaitresStorage.addToCart(+btn.dataset.id);
        updateCartUI();
        openCart();
      });
    });
  }

  function updateCartUI() {
    const cart = MaitresStorage.getCart();
    const total = MaitresStorage.getCartTotal(MAITRES.products);
    const count = cart.reduce((s, i) => s + i.qty, 0);

    cartCount.textContent = count;
    cartCount.style.display = count ? 'flex' : 'none';
    cartTotal.textContent = BookingUtils.formatPrice(total);

    if (!cart.length) {
      cartBody.innerHTML = '<p class="cart-empty">Il carrello è vuoto</p>';
      return;
    }

    cartBody.innerHTML = cart.map(item => {
      const p = MAITRES.products.find(x => x.id === item.productId);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img class="cart-item__img" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/products/placeholder.svg'">
          <div>
            <strong>${p.name}</strong>
            <span>${BookingUtils.formatPrice(p.price)} × ${item.qty}</span>
          </div>
          <div class="cart-item__actions">
            <button type="button" data-id="${p.id}" data-d="-1">−</button>
            <span>${item.qty}</span>
            <button type="button" data-id="${p.id}" data-d="1">+</button>
          </div>
        </div>
      `;
    }).join('');

    cartBody.querySelectorAll('.cart-item__actions button').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const delta = +btn.dataset.d;
        const item = MaitresStorage.getCart().find(i => i.productId === id);
        MaitresStorage.updateCartQty(id, (item?.qty || 0) + delta);
        updateCartUI();
      });
    });
  }

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  cartOrder.addEventListener('click', () => {
    const cart = MaitresStorage.getCart();
    if (!cart.length) return alert('Il carrello è vuoto');

    const name = prompt('Nome e cognome:');
    if (!name) return;
    const phone = prompt('Telefono:');
    if (!phone) return;

    const items = cart.map(i => {
      const p = MAITRES.products.find(x => x.id === i.productId);
      return { ...i, name: p?.name, price: p?.price, brand: p?.brand };
    });

    MaitresStorage.saveOrder({ clientName: name, clientPhone: phone, items, total: MaitresStorage.getCartTotal(MAITRES.products) });

    if (typeof MaitresAPI !== 'undefined' && MaitresAPI.enabled) {
      MaitresAPI.createOrder({
        clientName: name,
        clientPhone: phone,
        items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, brand: i.brand })),
        total: MaitresStorage.getCartTotal(MAITRES.products)
      }).catch(() => {});
    }

    MaitresStorage.clearCart();
    updateCartUI();
    closeCart();
    alert('Richiesta ordine inviata! Ti contatteremo presto.');
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  renderCategories();
  renderBrandFilters();
  renderProducts();
  updateCartUI();
})();
