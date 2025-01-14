// variables
let diceObj, state;

// dice results
const failure = "failure"
const critical = "critical"
const success = "success"
const messyCrit = "messyCrit"
const criticalHungerDie = "criticalHungerDie"
const beastialFailure = "beastialFailure"
// other consts
const maxDicePerLine = 4
const critMin = 2
const maxRerollableDice = 3

// dice
const vtmDice = [
  critical,
  failure,
  failure,
  failure,
  failure,
  failure,
  success,
  success,
  success,
  success,
];
const vtmHungerDice = [
  criticalHungerDie,
  beastialFailure,
  failure,
  failure,
  failure,
  failure,
  success,
  success,
  success,
  success,
];

// images
const finalResultImgs = {
  success: "success-cat.png",
  failure: "fail-cat.png",
  beastialFailure: "trash-cat.png",
  critical: "crit-success-cat.png",
  messyCrit: "kick-cat.png",
};
const diceResultImgs = {
  failure: "fail.png",
  success: "success.png",
  criticalHungerDie: "beast.png",
  beastialFailure: "grave-fail.png",
  critical: "fang-icon.png"
}

// html elements
const elements = {
  submitBtn: document.getElementById("submit"),
  results: document.getElementById("results"),
  resultsFinalEl: document.getElementById("results-final"),
  burnAWillpower: document.getElementById("reroll-vtm"),
  resetBtn: document.getElementById("reset-vtm"),
  vtmArr: Array.from(document.getElementsByClassName("vtm")),
  dicePoolPicker: document.getElementById("dice-pool"),
  hungerPicker: document.getElementById("hunger")
}

// classes
class Dice {
  constructor() {
    this.hungerDice = {
      qty: 1,
    }
    this.vtmDice = {
      qty: 0,
    }
    this.diceResults = [];
  }

  setHunger(qty) {
    this.hungerDice.qty = Number(qty);
  }
  setVTMDice(qty) {
    this.vtmDice.qty = Number(qty)
  }

  // dice rolls
  rollHungerDie() {
    let r = Math.floor(Math.random() * vtmHungerDice.length);
    return vtmHungerDice[r]
  };
  rollNormalDie() {
    let r = Math.floor(Math.random() * vtmDice.length);
    return vtmDice[r]
  };

  // rolls the dice and sets the diceResults array in this object
  roll(dicePool) {
    const totalDice = Number(dicePool)
    if (totalDice <= 0) {
      return []
    }
    let results = [];
    for (let i = 0; i < totalDice; i++) {
      if (i < this.hungerDice.qty) {
        results[i] = this.rollHungerDie()
        continue;
      }
      results[i] = this.rollNormalDie()
      if (results[i] == failure) {
        state.allowReroll(true)
      }
    }
    this.diceResults = results;
  };

  // re-rolls up to 3 normal dice in the existing diceResults map and replaces the diceResults in this object with the new array
  reroll() {
    let times = 0
    let result = this.diceResults.map((die, i) => {
      if (i < this.hungerDice.qty || die != failure || times >= maxRerollableDice) {
        return die;
      }
      times++
      let newDie = this.rollNormalDie()
      return newDie
    });
    this.diceResults = result
  };

  // dice results are an empty array again
  reset() {
    this.diceResults = []
  }
}

class State {
  constructor() {
    this.successes = 0;
    this.fails = 0;
    this.crits = 0;
    this.criticalHunger = 0;
    this.beastialFailures = 0;
    this.canReroll = false;
  };

  set(diceResults) {
    let successes = 0;
    let fails = 0;
    let beastialFailures = 0;
    let crits = 0;
    let criticalHunger = 0;
    diceResults.forEach((d) => {
      switch (d) {
        case success:
          successes += 1;
          break;
        case failure:
          fails += 1;
          break;
        case beastialFailure:
          beastialFailures += 1;
          break;
        case critical:
          crits += 1;
          break;
        case criticalHungerDie:
          criticalHunger += 1;
          break;
      }
    });
    this.successes = successes;
    this.fails = fails;
    this.beastialFailures = beastialFailures;
    this.crits = crits;
    this.criticalHunger = criticalHunger;
    if (this.fails === 0) {
      this.canReroll = false;
    }
  }

  allowReroll(bool) {
    this.canReroll = bool;
  };

  reset() {
    this.successes = 0;
    this.fails = 0;
    this.crits = 0;
    this.criticalHunger = 0;
    this.beastialFailures = 0;
    this.canReroll = false;
    this.hunger = 1;
  }
}

