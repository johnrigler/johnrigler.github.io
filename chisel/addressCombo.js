// addressCombo.js
(function (global) {
  class AddressCombo {
    constructor(container, options = {}) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      if (!this.container) throw new Error("Invalid container element");

      this.addresses = options.addresses || ["DHooQkHNjos8X15qczAsA3s5cJEMGksdvj"];
      this.onSearch = options.onSearch || function (addr) { console.log("Search:", addr); };

      this._buildUI();
      this._bindEvents();
    }

    _buildUI() {
      // inject CSS (only once per page)
      if (!document.getElementById("address-combo-style")) {
        const style = document.createElement("style");
        style.id = "address-combo-style";
        style.textContent = `
          .addr-combo-container {
            display: flex;
            align-items: center;
            width: 500px;
            font-family: monospace;
            position: relative;
          }
          .addr-combo-input {
            width: 100%;
            padding: 6px 24px 6px 6px;
            font-size: 14px;
            background: #222;
            color: #eee;
            border: 1px solid #555;
          }
          .addr-combo-btn {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #aaa;
            cursor: pointer;
            font-size: 14px;
          }
          .addr-combo-list {
            position: absolute;
            background: #222;
            border: 1px solid #555;
            max-height: 150px;
            overflow-y: auto;
            display: none;
            z-index: 999;
            width: 100%;
          }
          .addr-combo-item {
            padding: 6px;
            cursor: pointer;
          }
          .addr-combo-item:hover {
            background: #444;
          }
        `;
        document.head.appendChild(style);
      }

      // build DOM
      this.wrapper = document.createElement("div");
      this.wrapper.className = "addr-combo-container";

      this.input = document.createElement("input");
      this.input.type = "text";
      this.input.className = "addr-combo-input";
      this.input.placeholder = "Select or paste address...";

      this.dropdownBtn = document.createElement("button");
      this.dropdownBtn.className = "addr-combo-btn";
      this.dropdownBtn.textContent = "▼";

      this.list = document.createElement("div");
      this.list.className = "addr-combo-list";

      this.wrapper.appendChild(this.input);
      this.wrapper.appendChild(this.dropdownBtn);
      this.wrapper.appendChild(this.list);

      this.container.appendChild(this.wrapper);
    }

    _bindEvents() {
      this.input.addEventListener("input", () => this._renderList(this.input.value.trim()));
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this._doSearch(this.input.value.trim());
      });
      this.input.addEventListener("focus", () => this._renderList(this.input.value.trim()));

      this.dropdownBtn.addEventListener("click", () => {
        this.input.value = "";
        this._renderList("");
        this.list.style.display = "block";
        this.input.focus();
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest(".addr-combo-container")) {
          this.list.style.display = "none";
        }
      });
    }

    _renderList(filter = "") {
      this.list.innerHTML = "";
      const filtered = this.addresses.filter(addr => addr.toLowerCase().includes(filter.toLowerCase()));
      filtered.forEach(addr => {
        const div = document.createElement("div");
        div.textContent = addr;
        div.className = "addr-combo-item";
        div.onclick = () => {
          this.input.value = addr;
          this.list.style.display = "none";
          this._doSearch(addr);
        };
        this.list.appendChild(div);
      });
      this.list.style.display = filtered.length ? "block" : "none";
    }

    _doSearch(addr) {
      if (!addr) return;
      if (!this.addresses.includes(addr)) this.addresses.push(addr);
      this.onSearch(addr);
    }

    addAddress(addr) {
      if (addr && !this.addresses.includes(addr)) this.addresses.push(addr);
    }

    clearAddresses() {
      this.addresses = [];
    }
  }

  // expose globally
  global.AddressCombo = AddressCombo;
})(window);

