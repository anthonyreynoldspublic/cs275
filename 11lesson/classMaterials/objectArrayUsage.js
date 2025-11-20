// ======================
// OBJECT ACCESS EXAMPLES
// ======================

// Typing into code
const car = {
  make: "Porsche",
  model: "911",
  year: 2025,
  color: "red"
};

// Finding elements by key
console.log("Direct access:");
console.log(car.make);         // dot notation
console.log(car["model"]);     // bracket notation

// Looping through all keys
console.log("\nLoop through object keys:");
for (let key in car) {
  console.log(`${key}: ${car[key]}`);
}

// Safe key lookup (returns undefined if missing)
console.log("\nMissing key example:");
console.log(car.owner); // undefined


// ======================
// ARRAY ACCESS EXAMPLES
// ======================

// Typing into code
const colors = ["red", "green", "blue", "yellow"];

// Finding elements by index
console.log("\nDirect access:");
console.log(colors[0]); // red
console.log(colors[2]); // blue

// Looping through all indexes
console.log("\nLoop through array values:");
for (let i = 0; i < colors.length; i++) {
  console.log(`Index ${i}: ${colors[i]}`);
}

// Using for...of to iterate values
console.log("\nLoop using for...of:");
for (let color of colors) {
  console.log(color);
}

// Safe index lookup (returns undefined if missing)
console.log("\nMissing index example:");
console.log(colors[10]); // undefined
