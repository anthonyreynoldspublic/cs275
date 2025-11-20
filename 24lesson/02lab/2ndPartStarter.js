function makeCounter() {
  let count = 0;
  return () => {
    count++;
    return count;
  };
}

const clickCounter = makeCounter();
