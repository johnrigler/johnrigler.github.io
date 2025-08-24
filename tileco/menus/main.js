// Create the main menu for Ceramic Tiles Co.
const mainMenu = menuFactory();

// Add the main sections
mainMenu.tools.add("welcome", "Home", "");
mainMenu.tools.add("products", "Products", "");
mainMenu.tools.add("about", "About Us", `
  <section style="padding:1.5em; max-width:600px; margin:auto;">
    <h2>About Ceramic Tiles Co.</h2>
    <p style="line-height:1.5; color:#555;">
      At Ceramic Tiles Co., we specialize in high-quality ceramic tiles that 
      combine durability with style. From kitchens to bathrooms to outdoor 
      spaces, our products are designed to last and impress.
    </p>
  </section>
`);
mainMenu.tools.add("contact", "Contact", `
  <section style="padding:1.5em; max-width:600px; margin:auto;">
    <h2>Contact Us</h2>
    <p style="line-height:1.5; color:#555;">
      Have a question or need a custom order? We’d love to hear from you!
    </p>
    <form style="display:flex; flex-direction:column; gap:0.5em; margin-top:1em;">
      <input type="text" placeholder="Your Name" required style="padding:0.5em; border:1px solid #ccc; border-radius:6px;">
      <input type="email" placeholder="Your Email" required style="padding:0.5em; border:1px solid #ccc; border-radius:6px;">
      <textarea placeholder="Your Message" required style="padding:0.5em; border:1px solid #ccc; border-radius:6px;"></textarea>
      <button type="submit" style="padding:0.6em; background:#0074D9; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
        Send Message
      </button>
    </form>
  </section>
`);