// functions
function render() {
  renderResults();
  if (state.canReroll) {
    elements.burnAWillpower.style = "display: inline-block;";
    return;
  } else {
    elements.burnAWillpower.style = "display: none;";
  }
}

function init() {
  diceObj = new Dice()
  state = new State()
  // event listeners
  elements.submitBtn.addEventListener("click", handleSubmit);
  elements.burnAWillpower.addEventListener("click", handleReroll);
  elements.resetBtn.addEventListener("click", reset);
  render();
}

function renderResults() {
  let innerHTML = [];
  let resultsFinalInnerHTML = "";
  let finalResult = getFinalResult();

  if (diceObj.diceResults.length > 0) {
    innerHTML = vtmDiceResultsInnerHTML();
    let text = getTextForFinalResult(finalResult)
    let image = finalResultImgs[finalResult]
    resultsFinalInnerHTML = `<div class="results-msg valign-wrapper"><div class="row"><div class="valign-wrapper center-text">${text}</div><img class="vtm" src="imgs/${image}" alt="${text}" ></div></div>`;
    elements.resultsFinalEl.style = "display: block;";
  }

  elements.resultsFinalEl.innerHTML = resultsFinalInnerHTML;
  results.innerHTML = innerHTML.join(" ");
}

// VTM FUNCTIONS
function vtmDiceResultsInnerHTML() {
  let innerHTML = [];
  innerHTML = diceObj.diceResults.map((d, i) => {
    let image = diceResultImgs[d];
    let text = d;
    switch (d) {
      case criticalHungerDie:
        text = critical;
        break;
      case beastialFailure:
        text = "bestial<br />failure";
        break;
    }

    var dieClass = "dice"
    if (i < diceObj.hungerDice.qty) {
      dieClass = "red accent-3 hunger-dice"
    }
    return `<td class="vtm ${dieClass} card col center-align" id="die-${i}-results">
    <p class="vtm center-align">${text}</p><img src="imgs/${image}" alt="${d}" class="card-image center-align">
    </td>`
  });

  let rows = [];
  for (let i = 0; i < innerHTML.length; i++) {
    if (!(i % maxDicePerLine) && i != 0) {
      rows.push(i);
    }
  }
  rows.forEach((v, i) => {
    innerHTML.splice(v + i, 0, `<tr class="vtm">`);
  });
  results.style = "display: table-row-group;";
  return innerHTML;
}

function getFinalResult() {
  if ((state.crits == 1 && !state.criticalHunger) || (!state.crits && state.criticalHunger == 1)) {
    state.successes += 1; // one pt added to successes when there is only one crit
  }
  if (!state.successes && !state.beastialFailures && !state.crits && !state.criticalHunger) {
    return failure;
  }
  if (!state.successes && state.beastialFailures && !state.crits && !state.criticalHunger) {
    return beastialFailure;
  }
  if ((state.crits && state.criticalHunger) || state.criticalHunger >= critMin) {
    return messyCrit;
  }
  if (state.crits >= critMin) {
    return critical;
  }
  if (state.successes == 0) {
    return failure;
  }
  return success;
}

function getTextForFinalResult(finalResult) {
  switch (finalResult) {
    case failure:
      return "Fail";
    case beastialFailure:
      return "Bestial Fail!";
    case messyCrit:
      return `Messy Crit! +${state.successes}`;
    case critical:
      return `Crit Success! +${state.successes}`;
    case success:
      return `Success: ${state.successes}`;
    default:
      return `Success: ${state.successes}`;
  }
}

function handleReroll() {
  diceObj.reroll()
  state.set(diceObj.diceResults)
  state.allowReroll(false);
  render();
}

function reset() {
  diceObj.reset()
  state.reset()
  render();
}

function handleSubmit() {
  let dicePool = Number(elements.dicePoolPicker.value);
  if (dicePool < 0) {
    dicePool = 0
  }

  let hunger = Number(elements.hungerPicker.value);
  if (hunger < 0) {
    hunger = 0
  }

  let vtmDice = dicePool - hunger;
  if (vtmDice < 0) {
    vtmDice = 0
  }

  // set state and update Dice
  diceObj.setHunger(hunger)
  diceObj.setVTMDice(vtmDice)
  diceObj.roll(dicePool)
  state.set(diceObj.diceResults);
  render();
}

init();
