const sections = document.querySelectorAll("section");
console.log("Number of sections:", sections.length);

const firstSection = sections[0];
firstSection.textContent = "Updated by JavaScript!";

console.log(firstSection.textContent);