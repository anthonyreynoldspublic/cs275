function makeMultiplier(factor) {
  let base = 10;

  return function (n) {
    return n * base;
  };

  base = factor; // this line never runs
}

const mul = makeMultiplier(3);
console.log(mul(5)); // Always 50, never 15
