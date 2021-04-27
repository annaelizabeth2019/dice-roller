const vtmDice = [
  "critical",
  "failure",
  "failure",
  "failure",
  "failure",
  "failure",
  "success",
  "success",
  "success",
  "success",
];
const vtmHungerDice = [
  "critical hunger",
  "bestial failure",
  "failure",
  "failure",
  "failure",
  "failure",
  "success",
  "success",
  "success",
  "success",
];
let diceObj, isVtM, diceResults, finalResult;
let canReroll = false;

// document items
let dice = document.querySelectorAll("dice");
let submitBtn = document.getElementById("submit");
let vtmDiceBtn = document.getElementById("vtm-dice-btn");
let otherDiceBtn = document.getElementById("other-dice-btn");
let results = document.getElementById("results");
let resultsFinalEl = document.getElementById("results-final");
let diceSelectorEl = document.getElementById("dice-selector");
let rerollBtn = document.getElementById("reroll");
let backBtn = document.getElementById("close-btn");

// event listeners
submitBtn.addEventListener("click", submit);
rerollBtn.addEventListener("click", reroll);
backBtn.addEventListener("click", init);
vtmDiceBtn.addEventListener("click", () => {
  isVtM = true;
  render();
});

otherDiceBtn.addEventListener("click", () => {
  isVtM = false;
});
// functions
function render() {
  finalResult = getFinalResult();
  if (isVtM) {
    submitBtn.style = "inline-block;";
    backBtn.style = "display: inline-block";
    document.getElementById("vtm-input-fields").style = "display: initial;";
    document.getElementsByClassName("user-defined").style = "display: none;";
    diceSelectorEl.style = "display:none;";
    innerHTML = diceResults.map((d, i) => {
      let image = "";
      let text = d;
      switch (d) {
        case "failure":
          image = "imgs/fail.png";
          break;
        case "success":
          image = "imgs/success.png";
          break;
        case "critical hunger":
          image = "imgs/beast.png";
          text = "critical";
          break;
        case "bestial failure":
          image = "imgs/grave-fail.png";
          text = "bestial<br />failure";
          break;
        case "critical":
          image = "imgs/fang-icon.png";
      }
      if (i < diceObj.hungerDice.qty) {
        return `
      <td class="hunger-dice card col red accent-3" id="die-${i}-results">
      <p class="center-align">${text}</p><img src="${image}" alt="${d}" class="card-image">
      </td>
      `;
      }
      return `
      <td class="dice card col" id="die-${i}-results">
      <p class="center-align">${text}</p><img src="${image}" alt="${d}" class="card-image">
      </td>
      `;
    });
    if (innerHTML.length > 5) {
      innerHTML.splice(4, 0, "<tr>");
      innerHTML.push("</tr>");
    }
    results.innerHTML = innerHTML.join(" ");
    results.style = "display: table-row-group;";
    resultsFinalEl.innerHTML = `
    <div class="dice" id="die-final-results">
    <h4>${finalResult}</h4>
  </div>
    `;
    if (canReroll) {
      rerollBtn.style = "display: inline-block;";
      canReroll = false;
      return;
    }
    rerollBtn.style = "display: none;";
    return;
  }
  submitBtn.style = "display: none;";
  diceSelectorEl.style = "display: block;";
  document.getElementById("vtm-input-fields").style = "display: none;";
  document.getElementsByClassName("user-defined").style = "display: initial;";
  backBtn.style = "display: none;";
  renderResults();
}

function init() {
  diceResults = [];
  isVtM = false;
  diceObj = {
    hungerDice: {
      qty: 1,
      structure: vtmHungerDice,
    },
    vtmDice: {
      qty: 0,
      structure: vtmDice,
    },
  };
  render();
}

function renderResults() {
  if (isVtM) {
    let image = "";
    switch (finalResult) {
      case "success":
        image = "success-cat.png";
        break;
      case "Fail":
        image = "fail-cat.png";
        break;
      case "Bestial Fail!":
        image = "trash-cat.png";
        break;
      case "Crit Success!":
        image = "crit-success-cat.png";
        break;
      case "Messy Crit!":
        image = "kick-cat.png";
        break;
      default:
        image = "success-cat.png";
    }
    resultsFinalEl.innerHTML = `<div class="valign-wrapper">${finalResult}<img src="imgs/${image}" alt="${finalResult}" class="card-image"></div>`;
    return;
  }
  resultsFinalEl.style = "display: none;";
}

function getFinalResult() {
  if (isVtM) {
    let successes = 0;
    let fails = 0;
    let crits = 0;
    let criticalHunger = 0;
    let bestialFailures = 0;
    diceResults.forEach((d, i) => {
      switch (d) {
        case "success":
          successes += 1;
          break;
        case "failure":
          fails += 1;
          break;
        case "bestial failure":
          bestialFailures += 1;
          break;
        case "critical":
          crits += 1;
          break;
        case "critical hunger":
          criticalHunger += 1;
          break;
      }
    });
    if ((crits == 1 && !criticalHunger) || (!crits && criticalHunger == 1)) {
      successes += 1; // one pt added to successes when there is only one crit
    }
    if (!successes && !bestialFailures && !crits && !criticalHunger) {
      return "Fail";
    }
    if (!successes && bestialFailures && !crits && !criticalHunger) {
      return "Bestial Fail!";
    }
    if ((crits && criticalHunger) || criticalHunger > 2) {
      return "Messy Crit!";
    }
    if (crits >= 2) {
      return "Crit Success!";
    }
    if (successes == 0) {
      return "Fail";
    }
    return "Success: " + successes;
  }
  return "and I oop";
}

function rollVtmHungerDie() {
  let r = Math.floor(Math.random() * diceObj.hungerDice.structure.length);
  return diceObj.hungerDice.structure[r];
}

function rollVtmDie() {
  let r = Math.floor(Math.random() * diceObj.vtmDice.structure.length);
  return diceObj.vtmDice.structure[r];
}

function rollVtMDice(dicepool) {
  let results = [];
  let fails = 0;
  for (let i = 0; i < dicepool; i++) {
    if (i < diceObj.hungerDice.qty) {
      results[i] = rollVtmHungerDie();
      continue;
    }
    results[i] = rollVtmDie();
    if (results[i] == "failure") {
      fails++;
    }
  }
  if (fails > 0) canReroll = true;
  return results;
}

function reroll() {
  canReroll = false;
  let times = 0;
  diceResults = diceResults.map((die, i) => {
    if (i < hunger.value || die != "failure" || times >= 3) {
      return die;
    }
    times++;
    return rollVtmDie();
  });
  render();
}

function submit() {
  if (isVtM) {
    let dicepool = document.getElementById("dice-pool").value;
    let hunger = document.getElementById("hunger").value;
    diceObj = {
      hungerDice: {
        qty: hunger,
        structure: vtmHungerDice,
      },
      vtmDice: {
        qty: dicepool - hunger,
        structure: vtmDice,
      },
    };
    diceResults = rollVtMDice(dicepool);
  }
  render();
}
init();
