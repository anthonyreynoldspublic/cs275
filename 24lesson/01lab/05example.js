let message = "global";

function outer() {
  console.log(message); // no new variable here

  return function () {
    console.log(message);
  };
}

message = "changed!";

const fn = outer();
fn();  // ??? prints "changed!", not "global"
