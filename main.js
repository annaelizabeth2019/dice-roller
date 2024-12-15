// variables
let diceObj, diceResults, finalResult;
let canReroll = false;
let isVtM = true;

// constants
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
const submitBtn = document.getElementById("submit");
const results = document.getElementById("results");
const resultsFinalEl = document.getElementById("results-final");
const burnAWillpower = document.getElementById("reroll-vtm");
const resetBtn = document.getElementById("reset-vtm");
const vtmArr = Array.from(document.getElementsByClassName("vtm"));

// event listeners
submitBtn.addEventListener("click", submit);
burnAWillpower.addEventListener("click", rerollVTM);
resetBtn.addEventListener("click", reset);

// functions
function render() {
  finalResult = getFinalResult();
  renderResults();

  if (canReroll) {
    burnAWillpower.style = "display: inline-block;";
    canReroll = false;
    return;
  }
  burnAWillpower.style = "display: none;";
  return;

  submitBtn.style = "display: none;";
}

function init() {
  diceResults = [];
  canReroll = false;
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
  let innerHTML = [];
  let resultsFinalInnerHTML = "";
  if (isVtM) {
    let image = "";
    if (diceResults.length > 0) {
      innerHTML = vtmDiceResultsInnerHTML();
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
      resultsFinalInnerHTML = `<div class="vtm valign-wrapper"><div class="valign-wrapper">${finalResult}</div><img class="vtm" src="imgs/${image}" alt="${finalResult}" ></div>`;
      resultsFinalEl.style = "display: block;";
    }
  }
  resultsFinalEl.innerHTML = resultsFinalInnerHTML;
  results.innerHTML = innerHTML.join(" ");
}

// VTM FUNCTIONS

function vtmDiceResultsInnerHTML() {
  let innerHTML = [];
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
    <td class="vtm hunger-dice card col red accent-3 center-align" id="die-${i}-results">
    <p class="vtm center-align">${text}</p><img src="${image}" alt="${d}" class="card-image center-align">
    </td>
    `;
    }
    return `
    <td class="vtm dice card col center-align" id="die-${i}-results">
    <p class="vtm center-align">${text}</p><img src="${image}" alt="${d}" class="vtm card-image center-align">
    </td>
    `;
  });
  let spliceIndexes = [];
  for (let i = 0; i < innerHTML.length; i++) {
    if (!(i % 4) && i != 0) {
      spliceIndexes.push(i);
    }
  }
  spliceIndexes.forEach((v, i) => {
    innerHTML.splice(v + i, 0, `<tr class="vtm">`);
  });
  results.style = "display: table-row-group;";
  return innerHTML;
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
    if ((crits && criticalHunger) || criticalHunger >= 2) {
      return `Messy Crit! (${successes})`;
    }
    if (crits >= 2) {
      return `Crit Success! (${successes})`;
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

function rerollVTM() {
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

function reset() {
  diceResults = [];
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
