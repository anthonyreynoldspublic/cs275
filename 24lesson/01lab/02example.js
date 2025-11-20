const funcs = [];

for (var i = 1; i <= 3; i++) {
  funcs.push(function () {
    return i;
  });
}

console.log(funcs[0]()); // 4
console.log(funcs[1]()); // 4
console.log(funcs[2]()); // 4
