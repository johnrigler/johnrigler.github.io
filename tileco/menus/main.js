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
    <form id="contact-form" style="display:flex; flex-direction:column; gap:0.5em; margin-top:1em;">
      <input type="text" name="from_name" placeholder="Your Name" required>
      <input type="email" name="reply_to" placeholder="Your Email" required>
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
    <p id="form-status" style="margin-top:0.5em; font-weight:bold;"></p>
  </section>
`);

// EmailJS integration
// Make sure to include this script in index.html:
// <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  if (window.emailjs) {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
  }

  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "contact-form") {
      e.preventDefault();
      const form = e.target;
      const status = document.getElementById("form-status");

      emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form)
        .then(() => {
          status.textContent = "✅ Message sent successfully!";
          status.style.color = "green";
          form.reset();
        }, (err) => {
          status.textContent = "❌ Failed to send. Try again.";
          status.style.color = "red";
          console.error(err);
        });
    }
  });
});
