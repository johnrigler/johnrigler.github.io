
mainMenu.items.import.html = `
<hr><br><br><hr>
<div id="controls"> 
  <input type="file" id="imgInput">

  <!-- Toggle buttons -->
  <div style="margin-bottom:10px;">
    <button id="toAdvancedBtn" onclick="toggleMode(true)">Show Advanced Options</button>
    <button id="toSimpleBtn" style="display:none;" onclick="toggleMode(false)">Back to Simple Mode</button>
  </div>

<div id="simpleControls" style="margin-bottom:10px;">
  <button id="doubleSizeBtn" onclick="setSimpleSize(true)">Double Size (52 Width)</button>
  <button id="normalSizeBtn" style="display:none;" onclick="setSimpleSize(false)">Back to 26 Width</button>
</div>


  <div id="advancedOptions" style="display:none; margin-top:10px;">
    <div class="form-grid">
      <table border=2>
        <tr>
          <td>
            <label>Cols <input id="cols" type="number" value="224" style="width: 60px;"></label>
            <label>Rows <input id="rows" type="number" value="270" style="width: 60px;"></label>
               <label>
                  <input type="checkbox" id="lockAspect" checked>
                  Lock Aspect Ratio
                  </label>

            <hr>
            <label>X Offset <input id="xOffset" type="number" value="0" style="width: 60px;"></label>
            <label>Y Offset <input id="yOffset" type="number" value="0" style="width: 60px;"></label>
            <label>Scale <input id="scale" type="number" value="1" style="width: 60px;"></label>
          </td>
          <td>
            <table border=1>
              <th colspan=2>Trim</th> 
              <tr><td>Top<td><input id="trimTop" type="number" value="0" style="width: 60px;"></tr>   
              <tr><td>Bottom<td><input id="trimBottom" type="number" value="0" style="width: 60px;"></tr>   
              <tr><td>Left<td><input id="trimLeft" type="number" value="0" style="width: 60px;"></tr>
              <tr><td>Right<td><input id="trimRight" type="number" value="0" style="width: 60px;"></tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <button id="reloadButton" onclick="reloadImage()">Reload</button>
  <button id="sendToTablet" onclick=sendToTablet()">Send to Tablet</button>
<table><tr><td>
  <br><canvas id="canvaz"></canvas>
  <td><pre id="output"></pre></tr></table>
</div>
`;

let lastCols = null;
let lastRows = null;

document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'cols' && imgImp) {
    const aspectRatio = imgImp.height / imgImp.width;
    const rowsInput = document.getElementById('rows');
    rowsInput.value = Math.round(parseInt(e.target.value) * aspectRatio);
  }
});

/*
document.addEventListener('input', (e) => {
  if (!imgImp) return;
  const aspectLocked = document.getElementById('lockAspect')?.checked;
  if (!aspectLocked) return;

  const aspectRatio = imgImp.height / imgImp.width;
  const colsInput = document.getElementById('cols');
  const rowsInput = document.getElementById('rows');

  if (e.target.id === 'cols') {
    rowsInput.value = Math.round(parseInt(colsInput.value) * aspectRatio);
  } else if (e.target.id === 'rows') {
    colsInput.value = Math.round(parseInt(rowsInput.value) / aspectRatio);
  }
});
*/

document.addEventListener('input', (e) => {
  if (!imgImp) return;
  const aspectLocked = document.getElementById('lockAspect')?.checked;
  if (!aspectLocked) return;

  const aspectRatio = imgImp.height / imgImp.width;
  const colsInput = document.getElementById('cols');
  const rowsInput = document.getElementById('rows');

  // Grab trim inputs
  const trimTopEl = document.getElementById('trimTop');
  const trimBottomEl = document.getElementById('trimBottom');
  const trimLeftEl = document.getElementById('trimLeft');
  const trimRightEl = document.getElementById('trimRight');

  const oldCols = lastCols || parseInt(colsInput.value);
  const oldRows = lastRows || parseInt(rowsInput.value);

  if (e.target.id === 'cols') {
    const newCols = parseInt(colsInput.value);
    const colScale = newCols / oldCols;
    rowsInput.value = Math.round(newCols * aspectRatio);

    // Scale left/right trims
    trimLeftEl.value = Math.round(parseInt(trimLeftEl.value) * colScale);
    trimRightEl.value = Math.round(parseInt(trimRightEl.value) * colScale);

    lastCols = newCols;
    lastRows = parseInt(rowsInput.value);

  } else if (e.target.id === 'rows') {
    const newRows = parseInt(rowsInput.value);
    const rowScale = newRows / oldRows;
    colsInput.value = Math.round(newRows / aspectRatio);

    // Scale top/bottom trims
    trimTopEl.value = Math.round(parseInt(trimTopEl.value) * rowScale);
    trimBottomEl.value = Math.round(parseInt(trimBottomEl.value) * rowScale);

    lastCols = parseInt(colsInput.value);
    lastRows = newRows;
  }
});



// let advancedMode = false;
let simpleDouble = false; // false = 26 width, true = 52 width


