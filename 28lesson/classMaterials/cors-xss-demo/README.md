# VaultLine — XSS & CORS Seminar Demo
### Instructor Guide · 15-minute seminar

---

## Setup (do this before class)

```bash
cd cors-xss-demo
npm install
```

Then open **two terminals**:

```bash
# Terminal 1 — the victim app
node victim-server.js

# Terminal 2 — the API (start in 'none' mode)
node api-server.js
```

Open your browser to `http://localhost:3002` and verify the dashboard loads.

---

## The Narrative Arc

```
Same-Origin Policy (the wall)
    └── XSS: defeating the wall from INSIDE
            └── CORS: the controlled gate THROUGH the wall
                    └── Misconfigured CORS + XSS = both fail together
```

The goal is not two separate topics. It's one threat model with two defense layers.

---

## Seminar Flow

### [2 min] — Orient: What the browser is protecting

Open DevTools → Console. Type:

```javascript
window.location.origin
```

**Say:** "The browser enforces a Same-Origin Policy. Scripts on `localhost:3002` cannot
read responses from `localhost:3003` — different port, different origin. This boundary
is the wall everything else is built around."

Draw on whiteboard (or describe):

```
[localhost:3002]          [localhost:3003]
  Victim App    ----?--→   API Server
                ↑
            SOP blocks this unless the server opts in (CORS)
```

---

### [5 min] — XSS: defeating the wall from inside

**Show the vulnerable app:** `http://localhost:3002`

Point out the search field. Say: "This search field submits to `/search?q=<input>`.
The server takes your query and reflects it directly into the HTML response.
No encoding. No sanitization."

**Demo the trivial payload first** — paste into the search box and submit:

```
<img src=x onerror="alert('session: ' + document.cookie)">
```

The browser renders the `<img>` tag. `src=x` fails. `onerror` fires. Alert appears.

**Say:** "The server trusted user input. The browser trusted the server. Game over.
The attacker's code is now running inside `localhost:3002`'s origin. It has full DOM
access. It can read cookies, scrape rendered account data, log keystrokes, redirect
the user — anything a legitimate script on this page could do."

**Now run the full payload.** Switch to console, paste `inject.js` contents.

Walk through the four steps as they print:
- Step 1: stolen cookie appears
- Step 2: balance amounts scraped from DOM
- Step 3: cross-origin API fetch BLOCKED (CORS_MODE=none)
- Step 4: the CORS ≠ XSS protection point

**Show the fix.** Open `http://localhost:3002/fixed`, try the same payload.
The `<img>` tag renders as text. The `onerror` never fires.

Point to the diff in `victim-server.js` vs the `/search-fixed` route:

```javascript
// BEFORE (vulnerable):
res.send(`...${query}...`);          // raw reflection

// AFTER (safe):
const sanitized = query
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')            // < becomes &lt; — browser prints it, doesn't parse it
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#x27;');
res.send(`...${sanitized}...`);
```

**Say:** "The fix is two lines. The breach is catastrophic. This asymmetry is why XSS
has been in the OWASP Top 10 for two decades."

> **Production note:** Don't write your own sanitizer. Use DOMPurify client-side or
> a library like `he` or `xss` server-side. Also set a Content Security Policy (CSP)
> header — it's a second line of defense that restricts which scripts the browser will
> execute even if injection succeeds.

---

### [1 min] — Hard stop: what CORS is NOT

**Say this explicitly and write it on the board:**

```
CORS does not prevent XSS.
CORS does not protect the DOM.
CORS controls cross-origin NETWORK access only.
```

"Step 4 in the console output showed that even with CORS locked down, injected code
can still steal cookies and scrape your DOM. CORS operates at the network boundary.
XSS operates inside the origin. These are orthogonal threat surfaces."

---

### [5 min] — CORS: the controlled gate

**Phase 1 — No headers (CORS_MODE=none, already running)**

On the dashboard, click **"Load from API ⟳"**.

Watch the red error appear: `CORS fetch blocked`.

Check Terminal 2 (api-server.js). Show the log:
```
→ GET /api/transactions from origin: http://localhost:3002
  CORS_MODE: none
  → No CORS headers sent — browser will block cross-origin reads
```

Open DevTools → Network. Find the request. Show: the server DID respond with 200,
but the browser suppressed the response because no `Access-Control-Allow-Origin` header
was present.

