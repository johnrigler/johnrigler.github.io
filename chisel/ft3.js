(function(){
  return function(targetDiv){
    if (typeof targetDiv === "string") targetDiv = document.getElementById(targetDiv);
    if (!targetDiv) return;

    targetDiv.innerHTML = `
      <div class="ft-inner">
        <h1 class="ft-title">FUCK TRUMP</h1>
        <p class="ft-sub">Wannabe fascist. Accountability, not applause.</p>
        <blockquote class="ft-quote">
          Freedom of speech means calling out authoritarianism without fear.  
          This is a digital protest artifact, etched here to resist forgetting.
        </blockquote>
      </div>
      <style>
        #\${targetDiv.id} .ft-inner{
          background: linear-gradient(135deg,#111 0%, #2b2b2b 100%);
          color:#fff; border-radius:12px; padding:16px 20px;
          font-family:system-ui, sans-serif;
          max-width:600px;
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
        #\${targetDiv.id} .ft-quote{
          font-size:13px; line-height:1.5; opacity:.75;
          border-left:3px solid #ff3b30;
          padding-left:10px; margin:0;
        }
      </style>
    `;
  }
})();