// Ensure default values are set for simple mode
document.addEventListener('DOMContentLoaded', () => {
  const colsInput = document.getElementById('cols');
  const rowsInput = document.getElementById('rows');
  const scaleInput = document.getElementById('scale');
  
  if (colsInput && rowsInput) {
    colsInput.value = 26; // default 26 columns
    scaleInput.value = 7;

    // Adjust rows automatically when cols changes (preserve aspect ratio)
    colsInput.addEventListener('input', () => {
      if (imgImp) {
        const aspectRatio = imgImp.height / imgImp.width;
        rowsInput.value = Math.round(colsInput.value * aspectRatio);
      }
    });
  }
});

// controls.innerHTML = t;

function toggleMode(enableAdvanced) {
  advancedMode = enableAdvanced;
  document.getElementById('advancedOptions').style.display = enableAdvanced ? 'block' : 'none';
  document.getElementById('toAdvancedBtn').style.display = enableAdvanced ? 'none' : 'inline-block';
  document.getElementById('toSimpleBtn').style.display = enableAdvanced ? 'inline-block' : 'none';
  document.getElementById('simpleControls').style.display = enableAdvanced ? 'none' : 'block';
  
  if (imgImp) reloadImage();
}

function setSimpleSize(doubleMode) {
  simpleDouble = doubleMode;
  document.getElementById('doubleSizeBtn').style.display = doubleMode ? 'none' : 'inline-block';
  document.getElementById('normalSizeBtn').style.display = doubleMode ? 'inline-block' : 'none';
  if (imgImp) reloadImage();
}



const colorMap  = {
        // Named colors (52) + emergency color 'z'
        '1': [255, 0, 0], '2': [0, 128, 0], '3': [0, 0, 255], '4': [255, 255, 0],
        '5': [255, 165, 0], '6': [165, 42, 42], '7': [255, 192, 203], '8': [0, 255, 255],
        '9': [255, 105, 180], 'A': [0, 128, 128], 'B': [255, 215, 0], 'C': [139, 69, 19],
        'D': [173, 216, 230], 'E': [124, 252, 0], 'F': [240, 230, 140], 'G': [255, 20, 147],
        'H': [0, 191, 255], 'J': [186, 85, 211], 'K': [112, 128, 144], 'L': [255, 228, 196],
        'M': [210, 105, 30], 'N': [70, 130, 180], 'P': [128, 0, 128], 'Q': [100, 149, 237],
        'R': [0, 100, 0], 'S': [72, 61, 139], 'T': [255, 69, 0], 'U': [47, 79, 79],
        'V': [189, 183, 107], 'W': [199, 21, 133], 'X': [0, 139, 139], 'Y': [233, 150, 122],
        'Z': [153, 50, 204], 'a': [255, 140, 0], 'b': [34, 139, 34], 'c': [123, 104, 238],
        'd': [250, 128, 114], 'e': [255, 160, 122], 'f': [95, 158, 160], 'g': [255, 99, 71],
        'h': [218, 112, 214], 'i': [154, 205, 50], 'j': [147, 112, 219], 'k': [106, 90, 205],
        'm': [60, 179, 113], 'n': [176, 196, 222], 'p': [0, 206, 209], 'q': [238, 130, 238],
        'r': [205, 92, 92], 's': [244, 164, 96],
        'z': [255, 0, 255], // emergency
        // Grayscale (t–y)
        't': [0, 0, 0],        // black
        'u': [51, 51, 51],     // dark gray
        'v': [102, 102, 102],  // medium-dark
        'w': [153, 153, 153],  // medium-light
        'x': [204, 204, 204],  // light gray
        'y': [255, 255, 255]   // white
      };


let imgImp = null;

function rgbDist(c1, c2) {
  return Math.sqrt(
    (c1[0] - c2[0]) ** 2 +
    (c1[1] - c2[1]) ** 2 +
    (c1[2] - c2[2]) ** 2
  );
}

function getClosestChar(rgb) {
  let bestChar = 'z';
  let minDist = Infinity;

  for (const [char, col] of Object.entries(Tablet.colors)) {
    const dist = rgbDist(rgb, [col.r, col.g, col.b]);
    if (dist < minDist) {
      minDist = dist;
      bestChar = char;
    }
  }
  return bestChar;
}

getCharCount = function getCharCount() {

  // Display character count at the top
  const countDisplay = document.getElementById('lineCharCount') || (() => {
    const p = document.createElement('p');
    p.id = 'lineCharCount';
    p.style.fontFamily = 'monospace';
    const container = document.getElementById('controls') || document.body;
    container.insertBefore(p, container.firstChild);
    return p;
  })();
  cpl = dgb.debug.trummedCols;
  countDisplay.textContent = `Characters per line: ${dgb.debug.trimmedCols}`;
  if (cpl <= 26)
  countDisplay.textContext += `Ready to Chisel!`;

}



