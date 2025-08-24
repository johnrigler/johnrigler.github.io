mainMenu.tools.add("products", "Products", `
<section style="padding:1.5em;">
  <h2>Our Tile Collection</h2>
  <div id="product-list" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1em; margin-top:1em;">
    Loading products...
  </div>
</section>
`);

fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.borderRadius = "8px";
      card.style.padding = "1em";
      card.style.textAlign = "center";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width:100%; max-height:150px; object-fit:cover; border-radius:6px;">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>$${p.price.toFixed(2)}</strong>
      `;
      list.appendChild(card);
    });
  });
