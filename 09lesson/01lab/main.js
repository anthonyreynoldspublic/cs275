let x = 4;

export function double(n) {
  // place a breakpoint here or use debugger;
  return n * 2;
}

console.assert(double(x) === 8, "double(x) should be 8");
console.assert(double(0) === 0, "double(0) should be 0");

console.log("done");
