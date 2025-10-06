class BettingSim {
  constructor(containerId, chartId, percentId) {
    this.TOTAL_SUPPLY = 10000;
    this.PLAYERS = [
      { name: 'Amit', views: 1200, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
      { name: 'Ravi', views: 800, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
      { name: 'Kiran', views: 500, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
      { name: 'Neha', views: 300, owned: 0, lastRank: 0, lifetimeChange: 0, lifetimeArrows: "", pendingChange: 0, history: [], commentary: "" },
    ];
    this.userFunds = 1000;
    this.lastTotalValue = 1000;
    this.history = [];
    this.NPCS = 10000;
    this.npcHoldings = Array.from({length: this.NPCS}, () =>
      this.PLAYERS.map(()=>Math.random()*5)
    );

    this.container = document.getElementById(containerId);
    this.chartEl = document.getElementById(chartId);
    this.percentEl = document.getElementById(percentId);

    setInterval(() => this.npcTradingStep(), 10000);
    this.generateSocialCommentary();
    this.render();
  }

  normalizePrices() {
    PriceLogic.normalizePrices(this.PLAYERS, this.TOTAL_SUPPLY);
  }

  totalValue() {
    return PriceLogic.totalValue(this.PLAYERS, this.userFunds);
  }

  randomSocialUpdate() {
    PriceLogic.randomSocialUpdate(this.PLAYERS);
  }

  npcTradingStep() {
    PriceLogic.npcTradingStep(this.PLAYERS, this.npcHoldings, this.NPCS);
    this.render(true);
  }

  applyChanges() {
    for (const p of this.PLAYERS) {
      const change = p.pendingChange;
      if (change > 0) {
        const cost = p.price * change;
        if (this.userFunds >= cost) {
          p.owned += change;
          this.userFunds -= cost;
          p.views *= 1.02;
        }
      } else if (change < 0) {
        const sellAmount = Math.min(p.owned, -change);
        p.owned -= sellAmount;
        this.userFunds += p.price * sellAmount;
        p.views *= 0.98;
      }
      p.pendingChange = 0;
    }
    this.generateSocialCommentary();
    this.render(true);
  }

  adjustChange(name, delta) {
    const p = this.PLAYERS.find(x => x.name === name);
    p.pendingChange += delta;
    this.render(false);
  }

  getSocialIndicator(player) {
    if (player.lifetimeChange > 2) return "🔥 On the rise";
    if (player.lifetimeChange > 1) return "▲ Rising steadily";
    if (player.lifetimeChange < -2) return "💀 Falling fast";
    if (player.lifetimeChange < -1) return "▼ Dropping";
    return "— Holding steady";
  }

  generateSocialCommentary() {
    this.PLAYERS.forEach(p => {
      const trend = p.lifetimeChange;
      if (trend > 2) p.commentary = "Major surge in popularity!";
      else if (trend > 0.5) p.commentary = "Gaining traction steadily.";
      else if (trend < -2) p.commentary = "Plummeting in public interest!";
      else if (trend < -0.5) p.commentary = "Slipping noticeably.";
      else p.commentary = "Holding position.";
    });
  }

  drawChart(canvas, data) {
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

  render(fromSocialUpdate=false) {
    this.normalizePrices();
    const sorted = [...this.PLAYERS].sort((a,b)=>b.price - a.price);

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

    const newTotal = this.totalValue();
    const diff = newTotal - this.lastTotalValue;
    let changeDisplay = '';
    if (fromSocialUpdate) {
      if (diff>0) changeDisplay = `<p class="up">▲ Portfolio up ${diff.toFixed(2)}</p>`;
      else if (diff<0) changeDisplay = `<p class="down">▼ Portfolio down ${Math.abs(diff).toFixed(2)}</p>`;
      else changeDisplay = `<p>No change</p>`;
      this.lastTotalValue = newTotal;
    } else {
      changeDisplay = `<p>No change</p>`; 
    }

    let percentRegistry = "<strong>Percent Registry:</strong> ";
    this.PLAYERS.forEach(p => {
      percentRegistry += `${p.name}: ${(p.price).toFixed(1)}% &nbsp;&nbsp;`;
    });
    this.percentEl.innerHTML = percentRegistry;

    let html = `
      <p>User funds: ${this.userFunds.toFixed(2)} | Total: ${newTotal.toFixed(2)}</p>
      ${changeDisplay}
      <button id="manualUpdate">Manual Update</button>
      <br><button id="applyChanges">Go</button>

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
          <td><span class="${p.rankChange>=0?'rank-up':'rank-down'}">${p.lifetimeArrows}</span> ${this.getSocialIndicator(p)}<br><span class="commentary">${p.commentary}</span></td>
          <td><canvas class="mini-chart" width="100" height="40"></canvas></td>
          <td>
            <button class="buy1" data-name="${p.name}" data-delta="1">▲</button>
            <button class="buySmall" data-name="${p.name}" data-delta="0.2">▲▲</button>
            <button class="sellSmall" data-name="${p.name}" data-delta="-0.2">▼▼</button>
            <button class="sell1" data-name="${p.name}" data-delta="-1">▼</button>
            <br>
            <span>${p.pendingChange.toFixed(2)}</span><br>
            <span>Cash: ${(p.pendingChange*p.price).toFixed(2)}</span>
          </td>
        </tr>`;
    });

    html += `</table><br><button id="applyChanges2">Go</button>`;
    this.container.innerHTML = html;

    this.drawChart(this.chartEl, this.history);
    document.querySelectorAll('.mini-chart').forEach((canvas, idx) => {
      this.drawChart(canvas, sorted[idx].history);
    });

    document.getElementById("manualUpdate").onclick = () => { this.randomSocialUpdate(); this.render(true); };
    document.getElementById("applyChanges").onclick = () => this.applyChanges();
    document.getElementById("applyChanges2").onclick = () => this.applyChanges();

    this.container.querySelectorAll("button[data-name]").forEach(btn => {
      const name = btn.getAttribute("data-name");
      const delta = parseFloat(btn.getAttribute("data-delta"));
      btn.onclick = () => this.adjustChange(name, delta);
    });
  }
}

