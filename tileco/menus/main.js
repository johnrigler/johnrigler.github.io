const mainMenu = menuFactory();
mainMenu.tools.add("welcome", "Home", "");
mainMenu.tools.add("products", "Products", "");

mainMenu.tools.add("contact", "Contact", `
  <section class="section">
    <h2>Contact Us</h2>
    <form id="contact-form" style="display:grid;gap:.6rem;max-width:520px">
      <input type="text" name="from_name" placeholder="Your Name" required>
      <input type="email" name="reply_to" placeholder="Your Email" required>
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button class="cta" type="submit">Send Message</button>
      <p id="form-status" class="muted"></p>
    </form>
  </section>
`);

// EmailJS bindings
document.addEventListener("submit", (e)=>{
  const form = e.target;
  if (form && form.id === "contact-form") {
    e.preventDefault();
    const status = document.getElementById("form-status");
    emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form).then(()=>{
      status.textContent = "Message sent. We’ll be in touch!";
      status.style.color = "green";
      form.reset();
    }).catch(err=>{
      console.error(err);
      status.textContent = "Failed to send. Please try again.";
      status.style.color = "red";
    });
  }
});
