(function(){
  return function(targetDiv){
    if (typeof targetDiv === "string") targetDiv = document.getElementById(targetDiv);
    if (!targetDiv) return;

    targetDiv.innerHTML = `
      <div class="ft-inner">
        <h1 class="ft-title">FUCK TRUMP</h1>
        <p class="ft-sub">Wannabe fascist. Accountability, not applause.</p>
        <p class="ft-manifesto">
          This artifact exists as an act of protest. Trump embodies the hollow spectacle of power,
          wrapping cruelty in patriotism and selling authoritarianism as entertainment. We refuse
          to normalize his lies, corruption, or the cult of personality he feeds on. Speaking
          these words is not about politeness but about clarity: resistance means naming the threat,
          rejecting fascist theatrics, and standing in defense of democratic freedom. This digital
          inscription is a reminder that silence is complicity, and complicity is unacceptable.
        </p>
      </div>
      <style>
        #\${targetDiv.id} .ft-inner{
          background: linear-gradient(135deg,#111 0%, #2b2b2b 100%);
          color:#fff; border-radius:12px; padding:18px 22px;
          font-family:system-ui, sans-serif;
          max-width:700px; line-height:1.5;
        }
        #\${targetDiv.id} .ft-title{
          margin:0; font-size:28px; text-transform:uppercase;
          background: linear-gradient(90deg,#ff3b30,#ff5e3a);
          -webkit-background-clip:text; background-clip:text;
          color:transparent; font-weight:900;
        }
        #\${targetDiv.id} .ft-sub{
          margin:6px 0 12px; font-size:14px; opacity:.85;
        }
        #\${targetDiv.id} .ft-manifesto{
          margin:0; font-size:15px; opacity:.9;
        }
      </style>
    `;
  }
})();

