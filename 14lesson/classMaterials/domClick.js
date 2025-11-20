    function addItem() {
      const input = document.getElementById('itemInput');
      const itemText = input.value.trim();
      
      if (itemText === '') {
        alert('Please enter some text');
        return;
      }
      
      const li = document.createElement('li');
      li.textContent = itemText;
      document.querySelector('#list').appendChild(li);
      
      document.querySelectorAll("li").forEach((item, index) => {
        console.log(`Another way: Item at index ${index}: ${item.textContent}`);
        item.classList.add('highlighted');
      });
      
      // Clear the input after adding
      input.value = '';
    }
    
    // Allow pressing Enter to add item
    document.getElementById('itemInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addItem();
      }
    });