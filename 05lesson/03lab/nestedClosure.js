function makeCounter() {
  let count = 0; // <- local variable

  return function() { // <- inner function
    count++;
    console.log(count);
  };
}

const counterA = makeCounter();
counterA(); // 1
counterA(); // 2
counterA(); // 3
