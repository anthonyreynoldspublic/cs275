// ─── the closure ────────────────────────────────────────────────────────────
//
// makeCounter() is a scope template. Each invocation creates a new activation
// record with its own `count` binding. When the outer call returns, that record
// would normally be garbage-collected — but the returned function holds a
// reference to it, so the engine promotes those bindings to the heap.
//
// The returned function is the only thing in the program that can reach `count`.
// No property access, no global — it's private by construction.

function makeCounter() {
  let count = 0;

  return function increment() {
    count++;
    return count;
  };
}

// Two independent scope instances. Calling one never affects the other.
const a = makeCounter();  // scope A: its own count, starts at 0
const b = makeCounter();  // scope B: its own count, starts at 0


// ─── DOM wiring ─────────────────────────────────────────────────────────────

const valA  = document.getElementById('val-a');
const valB  = document.getElementById('val-b');
const cardA = document.getElementById('card-a');
const cardB = document.getElementById('card-b');
const log   = document.getElementById('log');

let logEmpty = true;

function appendLog(text, cssClass) {
  if (logEmpty) {
    log.innerHTML = '';
    logEmpty = false;
  }
  const line = document.createElement('div');
  line.textContent = text;
  line.className = cssClass;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function flashCard(card, cls) {
  card.classList.remove(cls);
  void card.offsetWidth;          // force reflow so animation re-triggers
  card.classList.add(cls);
}

function callA() {
  const result = a();
  valA.textContent = result;
  flashCard(cardA, 'flash-a');
  appendLog(`a()  →  ${result}`, 'log-entry-a');
}

function callB() {
  const result = b();
  valB.textContent = result;
  flashCard(cardB, 'flash-b');
  appendLog(`b()  →  ${result}`, 'log-entry-b');
}

// ─── reset helpers ──────────────────────────────────────────────────────────
//
// Note: we can't reach into the live closure and reset `count` directly —
// that's the whole point. The only way to "reset" is to throw away the old
// closure and stamp out a fresh scope instance from the factory.

let aInstance = a;   // keep references so reset can replace them
let bInstance = b;

// We need module-level rebindable references for the reset to work cleanly.
// Redeclare as let at the top of the page-level scope:

(function () {
  let counterA = makeCounter();
  let counterB = makeCounter();

  // Rebind the button handlers to use the rebindable references.
  window.callA = function () {
    const result = counterA();
    valA.textContent = result;
    flashCard(cardA, 'flash-a');
    appendLog(`a()  →  ${result}`, 'log-entry-a');
  };

  window.callB = function () {
    const result = counterB();
    valB.textContent = result;
    flashCard(cardB, 'flash-b');
    appendLog(`b()  →  ${result}`, 'log-entry-b');
  };

  window.resetA = function () {
    counterA = makeCounter();     // discard old scope, create fresh one
    valA.textContent = 0;
    appendLog('— a reset (new scope instance) —', 'log-reset');
  };

  window.resetB = function () {
    counterB = makeCounter();
    valB.textContent = 0;
    appendLog('— b reset (new scope instance) —', 'log-reset');
  };
})();
