// ─── the broken version (var) ────────────────────────────────────────────────
//
// `var` is function-scoped, not block-scoped. The `for` loop body is not a
// new scope. There is exactly ONE `i` binding, hoisted to the enclosing scope.
// Each iteration mutates that same binding in place.
//
// When the loop finishes, `i === 3`. Every arrow function in `brokenFns` holds
// a reference to that one binding — so every call returns 3.
//
// This surprises people because they imagine the closure "capturing a snapshot"
// of i's value at push time. It does not. It captures a live reference to the
// binding itself. The binding's value at call time is what gets returned.

var brokenFns = [];
for (var i = 0; i < 3; i++) {
  brokenFns.push(() => i);
}
// i is 3 here. All three functions will return 3.


// ─── the fixed version (let) ─────────────────────────────────────────────────
//
// `let` is block-scoped. The ES2015 spec mandates that a fresh `i` binding is
// created at the top of each iteration's block scope. Each pushed function
// closes over a distinct scope instance — a different heap-promoted record
// with a different value frozen at that iteration's value of i.

const fixedFns = [];
for (let i = 0; i < 3; i++) {
  fixedFns.push(() => i);
}
// Three separate scopes: { i: 0 }, { i: 1 }, { i: 2 }


// ─── the IIFE workaround (pre-ES6) ───────────────────────────────────────────
//
// Before `let` existed, developers forced a new scope per iteration by
// immediately invoking a function expression and passing `i` as an argument.
// The argument `captured` is a fresh local binding in each IIFE call —
// exactly what `let` now does automatically.
//
// This is shown in the HTML for discussion. Constructed here for completeness:

var iifeFns = [];
for (var j = 0; j < 3; j++) {
  iifeFns.push(
    (function(captured) {
      return function() { return captured; };
    })(j)
  );
}
// iifeFns[0]() → 0, iifeFns[1]() → 1, iifeFns[2]() → 2


// ─── DOM wiring ──────────────────────────────────────────────────────────────

(function () {
  const resultBroken = document.getElementById('result-broken');
  const resultFixed  = document.getElementById('result-fixed');
  const brokenCard   = document.querySelector('.broken-card');
  const fixedCard    = document.querySelector('.fixed-card');

  function flash(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  window.callBroken = function (idx) {
    const val = brokenFns[idx]();
    resultBroken.textContent = val;
    flash(brokenCard, 'flash-broken');
  };

  window.callFixed = function (idx) {
    const val = fixedFns[idx]();
    resultFixed.textContent = val;
    flash(fixedCard, 'flash-fixed');
  };

})();
