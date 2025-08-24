mainMenu.items.welcome.html = `
<section class="hero">
  <div class="hero-grid">
    <div>
      <h1>Beautiful Ceramic & Porcelain Tiles</h1>
      <p>Durable, elegant finishes for bathrooms, kitchens, floors and outdoor spaces. Explore our curated ranges and get samples delivered.</p>
      <button class="cta" onclick="document.getElementById('btn-products').click()">Browse Products</button>
      <div class="badges" style="margin-top:.8rem">
        <span class="badge">Showroom-quality ranges</span>
        <span class="badge">Samples available</span>
        <span class="badge">Expert advice</span>
      </div>
    </div>
    <div class="hero-img" aria-hidden="true"></div>
  </div>
</section>

<section class="section">
  <h2>Popular Categories</h2>
  <div id="popular-cats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
    <a class="product-card" href="#" onclick="document.getElementById('btn-products').click()">
      <div class="thumb"><img src="images/cat-bathroom.png" alt="Bathroom Tiles"></div>
      <div class="meta">
        <h3>Bathroom Tiles</h3>
        <p>Clean lines, non-slip options.</p>
      </div>
    </a>
    <a class="product-card" href="#" onclick="document.getElementById('btn-products').click()">
      <div class="thumb"><img src="images/cat-kitchen.png" alt="Kitchen Tiles"></div>
      <div class="meta">
        <h3>Kitchen Tiles</h3>
        <p>Easy-care splashbacks & floors.</p>
      </div>
    </a>
    <a class="product-card" href="#" onclick="document.getElementById('btn-products').click()">
      <div class="thumb"><img src="images/cat-woodlook.png" alt="Wood Effect"></div>
      <div class="meta">
        <h3>Wood-Effect</h3>
        <p>Warm tone, porcelain strength.</p>
      </div>
    </a>
  </div>
</section>
`;
