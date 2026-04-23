/**
 * VICTIM SERVER — port 3002
 * Serves the vulnerable bank dashboard app.
 *
 * DEMO FLOW:
 *   Step 1: Start this server, open http://localhost:3002  (vulnerable version)
 *   Step 2: Inject payload via browser console (see inject.js)
 *   Step 3: Switch to http://localhost:3002/fixed  (sanitized version)
 *   Step 4: Show inject.js fails silently on fixed version
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Simulate a session cookie — in a real app this would be HttpOnly
// We leave it accessible to document.cookie intentionally for the demo
app.use((req, res, next) => {
  if (!req.headers.cookie?.includes('session')) {
    res.cookie('session', 'eyJ1c2VySWQ6IjEyMzQiLCByb2xlOiAidXNlciJ9', {
      // NOTE: NOT setting httpOnly — that's the vulnerability we're demonstrating
    });
  }
  next();
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Vulnerable search endpoint — reflects user input directly into HTML
// This is the XSS sink.
app.get('/search', (req, res) => {
  const query = req.query.q || '';

  // ⚠️  VULNERABLE: raw user input injected into HTML response
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Search Results — VaultLine</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body class="results-page">
      <div class="results-container">
        <div class="results-header">
          <a href="/" class="back-link">← Back to Dashboard</a>
          <h2>Search results for: ${query}</h2>
        </div>
        <div class="results-body">
          <p class="no-results">No transactions matched your search.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Fixed search endpoint — sanitizes input before reflection
app.get('/search-fixed', (req, res) => {
  const query = req.query.q || '';

  // ✅  SAFE: encode all HTML special characters before reflecting
  const sanitized = query
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Search Results — VaultLine</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body class="results-page">
      <div class="results-container">
        <div class="results-header">
          <a href="/fixed" class="back-link">← Back to Dashboard</a>
          <h2>Search results for: ${sanitized}</h2>
        </div>
        <div class="results-body">
          <p class="no-results">No transactions matched your search.</p>
        </div>
        <div class="security-badge">✅ Input sanitized — XSS payload rendered as text</div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🏦  VaultLine (VICTIM) running at http://localhost:${PORT}`);
  console.log(`    Vulnerable app:  http://localhost:${PORT}/`);
  console.log(`    Fixed app:       http://localhost:${PORT}/fixed`);
  console.log(`    Vulnerable search: http://localhost:${PORT}/search?q=<script>alert(1)</script>\n`);
});
