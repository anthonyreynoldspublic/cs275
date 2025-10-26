// Tiny test harness that checks computed styles and prints ✅/❌
// Intent: "test-first thinking = comprehension". Students fix CSS until checks pass.

function assertStyle(selector, property, expected) {
  const el = document.querySelector(selector);
  if (!el) return { pass: false, msg: `Missing element: ${selector}` };
  const value = getComputedStyle(el).getPropertyValue(property).trim();
  const pass = value === expected;
  return {
    pass,
    msg: `${selector} { ${property}: ${value} } ${pass ? '✅' : `≠ ${expected} ❌`}`
  };
}

function runChecks() {
  const results = [];
  // Checks match the Prompt Lab: red, centered, 10px blue border
  results.push(assertStyle('.title', 'color', 'rgb(255, 0, 0)'));        // red
  results.push(assertStyle('.title', 'text-align', 'center'));           // centered

  // Border is 3-part; check width, style, color individually:
  const title = document.querySelector('.title');
  if (title) {
    const cs = getComputedStyle(title);
    const width = cs.getPropertyValue('border-top-width').trim();
    const style = cs.getPropertyValue('border-top-style').trim();
    const color = cs.getPropertyValue('border-top-color').trim();
    results.push({ pass: width === '10px', msg: `.title border width: ${width} ${width === '10px' ? '✅' : '❌ (want 10px)'}` });
    results.push({ pass: style === 'solid', msg: `.title border style: ${style} ${style === 'solid' ? '✅' : '❌ (want solid)'}` });
    results.push({ pass: color === 'rgb(0, 0, 255)', msg: `.title border color: ${color} ${color === 'rgb(0, 0, 255)' ? '✅' : '❌ (want blue)'}` });
  } else {
    results.push({ pass: false, msg: 'Missing .title element ❌' });
  }

  const out = results.map(r => (r.pass ? '✅ ' : '❌ ') + r.msg).join('\n');
  const pre = document.getElementById('check-output');
  pre.textContent = out;
}

document.getElementById('run-checks')?.addEventListener('click', runChecks);
