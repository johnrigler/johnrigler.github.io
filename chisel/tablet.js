(function(global) {
  const Tablet = {
    rows: [],
    colors: {},

    async loadColors(url = "b57.json") {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      const list = await res.json();
      const map = {};
      for (const e of list) {
        const [r,g,b] = e.rgb.split(",").map(x => parseInt(x.trim(),10));
        map[e.b57] = { r, g, b, name: e.name, lum: e.lum };
      }
      this.colors = map;
      return map;
    },

    setRows(data) { this.rows = data.slice(); },
    getRows() { return this.rows.slice(); },
    toText() { return this.rows.join("\n"); },
    toJSON() { return JSON.stringify(this.rows, null, 2); },

    renderCanvas(canvas, cellSize = 16) {
      if (!this.colors || Object.keys(this.colors).length === 0) return;
      const ctx = canvas.getContext("2d");
      const rows = this.rows.length;
      const cols = this.rows[0]?.length || 0;
      canvas.width = cols*cellSize;
      canvas.height = rows*cellSize;
      for (let y=0;y<rows;y++) {
        for (let x=0;x<cols;x++) {
          const ch = this.rows[y][x];
          const col = this.colors[ch];
          ctx.fillStyle = col ? `rgb(${col.r},${col.g},${col.b})` : "black";
          ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
      }
    },

    countUnique() {
        const counts = {};
        for (const row of this.rows) {
            for (const ch of row) {
                counts[ch] = (counts[ch] || 0) + 1;
            }
        }

        // return sorted array: [ [char, count], ... ]
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    },

   async buildUnique(pre, lines = this.rows, maxSuffix = 10000) {
    let seen = new Set();
    let newArray = [];
    
    for (let line of lines) {
        let i = 0;
        while (i < maxSuffix) {
            let candidate = await unspendable(pre + line, "", i);

            if (candidate === "undefined") {
                throw new Error(`unspendable exhausted for ${line}`);
            }

            if (!seen.has(candidate)) {
                seen.add(candidate);
                newArray.push(candidate);
                break; // next line
            }

            i++;
        }
    }

    return newArray;
},


    download(filename="tablet.txt") {
      const blob = new Blob([this.toText()], {type:"text/plain"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },

    // New: Create file input and load data
    createUploadInput(onLoad) {
      const input = document.createElement("input");
      input.type = "file";
      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        let lines;
        try {
          // try array syntax: ["line1","line2"]
          lines = (new Function("return " + text))();
          if (!Array.isArray(lines)) throw new Error("Not array");
        } catch {
          // fallback: one line per row
          lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        }
        this.setRows(lines);
        if (onLoad) onLoad(lines);
      });
      return input;
    }
  };

  global.Tablet = Tablet;
})(window);

