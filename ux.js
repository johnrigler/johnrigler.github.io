ux = []

ux.renderObjectTable = function renderObjectTable(targetId, objectArray, visibleKeys, onSubmit) {
  const container = document.getElementById(targetId);
  container.innerHTML = '';

  if (!Array.isArray(objectArray) || objectArray.length === 0) {
    container.textContent = 'No data to display.';
    return;
  }

  // Determine columns
  const headers = Array.isArray(visibleKeys) && visibleKeys.length > 0
    ? visibleKeys
    : Array.from(new Set(objectArray.flatMap(obj => Object.keys(obj))));

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.maxWidth = '800px';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // --- Select All / Unselect All toggle
  const selectToggleTh = document.createElement('th');
  selectToggleTh.style.padding = '4px 8px';
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Select All';
  toggleBtn.onclick = () => {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    toggleBtn.textContent = allChecked ? 'Select All' : 'Unselect All';
  };
  selectToggleTh.appendChild(toggleBtn);
  headerRow.appendChild(selectToggleTh);

  // --- Remaining headers
  headers.forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    th.style.textAlign = 'left';
    th.style.padding = '4px 8px';
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  objectArray.forEach((obj, index) => {
    const row = document.createElement('tr');
    row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f0f0f0';

    const checkboxCell = document.createElement('td');
    checkboxCell.style.padding = '4px 8px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.index = index;
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    headers.forEach(key => {
      const td = document.createElement('td');
      td.textContent = key in obj ? obj[key] : '';
      td.style.padding = '4px 8px';
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  const button = document.createElement('button');
  button.textContent = 'Submit Selection';
  button.style.marginTop = '12px';
  button.onclick = () => {
    const selected = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => objectArray[cb.dataset.index]);
    if (typeof onSubmit === 'function') {
      onSubmit(selected);
    } else {
      console.log('Selected:', selected);
    }
  };

  container.appendChild(button);
}

function writeTabletToDiv(tablet, divId) {
  const container = document.getElementById(divId);
  if (!container) {
    console.error(`Element with id '${divId}' not found.`);
    return;
  }

  // Clear existing content
  container.innerHTML = '';

  // Create a <pre> block for monospaced formatting
  const pre = document.createElement('pre');
  pre.style.whiteSpace = 'pre-wrap'; // optional: allow wrapping
  pre.style.fontFamily = 'monospace';

  // Join each address on a new line
  pre.textContent = tablet.join('\n');

  container.appendChild(pre);
}

