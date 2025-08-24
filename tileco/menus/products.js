// Shell
mainMenu.items.products.html = `
<section class="section">
  <h2>Our Tile Collection</h2>

  <div id="filters" style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0 1rem">
    <button class="btn" data-filter="all">All</button>
    <button class="btn" data-filter="bathroom">Bathroom</button>
    <button class="btn" data-filter="kitchen">Kitchen</button>
    <button class="btn" data-filter="flooring">Flooring</button>
    <button class="btn" data-filter="outdoor">Outdoor</button>
    <button class="btn" data-filter="wood">Wood-Effect</button>
    <button class="btn" data-filter="mosaic">Mosaic</button>
  </div>

  <div id="product-list">Loading products...</div>
</section>
`;

let PRODUCTS_CACHE = [];

function renderProducts(list, filter='all'){
  const root = document.getElementById('product-list');
  if (!root) return;
  root.innerHTML = '';
  const filtered = filter==='all' ? list : list.filter(p => (p.tags||[]).includes(filter));

  if (!filtered.length){
    root.innerHTML = `<p style="color:var(--muted)">No products match this filter.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = '#'; // could deep-link to product page later
    card.innerHTML = `
      <div class="thumb">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="meta">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="badges">
          ${(p.tags||[]).slice(0,3).map(t=>`<span class="badge">${t}</span>`).join('')}
        </div>
        <div class="price" style="margin-top:.6rem">$${p.price.toFixed(2)}</div>
      </div>
    `;
    root.appendChild(card);
  });
}

fetch("products.json")
  .then(r => r.json())
  .then(json => { PRODUCTS_CACHE = json; renderProducts(PRODUCTS_CACHE); })
  .catch(err => {
    console.error(err);
    const root = document.getElementById('product-list');
    if (root) root.innerHTML = "<p>Failed to load products.</p>";
  });

// filter handlers (event delegation)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('#filters .btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  document.querySelectorAll('#filters .btn').forEach(b=>b.classList.toggle('active', b===btn));
  renderProducts(PRODUCTS_CACHE, filter);
});
