function makeCounter() {
  let count = 0;

  return function () {
    count++;
  };
}

const c = makeCounter();
console.log(c());  // undefined
console.log(c());  // undefined
