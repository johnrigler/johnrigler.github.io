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
