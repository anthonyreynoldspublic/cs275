function buildGreeter() {
  const greeting = "Hello";

  return function () {
    return greeting + ", " + name;  // name is not defined!
  };
}

const g = buildGreeter();
console.log(g()); // ReferenceError: name is not defined
