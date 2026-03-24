   function addDOMItem() {
    const input = document.getElementById('itemDOMInput');
    const itemText = input.value.trim();
    
    if (itemText === '') {
      alert('Please enter some text');
      return;
    }
    
    const li = document.createElement('li');
    li.textContent = itemText;
    li.className = "todo-item";
    document.querySelector('#list').appendChild(li);
    
    document.querySelectorAll("li").forEach((item, index) => {
      console.log(`Another way: Item at index ${index}: ${item.textContent}`);
      item.classList.add('highlighted');
    });
    
    // Clear the input after adding
    input.value = '';
  }
  

  function addDOMItemComplex() {
    const input = document.getElementById('itemDOMInput');
    const itemText = input.value.trim();
    
    if (itemText === '') {
      alert('Please enter some text');
      return;
    }
    
    const li = createTodoItem(itemText);
    document.querySelector('#list').appendChild(li);
    
    document.querySelectorAll("li").forEach((item, index) => {
      item.classList.add('highlighted');
    });
    
    // Clear the input after adding
    input.value = '';
  }

  function createTodoItem(text) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.textContent = text;

    const span = document.createElement("span");
    span.textContent = " and possum";

    li.appendChild(span);
    return li;
  }






  // Allow pressing Enter to add item
  const itemInput = document.getElementById('itemDOMInput');
  if (itemInput) {
    itemInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addDOMItem();
      }
    });
  }





function makeHTMLSection() {
    const html = "<section><h2>Section Title</h2><p>This is a section.</p></section>";
    document.writeln(html);
    return html;
}
  

makeHTMLSection();