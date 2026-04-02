function openMultiSelectPopup(items) {
  return new Promise(resolve => {
    // overlay
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:rgba(0,0,0,0.4);z-index:9998;';

    // popup box
    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
      'background:#fff;color:#000;padding:20px;border-radius:6px;' +
      'min-width:240px;max-height:70%;overflow:auto;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.4);';

    // list
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = 0;
    ul.style.margin = '0 0 10px 0';

    items.forEach(txt => {
      const li = document.createElement('li');
      li.style.marginBottom = '4px';
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = txt;
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + txt));
      li.appendChild(label);
      ul.appendChild(li);
    });

    // buttons
    const btnRow = document.createElement('div');
    btnRow.style.textAlign = 'right';
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.marginLeft = '8px';
    btnRow.append(okBtn, cancelBtn);

    // assemble
    box.appendChild(ul);
    box.appendChild(btnRow);
    document.body.append(overlay, box);

    // logic
    function cleanup(result) {
      box.remove();
      overlay.remove();
      resolve(result);
    }
    okBtn.onclick = () => {
      const chosen = Array.from(ul.querySelectorAll('input:checked')).map(c => c.value);
      cleanup(chosen);
    };
    cancelBtn.onclick = () => cleanup(null);
    overlay.onclick = () => cleanup(null);
  });
}
