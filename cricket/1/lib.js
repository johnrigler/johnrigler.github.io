
const TOTAL_SUPPLY = 10000;
const PLAYERS = [
  { name: 'Amit', views: 1200, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
  { name: 'Ravi', views: 800, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
  { name: 'Kiran', views: 500, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
  { name: 'Neha', views: 300, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
];
let userFunds = 1000;
let lastTotalValue = 1000;
let history = [];
const NPCS = 12;
const npcHoldings = Array.from({length: NPCS}, () =>
  PLAYERS.map(()=>Math.random()*5)
);

function normalizePrices() {
  const totalViews = PLAYERS.reduce((sum, p) => sum + p.views, 0);
  PLAYERS.forEach(p => {
    p.price = (p.views / totalViews) * (TOTAL_SUPPLY / PLAYERS.length);
  });
}

function totalValue() {
  return userFunds + PLAYERS.reduce((sum, p) => sum + p.owned * p.price, 0);
}

function randomSocialUpdate() {
  PLAYERS.forEach(p => {
    const change = 0.98 + Math.random() * 0.04;
    p.views *= change;
  });
}

function npcTradingStep() {
  for (let n=0; n<NPCS; n++) {
    const target = Math.floor(Math.random()*PLAYERS.length);
    const p = PLAYERS[target];
    const decision = Math.random();
    const amt = (Math.random()*0.5).toFixed(2);
    if (decision < 0.5) {
      npcHoldings[n][target] += parseFloat(amt);
      p.views *= 1.005;
    } else {
      if (npcHoldings[n][target] > 0) npcHoldings[n][target] -= parseFloat(amt);
      p.views *= 0.995;
    }
  }
  randomSocialUpdate();
  render(true);
}

function applyChanges() {
  for (const p of PLAYERS) {
    const change = p.pendingChange;
    if (change > 0) {
      const cost = p.price * change;
      if (userFunds >= cost) {
        p.owned += change;
        userFunds -= cost;
        p.views *= 1.02;
      }
    } else if (change < 0) {
      const sellAmount = Math.min(p.owned, -change);
      p.owned -= sellAmount;
      userFunds += p.price * sellAmount;
      p.views *= 0.98;
    }
    p.pendingChange = 0;
  }
  generateSocialCommentary();
  render(true);
}

function adjustChange(name, delta) {
  const p = PLAYERS.find(x => x.name === name);
  p.pendingChange += delta;
  render(false);
}

function getSocialIndicator(player) {
  if (player.lifetimeChange > 3) return "🔥 On the rise";
  if (player.lifetimeChange > 1) return "▲ Rising steadily";
  if (player.lifetimeChange < -3) return "💀 Falling fast";
  if (player.lifetimeChange < -1) return "▼ Dropping";
  return "— Holding steady";
}

function generateSocialCommentary() {
  PLAYERS.forEach(p => {
    const trend = p.lifetimeChange;
    if (trend > 2) p.commentary = "Major surge in popularity!";
    else if (trend > 0.5) p.commentary = "Gaining traction steadily.";
    else if (trend < -2) p.commentary = "Plummeting in public interest!";
    else if (trend < -0.5) p.commentary = "Slipping noticeably.";
    else p.commentary = "Holding position.";
  });
}

function drawChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  if (!data.length) return;
  const max = Math.max(...data);
  const min = Math.min(...data);
  for (let i=0;i<data.length;i++) {
    const y = canvas.height - ((data[i]-min)/(max-min+1e-6))*canvas.height;
    const x = (i/data.length)*canvas.width;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='#0f0';
  ctx.stroke();
}

render = function render(fromSocialUpdate=false) {
  normalizePrices();
  const sorted = [...PLAYERS].sort((a,b)=>b.price - a.price);

  sorted.forEach((p, index) => {
    const change = p.lastRank !== undefined ? p.lastRank - index : 0;
    p.rankChange = change;
    p.lastRank = index;

    if (change > 0) p.lifetimeChange += 0.2;
    else if (change < 0) p.lifetimeChange -= 0.2;

    if (change >= 1) p.lifetimeArrows = "▲";
    else if (change <= -1) p.lifetimeArrows = "▼";
    else if (change > 0) p.lifetimeArrows = "▲▲";
    else if (change < 0) p.lifetimeArrows = "▼▼";
    else p.lifetimeArrows = "—";

    p.history.push(p.price);
    if (p.history.length>50) p.history.shift();
  });

  const newTotal = totalValue();
  const diff = newTotal - lastTotalValue;
  let changeDisplay = '';
  if (fromSocialUpdate) {
    if (diff>0) changeDisplay = `<p class="up">▲ Portfolio up ${diff.toFixed(2)}</p>`;
    else if (diff<0) changeDisplay = `<p class="down">▼ Portfolio down ${Math.abs(diff).toFixed(2)}</p>`;
    else changeDisplay = `<p>No change</p>`;
    lastTotalValue = newTotal;
  } else {
    changeDisplay = `<p>No change</p>`; 
  }

  let percentRegistry = "<strong>Percent Registry:</strong> ";
  PLAYERS.forEach(p => {
    percentRegistry += `${p.name}: ${(p.price).toFixed(1)}% &nbsp;&nbsp;`;
  });
  document.getElementById('percentRegistry').innerHTML = percentRegistry;

  let html = `
    <p>User funds: ${userFunds.toFixed(2)} | Total: ${newTotal.toFixed(2)}</p>
    ${changeDisplay}
    <button onclick="randomSocialUpdate(); render(true)">Manual Update</button>
    <br><button onclick="applyChanges()">Go</button>

    <table>
    <tr><th>Player</th><th>Rank</th><th>Views</th><th>Price</th><th>Owned</th><th>Trend</th><th>Graph</th><th>Actions</th></tr>`;

  sorted.forEach((p,index) => {
    html += `
      <tr>
        <td>${p.name}</td>
        <td>${index+1}</td>
        <td>${Math.round(p.views)}</td>
        <td>${p.price.toFixed(2)}</td>
        <td>${p.owned.toFixed(2)}</td>
        <td><span class="${p.rankChange>=0?'rank-up':'rank-down'}">${p.lifetimeArrows}</span> ${getSocialIndicator(p)}<br><span class="commentary">${p.commentary}</span></td>
        <td><canvas class="mini-chart" width="100" height="40"></canvas></td>
        <td>
          <button onclick="adjustChange('${p.name}',1)" ${userFunds < p.price ? "disabled" : ""}>▲</button>
          <button onclick="adjustChange('${p.name}',0.2)" ${userFunds < p.price*0.2 ? "disabled" : ""}>▲▲</button>
          <button onclick="adjustChange('${p.name}',-0.2)" ${p.owned < 0.2 ? "disabled" : ""}>▼▼</button>
          <button onclick="adjustChange('${p.name}',-1)" ${p.owned < 1 ? "disabled" : ""}>▼</button>
          <br>
          <span>${p.pendingChange.toFixed(2)}</span><br>
          <span>Cash: ${(p.pendingChange*p.price).toFixed(2)}</span>
        </td>
      </tr>`;
  });

  html += `</table><br><button onclick="applyChanges()">Go</button>`;
  document.getElementById('market').innerHTML = html;

  drawChart(document.getElementById('chart'), history);
  document.querySelectorAll('.mini-chart').forEach((canvas, idx) => {
    drawChart(canvas, sorted[idx].history);
  });
}

setInterval(npcTradingStep, 10000);
generateSocialCommentary();


