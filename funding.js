    const FUNDING = {
      currency: "$",
      lastUpdated: "October 20, 2026",
      month: "October 2026",
      raised: 0,              // donations received so far this month
      reserve: 0,             // leftover from previous months
      costs: [
        // "note" is optional and shows in small text under the name.
        { name: "Game server",                   amount: 20 },
        { name: "GitHub Pro",                    amount: 4,  note: "Storing the code (tests now run on my own computer)" },
        { name: "Sign-in (Firebase)",            amount: 0,  note: "Free for now — this will go up as more players join. The game\u2019s database and backups run on the game server." },
        { name: "AI tools (LLMs)",               amount: 50 },
        { name: "Domain name",                   amount: 1,  note: "$12 per year, shown here as a monthly cost" },
      ],
      otherIncome: [
        // e.g. { name: "Merch", amount: 0 }  — currently none
      ],
      history: [
        // newest first, e.g.
        // { month: "September 2026", costs: 0, donated: 0 },
      ],
    };
    // ============================================================

    (function () {
      const money = n => FUNDING.currency + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const goal = FUNDING.costs.reduce((sum, c) => sum + c.amount, 0);
      const pct = goal > 0 ? Math.min(100, Math.round(FUNDING.raised / goal * 100)) : 0;

      function addRow(tbody, cells, className) {
        const row = tbody.insertRow();
        if (className) row.className = className;
        cells.forEach(text => { row.insertCell().textContent = text; });
      }

      document.getElementById("last-updated").textContent = "Last updated: " + FUNDING.lastUpdated;

      // Costs
      const costs = document.querySelector("#cost-table tbody");
      FUNDING.costs.forEach(c => {
        addRow(costs, [c.name, money(c.amount)]);
        if (c.note) {
          const note = document.createElement("div");
          note.className = "small";
          note.textContent = c.note;
          costs.rows[costs.rows.length - 1].cells[0].appendChild(note);
        }
      });
      addRow(costs, ["Total", money(goal)], "total");

      // Income
      const income = document.querySelector("#income-table tbody");
      const otherTotal = FUNDING.otherIncome.reduce((sum, i) => sum + i.amount, 0);
      addRow(income, ["Player donations", money(FUNDING.raised)]);
      FUNDING.otherIncome.forEach(i => addRow(income, [i.name, money(i.amount)]));
      if (FUNDING.otherIncome.length === 0) addRow(income, ["Anything else (ads, sales, sponsors)", money(0)]);
      addRow(income, ["Total", money(FUNDING.raised + otherTotal)], "total");

      // Goal + progress bar
      document.getElementById("goal-text").innerHTML =
        "<strong>" + money(FUNDING.raised) + "</strong> donated of " + money(goal) + " needed for " + FUNDING.month;
      const fill = document.getElementById("bar-fill");
      fill.style.width = pct + "%";
      fill.parentElement.setAttribute("aria-valuenow", pct);
      const status = document.getElementById("goal-status");
      if (goal > 0 && FUNDING.raised >= goal) {
        fill.classList.add("done");
        status.textContent = "Goal reached — the servers are covered this month. Thank you! 💚 Anything extra goes into the reserve.";
      } else {
        status.textContent = pct + "% of the way there. " + money(Math.max(0, goal - FUNDING.raised)) + " still needed to cover this month\'s costs.";
      }

      // Reserve
      const yearGoal = goal * 12;
      const months = goal > 0 ? (FUNDING.reserve / goal).toFixed(1) : "0";
      const reservePct = yearGoal > 0 ? Math.min(100, Math.round(FUNDING.reserve / yearGoal * 100)) : 0;
      document.getElementById("reserve-text").innerHTML =
        "Current reserve: <strong>" + money(FUNDING.reserve) + "</strong> of " + money(yearGoal) +
        " needed for a full year of running costs.";
      const reserveFill = document.getElementById("reserve-fill");
      reserveFill.style.width = reservePct + "%";
      reserveFill.parentElement.setAttribute("aria-valuenow", reservePct);
      const reserveStatus = document.getElementById("reserve-status");
      if (yearGoal > 0 && FUNDING.reserve >= yearGoal) {
        reserveFill.classList.add("done");
        reserveStatus.textContent = "A full year is covered! 🎉 Extra donations now go back into the game.";
      } else {
        reserveStatus.textContent = "About " + months + " of 12 months covered.";
      }

      // History
      const history = document.querySelector("#history-table tbody");
      if (FUNDING.history.length === 0) {
        addRow(history, ["No past months yet — Moonwell is just getting started.", "", "", ""]);
      }
      FUNDING.history.forEach(h => addRow(history, [
        h.month, money(h.costs), money(h.donated), h.donated >= h.costs ? "✅ Yes" : "❌ No",
      ]));
    })();
