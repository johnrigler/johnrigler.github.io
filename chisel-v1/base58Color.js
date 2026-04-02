// base58Color.js

(function(global) {
  const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function hsvToRgb(h, s, v) {
    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;
    let [r, g, b] = [0, 0, 0];
    if (h < 60)       [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else              [r, g, b] = [c, 0, x];
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }

function getBase58ColorMap() {
  const map = {};

  // 52 perceptually distinct named colors
  const namedColors = {
    '1': [255, 0, 0],        // red
    'G': [0, 128, 0],        // green
    'W': [0, 0, 255],        // blue
    'C': [255, 255, 0],      // yellow
    '5': [255, 165, 0],      // orange
    '6': [165, 42, 42],      // brown
    'M': [255, 192, 203],    // pink
    'g': [0, 255, 255],      // cyan
    '9': [255, 105, 180],    // hot pink
    'J': [0, 128, 128],      // teal
    'B': [255, 215, 0],      // gold
    'T': [139, 69, 19],      // saddle brown
    'D': [173, 216, 230],    // light blue
    'E': [124, 252, 0],      // lawn green
    'F': [240, 230, 140],    // khaki
    '2': [255, 20, 147],     // deep pink
    'H': [0, 191, 255],      // deep sky blue
    'A': [186, 85, 211],     // medium orchid
    'K': [112, 128, 144],    // slate gray
    'L': [255, 228, 196],    // bisque
    '7': [210, 105, 30],     // chocolate
    'N': [70, 130, 180],     // steel blue
    'P': [128, 0, 128],      // purple
    'Q': [100, 149, 237],    // cornflower blue
    'R': [0, 100, 0],        // dark green
    'S': [72, 61, 139],      // dark slate blue
    '4': [255, 69, 0],       // orange red
    'U': [47, 79, 79],       // dark slate gray
    'V': [189, 183, 107],    // dark khaki
    '3': [199, 21, 133],     // medium violet red
    'X': [0, 139, 139],      // dark cyan
    'Y': [233, 150, 122],    // dark salmon
    'Z': [153, 50, 204],     // dark orchid
    'a': [255, 140, 0],      // dark orange
    'b': [34, 139, 34],      // forest green
    'c': [123, 104, 238],    // medium slate blue
    'd': [250, 128, 114],    // salmon
    'e': [255, 160, 122],    // light salmon
    'f': [95, 158, 160],     // cadet blue
    '8': [255, 99, 71],      // tomato
    'h': [218, 112, 214],    // orchid
    'i': [154, 205, 50],     // yellow green
    'j': [147, 112, 219],    // medium purple
    'k': [106, 90, 205],     // slate blue
    'm': [60, 179, 113],     // medium sea green
    'n': [176, 196, 222],    // light steel blue
    'p': [0, 206, 209],      // dark turquoise
    'q': [238, 130, 238],    // violet
    'r': [205, 92, 92],      // indian red
    's': [244, 164, 96],     // sandy brown
  };

  // Populate named colors into the map
  for (const [char, rgb] of Object.entries(namedColors)) {
    map[char] = rgb;
  }

  // Grayscale range (t–y)
  map['t'] = [32, 32, 32];     // dark gray
  map['u'] = [80, 80, 80];     // medium dark
  map['v'] = [127, 127, 127];  // middle gray
  map['w'] = [192, 192, 192];  // light gray
  map['x'] = [224, 224, 224];  // very light
  map['y'] = [255, 255, 255];  // white

  // Special or null/alert/padding
  map['z'] = [255, 0, 255];    // magenta (reserved)

  return map;
}


function renderChordToHtml(targetEl, lines, colorMap, asJson = false, bgColor = '#fff') {
  targetEl.innerHTML = '';
  targetEl.style.backgroundColor = bgColor;

  if (asJson) {
    const open = document.createElement('div');
    open.textContent = '[';
    open.style.color = 'gray';
    targetEl.appendChild(open);
  }

  lines.forEach((line, i) => {
    const row = document.createElement('div');

    if (asJson) {
      const quoteOpen = document.createElement('span');
      quoteOpen.textContent = '"';
      quoteOpen.style.color = 'gray';
      row.appendChild(quoteOpen);
    }

    line.split('').forEach((char, j) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.padding = '0px';
      span.style.fontFamily = 'monospace';

      if (j >= line.length - 6) {
        // Last 6 chars = checksum
        span.style.color = 'gray';
      } else {
        const rgb = colorMap[char] || [150, 150, 150];
        span.style.color = `rgb(${rgb.join(',')})`;
      }

      row.appendChild(span);
    });

    if (asJson) {
      const quoteClose = document.createElement('span');
      quoteClose.textContent = '"';
      quoteClose.style.color = 'gray';
      row.appendChild(quoteClose);

      if (i < lines.length - 1) {
        const comma = document.createElement('span');
        comma.textContent = ',';
        comma.style.color = 'gray';
        row.appendChild(comma);
      }
    }

    targetEl.appendChild(row);
  });

  if (asJson) {
    const close = document.createElement('div');
    close.textContent = ']';
    close.style.color = 'gray';
    targetEl.appendChild(close);
  }
}


function __renderChordToHtml(targetEl, lines, colorMap, asJson = false) {
  targetEl.innerHTML = '';

  if (asJson) {
    const open = document.createElement('div');
    open.textContent = '[';
    open.style.color = 'gray';
    targetEl.appendChild(open);
  }

  lines.forEach((line, i) => {
    const row = document.createElement('div');

    if (asJson) {
      const quoteOpen = document.createElement('span');
      quoteOpen.textContent = '"';
      quoteOpen.style.color = 'gray';
      row.appendChild(quoteOpen);
    }

    line.split('').forEach((char, j) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.padding = '2px';

      if (j >= line.length - 6) {
        // Last 6 characters (checksum) — gray
        span.style.color = 'gray';
      } else {
        const rgb = colorMap[char] || [150, 150, 150];
        span.style.color = `rgb(${rgb.join(',')})`;
      }

      row.appendChild(span);
    });

    if (asJson) {
      const quoteClose = document.createElement('span');
      quoteClose.textContent = '"';
      quoteClose.style.color = 'gray';
      row.appendChild(quoteClose);

      if (i < lines.length - 1) {
        const comma = document.createElement('span');
        comma.textContent = ',';
        comma.style.color = 'gray';
        row.appendChild(comma);
      }
    }

    targetEl.appendChild(row);
  });

  if (asJson) {
    const close = document.createElement('div');
    close.textContent = ']';
    close.style.color = 'gray';
    targetEl.appendChild(close);
  }
}

function renderToHtml(targetEl, text, colorMap) {
  targetEl.innerHTML = '';

  for (let i = 0; i < text.length; i += 12) {
    const row = document.createElement('div');
    text.slice(i, i + 12).split('').forEach(char => {
      const rgb = colorMap[char] || [150, 150, 150];
      const span = document.createElement('span');
      span.textContent = char;
      span.style.color = `rgb(${rgb.join(',')})`;
      span.style.padding = '2px';
      row.appendChild(span);
    });
    targetEl.appendChild(row);
  }
}

function renderToConsole(text, colorMap, rowSize = 12) {
    const styled = [];
    const styles = [];

    text.split('').forEach(char => {
      const rgb = colorMap[char];
      styled.push(`%c${char}`);
      styles.push(`color: rgb(${rgb.join(',')}); font-weight: bold`);
    });

    for (let i = 0; i < styled.length; i += rowSize) {
      console.log(
        styled.slice(i, i + rowSize).join(''),
        ...styles.slice(i, i + rowSize)
      );
    }
  }


function renderChordToConsole(lines, colorMap, asJson = false) {
  const styled = [];
  const styles = [];

  if (asJson) styled.push('%c[', 'color: gray;');

  lines.forEach((line, i) => {
    if (asJson) {
      styled.push('%c"', 'color: gray;');
    }

    line.split('').forEach((char, j) => {
      if (j >= line.length - 6) {
        styled.push(`%c${char}`);
        styles.push('color: gray;');
      } else {
        const rgb = colorMap[char] || [150, 150, 150];
        styled.push(`%c${char}`);
        styles.push(`color: rgb(${rgb.join(',')}); font-weight: bold`);
      }
    });

    if (asJson) {
      styled.push('%c"', 'color: gray;');
      if (i < lines.length - 1) styled.push('%c,', 'color: gray;');
    }

    if (i < lines.length - 1) {
      styled.push('\n');
    }
  });

  if (asJson) styled.push('%c]', 'color: gray;');

  console.log(styled.join(''), ...styles);
}





  // Export to global
  global.Base58Color = {
    base58,
    hsvToRgb,
    getColorMap: getBase58ColorMap,
    renderToHtml,
    renderToConsole,
    renderChordToHtml,
    renderChordToConsole
  };
})(window);

