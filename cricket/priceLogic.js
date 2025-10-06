const PriceLogic = {
  normalizePrices(players, totalSupply) {
    const totalViews = players.reduce((sum, p) => sum + p.views, 0);
    players.forEach(p => {
      p.price = (p.views / totalViews) * (totalSupply / players.length);
    });
  },

  totalValue(players, userFunds) {
    return userFunds + players.reduce((sum, p) => sum + p.owned * p.price, 0);
  },

  randomSocialUpdate(players) {
    players.forEach(p => {
      const change = 0.98 + Math.random() * 0.04;
      p.views *= change;
    });
  },

  npcTradingStep(players, npcHoldings, npcCount) {
    for (let n = 0; n < npcCount; n++) {
      const target = Math.floor(Math.random() * players.length);
      const p = players[target];
      const decision = Math.random();
      const amt = (Math.random() * 0.5).toFixed(2);
      if (decision < 0.5) {
        npcHoldings[n][target] += parseFloat(amt);
        p.views *= 1.005;
      } else {
        if (npcHoldings[n][target] > 0) npcHoldings[n][target] -= parseFloat(amt);
        p.views *= 0.995;
      }
    }
    this.randomSocialUpdate(players);
  }
};

