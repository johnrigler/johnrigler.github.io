document.addEventListener("DOMContentLoaded", () => {
  // Inject CSS styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    body { font-family: sans-serif; padding: 1em; }
    #addrSelect { margin-left: 0.5em; }
    #addrButton { margin-left: 0.25em; }
  `;
  document.head.appendChild(style);

  const input = document.getElementById("addrInput");
  const button = document.getElementById("addrButton");
  const select = document.getElementById("addrSelect");
  const showValue = document.getElementById("showValue");
  const output = document.getElementById("output");

  // Toggle select menu on button click
  button.addEventListener("click", () => {
    select.style.display = (select.style.display === "none") ? "inline" : "none";
  });

  // When user picks from select, update input box
  select.addEventListener("change", () => {
    if (select.value) {
      input.value = select.value;
      select.style.display = "none"; // hide again after selection
    }
  });

  // Show current value
  showValue.addEventListener("click", () => {
    output.textContent = `Current address: ${input.value}`;
  });
});

