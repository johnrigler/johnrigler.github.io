function renderFuckTrump(targetDiv) { if (typeof targetDiv === "string") {
    targetDiv = document.getElementById(targetDiv);
  }
  if (!targetDiv) return;

  targetDiv.innerHTML = `
    <div class="ft-inner">
      <h1 class="ft-title">FUCK TRUMP</h1>
      <p class="ft-sub">Wannabe fascist. Accountability, not applause.</p>

      <details class="ft-details">
        <summary>Why this matters</summary>
        <p>
          This is civic expression: direct critique of authoritarian behavior.
        </p>
      </details>

      <div class="ft-actions">
        <button class="ft-copy" data-text="FUCK TRUMP — hold power accountable">Copy chant</button>
        <button class="ft-toggle-compact">Compact</button>
      </div>
    </div>
    <style>
      #\${targetDiv.id} .ft-inner{
        background: linear-gradient(135deg,#111 0%, #2b2b2b 100%);
        color:#fff; border-radius:12px; padding:14px 18px;
        font-family:system-ui, sans-serif;
      }
      #\${targetDiv.id} .ft-title{
        margin:0; font-size:20px; text-transform:uppercase;
        background: linear-gradient(90deg,#ff3b30,#ff5e3a);
        -webkit-background-clip:text; background-clip:text;
        color:transparent; font-weight:800;
      }
      #\${targetDiv.id} .ft-sub{ margin:0; font-size:12px; opacity:.85; }
      #\${targetDiv.id} details.ft-details summary{ cursor:pointer; }
      #\${targetDiv.id} .ft-actions{ display:flex; gap:8px; margin-top:8px; }
      #\${targetDiv.id} button{
        border:0; padding:6px 10px; border-radius:6px; cursor:pointer;
        font-size:12px; background:rgba(255,255,255,0.08); color:#fff;
      }
      #\${targetDiv.id}.compact .ft-sub,
      #\${targetDiv.id}.compact details{ display:none; }
    </style>
  `;

  const btnCopy = targetDiv.querySelector('.ft-copy');
  const btnCompact = targetDiv.querySelector('.ft-toggle-compact');

  btnCopy.addEventListener('click', async (e) => {
    const text = e.currentTarget.getAttribute('data-text');
    try {
      await navigator.clipboard.writeText(text);
      e.currentTarget.textContent = 'Copied';
    } catch {
      e.currentTarget.textContent = 'Copy failed';
    }
    setTimeout(()=> e.currentTarget.textContent = 'Copy chant', 1500);
  });

  btnCompact.addEventListener('click', () => {
    targetDiv.classList.toggle('compact');
    btnCompact.textContent = targetDiv.classList.contains('compact')
      ? 'Expand' : 'Compact';
  });
}