**Say:** "The server answered. The browser threw it away. The browser is enforcing SOP
on the client side. This is why CORS headers have to come from the server — the server
is opting in to allow specific origins."

**Phase 2 — Open CORS (the dangerous misconfiguration)**

Stop Terminal 2, restart with:

```bash
CORS_MODE=open node api-server.js
```

Click "Load from API ⟳" again. It works. Transactions load.

Show Terminal 2:
```
→ Sent: Access-Control-Allow-Origin: *  ⚠️ OPEN
```

**Now run inject.js again.** This time Step 3 succeeds — account data exfiltrated.

**Say:** "This is the intersection. `Access-Control-Allow-Origin: *` is common and
often appropriate for public APIs. But if the app serving this API has an XSS
vulnerability, now every injected script — from any tab, any origin — can read
your authenticated API responses. The two vulnerabilities multiply."

**Phase 3 — Strict CORS (correct configuration)**

Stop Terminal 2, restart with:

```bash
CORS_MODE=strict node api-server.js
```

Click "Load from API ⟳". Still works — `localhost:3002` is in the allowlist.

Show Terminal 2:
```
→ Sent: Access-Control-Allow-Origin: http://localhost:3002  ✅ STRICT
```

Now open a NEW tab and try fetching from a different origin:

```javascript
// In the console of any other page (e.g., about:blank)
fetch('http://localhost:3003/api/accounts').then(r => r.json()).then(console.log)
```

Blocked. The browser rejected it — the origin doesn't match.

**Say:** "Strict CORS means: the server tells the browser which origins are allowed
to read responses. Anything else gets blocked. But — and this is the final point —
if XSS exists on `localhost:3002`, injected code runs IN that origin. It passes the
CORS check because the victim's own origin is the allowlist. This is why you can't
CORS your way out of an XSS problem."

---

### [2 min] — Synthesis: Defense in depth

| Layer | Tool | Protects against |
|-------|------|-----------------|
| Input sanitization | `htmlEntities()`, DOMPurify | XSS injection |
| Content Security Policy | `Content-Security-Policy` header | Script execution even if injected |
| HttpOnly cookies | `Set-Cookie: ...; HttpOnly` | Cookie theft via `document.cookie` |
| Strict CORS | `Access-Control-Allow-Origin: https://yourdomain.com` | Cross-origin API reads |
| SameSite cookies | `Set-Cookie: ...; SameSite=Strict` | CSRF (related threat) |

**Say:** "These are not alternatives. They're layers. XSS bypasses CORS. CORS doesn't
sanitize input. HttpOnly stops cookie theft but not DOM scraping. You need all of them
because each one closes a different hole."

---

## File Reference

| File | Purpose |
|------|---------|
| `victim-server.js` | Port 3002 — serves the vulnerable and fixed app |
| `api-server.js` | Port 3003 — the API with CORS_MODE toggle |
| `public/index.html` | Vulnerable dashboard UI |
| `public/fixed.html` | Sanitized dashboard UI |
| `public/style.css` | Shared stylesheet |
| `inject.js` | Console-paste XSS payload with 4 demo steps |

## Key URLs

| URL | What it shows |
|-----|--------------|
| `http://localhost:3002` | Vulnerable app |
| `http://localhost:3002/fixed` | Fixed app |
| `http://localhost:3002/search?q=<img src=x onerror=alert(1)>` | URL-based XSS |
| `http://localhost:3003/api/accounts` | Raw API (direct — no CORS applies) |
| `http://localhost:3003/api/status` | Current CORS_MODE |

## Questions to prompt discussion

1. *"If the session cookie had HttpOnly set, what would Step 1 of inject.js return?"*
   → Empty string. Cookie theft fails. But Steps 2-4 still work.

2. *"What if the API used Bearer tokens in Authorization headers instead of cookies?"*
   → The token wouldn't be in `document.cookie`. But XSS could intercept it from
   localStorage or from the DOM (if the app stores it in memory, the injected script
   shares the same memory space).

3. *"Why can't the browser just block XSS itself?"*
   → It tries — CSP is exactly this. But without a CSP header, the browser has no way
   to distinguish `<script>` tags the server intended from ones injected by attackers.
   The server has to declare its intent.

4. *"Is `Access-Control-Allow-Origin: *` ever safe?"*
   → Yes, for genuinely public read-only APIs (public weather data, open datasets).
   Never for authenticated endpoints.
