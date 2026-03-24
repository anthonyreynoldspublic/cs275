function renderAssertResults(assertions) {
  const assertResults = document.getElementById("assertResults");
  if (!assertResults) {
    return;
  }

  const passCount = assertions.filter((assertion) => assertion.passed).length;
  const failCount = assertions.length - passCount;

  const assertionItems = assertions
    .map((assertion) => {
      const statusClass = assertion.passed ? "pass" : "fail";
      const statusText = assertion.passed ? "PASS" : "FAIL";
      return `<li class="${statusClass}">${statusText}: ${assertion.description}</li>`;
    })
    .join("");

  assertResults.innerHTML = `
    <h2>DOM Assert Results</h2>
    <p>${passCount} passed, ${failCount} failed</p>
    <ul>${assertionItems}</ul>
  `;
}

function runFirstPageAsserts() {
  const assertions = [
    {
      description: "Body has state-a class",
      passed: document.body.classList.contains("state-a"),
    },
    {
      description: "First view panel exists",
      passed: document.querySelector(".view-a") !== null,
    },
    {
      description: "Switch button exists",
      passed: document.getElementById("switchBtn") !== null,
    },
    {
      description: "Switch Back button is not present",
      passed: document.getElementById("switchBackBtn") === null,
    },
  ];

  renderAssertResults(assertions);
}

function runSecondPageAsserts() {
  const assertions = [
    {
      description: "Body has state-b class",
      passed: document.body.classList.contains("state-b"),
    },
    {
      description: "Second view panel exists",
      passed: document.querySelector(".view-b") !== null,
    },
    {
      description: "Switch Back button exists",
      passed: document.getElementById("switchBackBtn") !== null,
    },
    {
      description: "Switch button is not present",
      passed: document.getElementById("switchBtn") === null,
    },
  ];

  renderAssertResults(assertions);
}

function renderFirstPage() {
  document.body.classList.remove("state-b");
  document.body.classList.add("state-a");

  document.body.innerHTML = `
    <main>
      <section class="panel view-a">
        <h1>First View</h1>
        <p>This is the original page generated at startup.</p>
        <div class="button-row">
          <button id="switchBtn" type="button">Switch</button>
          <button id="assertFirstBtn" class="assert-btn" type="button">Run DOM Asserts</button>
        </div>
        <div id="assertResults" class="assert-results"></div>
      </section>
    </main>
  `;

  const switchBtn = document.getElementById("switchBtn");
  switchBtn.addEventListener("click", renderSecondPage);

  const assertFirstBtn = document.getElementById("assertFirstBtn");
  assertFirstBtn.addEventListener("click", runFirstPageAsserts);
}

function renderSecondPage() {
  document.body.classList.remove("state-a");
  document.body.classList.add("state-b");

  document.body.innerHTML = `
    <main>
      <section class="panel view-b">
        <h1>Second View</h1>
        <p>This is a completely different generated page.</p>
        <div class="button-row">
          <button id="switchBackBtn" type="button">Switch Back</button>
          <button id="assertSecondBtn" class="assert-btn" type="button">Run DOM Asserts</button>
        </div>
        <div id="assertResults" class="assert-results"></div>
      </section>
    </main>
  `;

  const switchBackBtn = document.getElementById("switchBackBtn");
  switchBackBtn.addEventListener("click", renderFirstPage);

  const assertSecondBtn = document.getElementById("assertSecondBtn");
  assertSecondBtn.addEventListener("click", runSecondPageAsserts);
}

document.addEventListener("DOMContentLoaded", renderFirstPage);
