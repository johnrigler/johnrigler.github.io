document.addEventListener("DOMContentLoaded", () => {
  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    body { font-family: sans-serif; padding: 1em; }
    #addrSelect { margin-left: 0.5em; }
    #addrButton { margin-left: 0.25em; }
  `;
  document.head.appendChild(style);

  // Container
  const app = document.getElementById("app");

  // Build elements
  const h2 = document.createElement("h2");
  h2.textContent = "Address Picker!";
  app.appendChild(h2);

  const label = document.createElement("label");
  label.setAttribute("for", "addrInput");
  label.textContent = "Address:";
  app.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.id = "addrInput";
  input.placeholder = "Paste or pick an address";
  app.appendChild(input);

  const button = document.createElement("button");
  button.id = "addrButton";
  button.textContent = "▼";
  app.appendChild(button);

  const select = document.createElement("select");
  select.id = "addrSelect";
  select.style.display = "none";
  const options = [
    { value: "", text: "-- pick one --" },
    { value: "DGB1abc…", text: "DGB1abc…" },
    { value: "DGB1def…", text: "DGB1def…" },
    { value: "DGB1ghi…", text: "DGB1ghi…" }
  ];
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.text;
    select.appendChild(o);
  });
  app.appendChild(select);

  const p = document.createElement("p");
  const showBtn = document.createElement("button");
  showBtn.id = "showValue";
  showBtn.textContent = "Show Current Value";
  p.appendChild(showBtn);
  app.appendChild(p);

  const output = document.createElement("pre");
  output.id = "output";
  app.appendChild(output);

  // Logic
  button.addEventListener("click", () => {
    select.style.display = (select.style.display === "none") ? "inline" : "none";
  });

  select.addEventListener("change", () => {
    if (select.value) {
      input.value = select.value;
      select.style.display = "none";
    }
  });

  showBtn.addEventListener("click", () => {
    output.textContent = `Current address: ${input.value}`;
  });
});

