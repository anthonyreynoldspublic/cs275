/**
 * Multiply every numeric element in an array by n.
 * Non-numbers become NaN if multiplied directly.
 */
function multiplyArray(arr, n) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] * n;
  }
  return result;
}

/* ----------------------------
   Test cases
   ---------------------------- */

// 1. Empty array
let out = multiplyArray([], 5);
console.assert(out.length === 0, "Test 1 failed: expected empty array");

// 2. Normal 4-element array
out = multiplyArray([1, 2, 3, 4], 2);
console.assert(
  JSON.stringify(out) === JSON.stringify([2, 4, 6, 8]),
  "Test 2 failed: expected [2,4,6,8]"
);

// 3. Strings in the array → NaN results
out = multiplyArray(["a", "b", "3"], 2);
console.assert(
  Number.isNaN(out[0]) && Number.isNaN(out[1]) && out[2] === 6,
  "Test 3 failed: expected [NaN, NaN, 6]"
);

// 4. Fun condition — mixed types including zero multiplier
out = multiplyArray([true, false, 5, null], 0);
console.assert(
  JSON.stringify(out) === JSON.stringify([0, 0, 0, 0]),
  "Test 4 failed: multiplying by 0 should yield all 0s"
);

console.log("All assertions passed (if no messages appeared).");
