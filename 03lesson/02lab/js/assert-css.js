// Tiny test harness that checks computed styles and prints ✅/❌
// Intent: "test-first thinking = comprehension". Students fix CSS until checks pass.

function parseRgb(colorString) {
  // Regex to extract numbers from "rgb(r, g, b)"
  const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    // Convert strings to integers and return them as an array
    return match.slice(1).map(Number);
  }
  return null; // Return null if the format isn't recognized
}

function assertStyle(selector, property, expected, mode = 'equals') {
  const el = document.querySelector(selector);
  if (!el) return { pass: false, msg: `Missing element: ${selector}` };

  // 1. Get the actual value from the element
  const value = getComputedStyle(el).getPropertyValue(property).trim();
  
  let pass = false;
  let comparisonMessage = '';

  if (mode === 'subtler') {
    // 2. Subtlety Check Mode
    const actualRgb = parseRgb(value);
    const expectedRgb = parseRgb(expected);
    
    if (actualRgb && expectedRgb) {
      // Check if the actual color is less intense in AT LEAST ONE primary channel
      // where the expected color was intense (value > 100)
      const isSubtler = actualRgb.some((actualChannel, i) => {
        const expectedChannel = expectedRgb[i];
        // If the expected channel was strong (e.g., > 100)
        // AND the actual channel is now weaker than the expected channel.
        return expectedChannel > 100 && actualChannel < expectedChannel;
      });

      pass = isSubtler;
      comparisonMessage = `(expected subtler than ${expected})`;

    } else {
      // Handle cases where colors can't be parsed (e.g., using hex or keyword)
      pass = false;
      comparisonMessage = `(Error: subtler check requires RGB format)`;
    }

  } else {
    // 3. Default 'equals' Check Mode
    pass = value === expected;
    comparisonMessage = `≠ ${expected}`;
  }

  // 4. Return the result
  return {
    pass,
    msg: `${selector} { ${property}: ${value} } ${pass ? '✅' : `${comparisonMessage} ❌`}`
  };
}

function runChecks() {
  const results = [];
  results.push(assertStyle('body', 'background-color', 'rgb(207, 207, 207)', 'subtler')); 
  results.push(assertStyle('title', 'text-align', 'center'));
  console.log('results', results);


  const out = results.map(r => (r.pass ? '✅ ' : '❌ ') + r.msg).join('\n');
  const pre = document.getElementById('check-output');
  pre.textContent = out;
}

document.getElementById('run-checks')?.addEventListener('click', runChecks);