function reloadImage() {
  if (!imgImp) return;

  let targetCols, targetRows, scale, xOffset, yOffset,
      trimTop, trimBottom, trimLeft, trimRight;

  if (advancedMode) {

    targetCols = parseInt(document.getElementById('cols').value);
    const aspectRatio = imgImp.height / imgImp.width;
    targetRows = Math.round(targetCols * aspectRatio);

    // let lastCols = null;
    // let lastRows = null;


const aspectLocked = document.getElementById('lockAspect')?.checked;
if (aspectLocked && imgImp) {
  const aspectRatio = imgImp.height / imgImp.width;
  // Use whichever value the user just changed
  if (document.activeElement.id === 'cols') {
    targetRows = Math.round(targetCols * aspectRatio);
    document.getElementById('rows').value = targetRows;
  } else if (document.activeElement.id === 'rows') {
    targetCols = Math.round(targetRows / aspectRatio);
    document.getElementById('cols').value = targetCols;
  }
}

  // Reflect this in the Rows input so controls match
    const rowsInput = document.getElementById('rows');
    if (rowsInput) rowsInput.value = targetRows;

    scale = parseFloat(document.getElementById('scale').value);
    xOffset = parseInt(document.getElementById('xOffset')?.value || 0);
    yOffset = parseInt(document.getElementById('yOffset')?.value || 0);
    trimTop = parseInt(document.getElementById('trimTop')?.value || 0);
    trimBottom = parseInt(document.getElementById('trimBottom')?.value || 0);
    trimLeft = parseInt(document.getElementById('trimLeft')?.value || 0);
    trimRight = parseInt(document.getElementById('trimRight')?.value || 0);
  } else 
    {
    targetCols = simpleDouble ? 52 : 26;
    scale = 7;
    xOffset = 0;
    yOffset = 0;
    trimTop = 0;
    trimBottom = 0;
    trimLeft = 0;
    trimRight = 0;
    const aspectRatio = imgImp.height / imgImp.width;
    targetRows = Math.round(targetCols * aspectRatio);
    }

  const trimmedCols = targetCols - trimLeft - trimRight;
  const trimmedRows = targetRows - trimTop - trimBottom;
  dgb.debug.trimmedCols = trimmedCols;
  dgb.debug.trimmedRows = trimmedRows;

  const canvas = document.getElementById('canvaz');
  const ctx = canvas.getContext('2d');

  canvas.width = trimmedCols * scale;
  canvas.height = trimmedRows * scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = targetCols;
  tempCanvas.height = targetRows;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(imgImp, xOffset, yOffset, imgImp.width, imgImp.height, 0, 0, targetCols, targetRows);
  const imageData = tempCtx.getImageData(0, 0, targetCols, targetRows).data;

  let output = '';
  // lines = [];
  // 
  for (let y = trimTop; y < targetRows - trimBottom; y++) {
    let line = '';
    for (let x = trimLeft; x < targetCols - trimRight; x++) {
      const idx = (y * targetCols + x) * 4;
      const rgb = [imageData[idx], imageData[idx + 1], imageData[idx + 2]];
      const ch = getClosestChar(rgb);
      line += ch;

      const col = Tablet.colors[ch] || {r:0, g:0, b:0};
      ctx.fillStyle = `rgb(${col.r},${col.g},${col.b})`;

      ctx.fillRect((x - trimLeft) * scale, (y - trimTop) * scale, scale, scale);
    }
    // lines.push(line);
 //   Tablet.rows = [];
    Tablet.rows.push(line);
    output += line + '\n';
  }

lastCols = targetCols;
lastRows = targetRows;


  getCharCount();
}

let advancedMode = false;

function toggleMode(enableAdvanced) {
  advancedMode = enableAdvanced;
  document.getElementById('advancedOptions').style.display = enableAdvanced ? 'block' : 'none';
  document.getElementById('toAdvancedBtn').style.display = enableAdvanced ? 'none' : 'inline-block';
  document.getElementById('toSimpleBtn').style.display = enableAdvanced ? 'inline-block' : 'none';
  
  // Auto-reload image with new mode if one is loaded
  if (imgImp) reloadImage();
}


sendToTablet = async function() {
  c("sendToTablet")
  lines = [];
  Tablet.buildUnique("SN",Tablet.rows).then( lines => {
  Tablet.lines = []
  lines.forEach( x =>
        Tablet.lines.push({[x]: 0.0000546})
            )
    Tablet.lines.push({[dgb.thunder]: 0.0000546})
   })          
}


textBlock = function() {
  // Create a colorized text block with each character styled
  const outEl = document.getElementById('output');
  outEl.innerHTML = '';
  Tablet.rows.forEach(line => {
    const div = document.createElement('div');
    for (const ch of line) {
      const span = document.createElement('span');
      span.textContent = ch;
      const { r, g, b } = Tablet.colors[ch] || { r: 0, g: 0, b: 0 };
      const rgb = [r, g, b];
      span.style.color = `rgb(${rgb.join(',')})`;

      span.style.fontFamily = 'monospace';
      span.style.whiteSpace = 'pre';
      div.appendChild(span);
    }
    outEl.appendChild(div);
  });
}

secondLine = function() {

c(imgInput)

}

