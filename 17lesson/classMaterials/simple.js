console.assert(document.querySelector('#tasks'), "#tasks list should exist");

const items = document.querySelectorAll('#tasks li');
console.assert(items.length > 0, "There should be at least one task");

document.querySelector('#add').click();
const itemsAfter = document.querySelectorAll('#tasks li');
console.assert(itemsAfter.length === items.length + 1, "Clicking Add should create a new item");
