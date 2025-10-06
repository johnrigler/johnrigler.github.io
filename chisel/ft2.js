// ft.js
(function(){
  return function(targetDiv){
    if (typeof targetDiv === "string") targetDiv = document.getElementById(targetDiv);
    if (!targetDiv) return;

    targetDiv.innerHTML = `
      <div class="ft-inner">
        <h1 class="ft-title">FUCK TRUMP</h1>
        <p class="ft-sub">Wannabe fascist. Accountability, not applause.</p>
        <details class="ft-details">
          <summary>Why this matters</summary>
          <p>This is civic expression: direct critique of authoritarian behavior.</p>
        </details>
        <div class="ft-actions">
          <button class="ft-copy" data-text="FUCK TRUMP — hold power accountable">Copy chant</button>
          <button class="ft-toggle-compact">Compact</button>
        </div>
      </div>
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
      btnCompact.textContent = targetDiv.classList.contains('compact') ? 'Expand' : 'Compact';
    });
  }
})();

