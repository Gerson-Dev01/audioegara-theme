document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('CatalogGrid');

  fetch('/products.json?limit=250')
    .then(r => r.json())
    .then(data => renderProducts(data.products))
    .catch(err => {
      console.error(err);
      grid.innerHTML = '<p>Error al cargar productos.</p>';
    });

  function renderProducts(products) {
    if (!products.length) {
      grid.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    grid.innerHTML = products.map(productHTML).join('');
    attachAddHandlers();
  }

  function productHTML(p) {
    const img = p.images[0]?.src || 'https://cdn.shopify.com/s/files/1/0000/0001/files/placeholder.png';
    const price = formatPrice(p.variants[0].price);
    return `
      <article class="product-card" data-handle="${p.handle}">
        <a href="/products/${p.handle}" class="product-link">
          <img src="${img}" alt="${p.title}" class="product-img">
          <h3>${p.title}</h3>
        </a>
        <p class="product-price">${price}</p>
        <button class="btn-add" data-id="${p.variants[0].id}">Añadir al carrito</button>
      </article>
    `;
  }

  function attachAddHandlers() {
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = btn.dataset.id;
        btn.disabled = true;
        btn.innerText = 'Añadiendo...';
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, quantity: 1 })
        });
        btn.innerText = 'Añadido ✓';
        setTimeout(() => {
          btn.innerText = 'Añadir al carrito';
          btn.disabled = false;
        }, 1200);
      });
    });
  }

  function formatPrice(price) {
    return `${(price / 100).toFixed(2)} €`;
  }
});
