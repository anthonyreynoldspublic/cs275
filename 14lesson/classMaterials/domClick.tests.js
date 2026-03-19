function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

(function runDomClickTests() {
  const input = document.querySelector("#itemInput");
  const list = document.querySelector("#list");
  const button = document.querySelector("button");

  assert(input, "#itemInput should exist");
  assert(list, "#list should exist");
  assert(button, "button should exist");

  const originalItems = Array.from(document.querySelectorAll("li"));
  const originalAlert = globalThis.alert;
  const originalCount = originalItems.length;

  assert(originalCount >= 1, "There should be at least one starting li");

  let alertCalls = 0;
  let lastAlertMessage = "";
  globalThis.alert = function(message) {
    alertCalls += 1;
    lastAlertMessage = message;
  };

  try {
    // Empty input should alert and not add new items.
    input.value = "   ";
    addItem();
    assert(alertCalls === 1, "addItem() should call alert once for empty input");
    assert(lastAlertMessage === "Please enter some text", "Alert message should match empty input warning");
    assert(document.querySelectorAll("li").length === originalCount, "Empty input should not append an li");

    // Valid input should append one item, highlight all items, and clear input.
    input.value = "Milk";
    addItem();

    const afterAdd = Array.from(document.querySelectorAll("li"));
    const lastItem = afterAdd.at(-1);

    assert(afterAdd.length === originalCount + 1, "Valid input should append exactly one li");
    assert(lastItem.textContent === "Milk", "Newly appended li should contain entered text");
    assert(input.value === "", "Input should be cleared after successful addItem()");
    assert(
      afterAdd.every(function(item) {
        return item.classList.contains("highlighted");
      }),
      "All li elements should have the highlighted class after addItem()"
    );

    // Enter key should trigger addItem through the keypress listener.
    input.value = "Bread";
    input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", bubbles: true }));

    const afterEnter = Array.from(document.querySelectorAll("li"));
    const enterAddedItem = afterEnter.at(-1);
    assert(afterEnter.length === originalCount + 2, "Pressing Enter should append one more li");
    assert(enterAddedItem.textContent === "Bread", "Enter-triggered li should use current input text");
    assert(input.value === "", "Input should be cleared after Enter-triggered add");
  } finally {
    // Restore environment and DOM to avoid leaving the page in a modified state.
    globalThis.alert = originalAlert;
    const currentItems = Array.from(document.querySelectorAll("li"));
    currentItems.slice(originalCount).forEach(function(item) {
      item.remove();
    });
    originalItems.forEach(function(item) {
      item.classList.remove("highlighted");
    });
    input.value = "";
  }

  console.log("domClick tests passed");
})();