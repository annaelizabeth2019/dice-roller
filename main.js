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
  "beastial failure",
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
// document items
let dice = document.querySelectorAll("dice");
let submitBtn = document.getElementById("submit");
let vtmDiceBtn = document.getElementById("vtm-dice-btn");
let otherDiceBtn = document.getElementById("other-dice-btn");
let results = document.getElementById("results");
let resultsFinalEl = document.getElementById("results-final");
let diceSelectorEl = document.getElementById("dice-selector");

// event listeners
submitBtn.addEventListener("click", submit);

vtmDiceBtn.addEventListener("click", () => {
  document.getElementById("vtm-input-fields").style = "display: initial;";
  document.getElementsByClassName("user-defined").style = "display: none;";
  diceSelectorEl.style = "display:none;";
  isVtM = true;
});

otherDiceBtn.addEventListener("click", () => {
  document.getElementById("vtm-input-fields").style = "display: none;";
  document.getElementsByClassName("user-defined").style = "display: initial;";
  isVtM = false;
});
// functions
function render() {
  finalResult = getFinalResult();
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
        text = "critical<br />hunger";
        break;
      case "beastial failure":
        image = "imgs/grave-fail.png";
        text = "beastial<br />failure";
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
  renderResults();
}

function init() {
  isVtM = true;

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
}

function renderResults() {
  let image = "";
  switch (finalResult) {
    case "success":
      image = "success-cat.png";
      break;
    case "Fail":
      image = "fail-cat.png";
      break;
    case "Beastial Fail!":
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
}

function getFinalResult() {
  if (isVtM) {
    let successes = 0;
    let fails = 0;
    let crits = 0;
    let criticalHunger = 0;
    let beastialFailures = 0;
    console.log("is vtm final result being calculated...", diceResults);
    diceResults.forEach((d, i) => {
      switch (d) {
        case "success":
          successes += 1;
          break;
        case "failure":
          fails += 1;
          break;
        case "beastial failure":
          beastialFailures += 1;
          break;
        case "critical":
          crits += 1;
          break;
        case "critical hunger":
          criticalHunger += 1;
          break;
      }
    });
    if (!successes && !beastialFailures && !crits && !criticalHunger) {
      return "Fail";
    }
    if (
      (!successes && beastialFailures && !crits && !criticalHunger) ||
      beastialFailures > 2
    ) {
      return "Beastial Fail!";
    }
    if ((crits && criticalHunger) || criticalHunger > 2) {
      return "Messy Crit!";
    }
    if (crits >= 2) {
      return "Crit Success!";
    }
    return "Success: " + successes;
  }
  return "and I oop";
}

function rollVtMDice(dicepool) {
  let results = [];
  for (let i = 0; i < dicepool; i++) {
    if (i < diceObj.hungerDice.qty) {
      r = Math.floor(Math.random() * diceObj.hungerDice.structure.length);
      results[i] = diceObj.hungerDice.structure[r];
      continue;
    }
    r = Math.floor(Math.random() * diceObj.vtmDice.structure.length);
    results[i] = diceObj.vtmDice.structure[r];
  }
  return results;
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
