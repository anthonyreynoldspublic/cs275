// ─── the closure ────────────────────────────────────────────────────────────
//
// makeWallet() returns a plain object whose three methods all close over the
// same `balance` binding in the same scope instance. This is the key contrast
// with scenario 1: there we got ONE function per closure; here we get THREE
// functions sharing ONE closure. Any write by one is immediately visible to
// the others because they literally reference the same heap-promoted binding.
//
// There is no way to access `balance` directly from outside:
//   wallet.balance          → undefined   (not a property)
//   wallet['balance']       → undefined
//   Object.keys(wallet)     → ['deposit', 'withdraw', 'check']
//
// The binding exists only in the closed-over lexical scope.

function makeWallet(initial) {
  let balance = initial;

  return {
    deposit:  (amount) => { balance += amount; return balance; },
    withdraw: (amount) => { balance -= amount; return balance; },
    check:    ()       => balance
  };
}

// ─── page state ─────────────────────────────────────────────────────────────

(function () {
  const INITIAL = 100;
  let wallet = makeWallet(INITIAL);

  // DOM references
  const balanceNum = document.getElementById('balance-num');
  const balanceEl  = document.getElementById('balance');
  const scopeVal   = document.getElementById('scope-val');
  const walletCard = document.querySelector('.wallet-card');
  const log        = document.getElementById('log');
  let   logEmpty   = true;

  // ── helpers ──────────────────────────────────────────────────────────────

  function updateDisplay(newBalance) {
    balanceNum.textContent = newBalance;
    scopeVal.textContent   = newBalance;

    if (newBalance < 0) {
      balanceEl.classList.add('negative');
      scopeVal.classList.add('negative');
    } else {
      balanceEl.classList.remove('negative');
      scopeVal.classList.remove('negative');
    }
  }

  function flash(cls) {
    walletCard.classList.remove('flash-green', 'flash-red', 'flash-blue');
    void walletCard.offsetWidth;
    walletCard.classList.add(cls);
  }

  function appendLog(text, cls) {
    if (logEmpty) {
      log.innerHTML = '';
      logEmpty = false;
    }
    const line = document.createElement('div');
    line.textContent = text;
    line.className = cls;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  function readAmt(id) {
    const v = parseFloat(document.getElementById(id).value);
    return isNaN(v) ? 0 : Math.abs(v);
  }

  // ── public handlers (called by onclick in HTML) ───────────────────────────

  window.doDeposit = function () {
    const amt    = readAmt('deposit-amt');
    const result = wallet.deposit(amt);
    updateDisplay(result);
    flash('flash-green');
    appendLog(`wallet.deposit(${amt})  →  ${result}`, 'log-deposit');
  };

  window.doWithdraw = function () {
    const amt    = readAmt('withdraw-amt');
    const result = wallet.withdraw(amt);
    updateDisplay(result);
    flash('flash-red');
    appendLog(`wallet.withdraw(${amt})  →  ${result}`, 'log-withdraw');
  };

  window.doCheck = function () {
    const result = wallet.check();
    flash('flash-blue');
    appendLog(`wallet.check()  →  ${result}`, 'log-check');
  };

  window.doReset = function () {
    // Same lesson as scenario 1: can't mutate the closed-over binding from
    // outside. The only reset path is a fresh makeWallet() invocation.
    wallet = makeWallet(INITIAL);
    updateDisplay(INITIAL);
    appendLog('— wallet reset (new scope instance) —', 'log-reset');
  };

})();
