    // Reference to container
    addressSelect = document.getElementById("address-select");

    // Title
    var title = document.createElement("h2");
    title.textContent = "Address Picker!";
    addressSelect.appendChild(title);

    // Label
    var label = document.createElement("label");
    label.setAttribute("for", "addrInput");
    label.textContent = "Address:";
    addressSelect.appendChild(label);

    // Input
    var input = document.createElement("input");
    input.type = "text";
    input.id = "addrInput";
    input.placeholder = "Paste or pick an address";
    addressSelect.appendChild(input);

    // Dropdown toggle button
    var button = document.createElement("button");
    button.id = "addrButton";
    button.textContent = "▼";
    addressSelect.appendChild(button);

    // Select dropdown
    var select = document.createElement("select");
    select.id = "addrSelect";
    select.style.display = "none";

    options = [];

    addressSelect.appendChild(select);

    // "Show Current Value" button
    var p = document.createElement("p");
    var showButton = document.createElement("button");
    showButton.id = "showValue";
    showButton.textContent = "Show Current Value";
    p.appendChild(showButton);
    addressSelect.appendChild(p);

    // Output area
    var output = document.createElement("pre");
    output.id = "output";
    addressSelect.appendChild(output);

    // --- Behavior wiring ---
    button.addEventListener("click", () => {
      select.style.display = select.style.display === "none" ? "inline" : "none";
    });

    select.addEventListener("change", () => {
      if (select.value) {
        input.value = select.value;
      }
      select.style.display = "none";
    });

    showButton.addEventListener("click", () => {
      output.textContent = input.value || "(empty)";
    });


updateOption = function(opts) {

//addrSelect.innerHTML=""

opts.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      select.appendChild(option);
    });

}

