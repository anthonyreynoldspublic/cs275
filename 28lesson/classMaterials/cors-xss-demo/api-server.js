/**
 * API SERVER — port 3003
 * Simulates a back-end financial API ("VaultLine Core API").
 * This is the cross-origin resource the victim app legitimately fetches from.
 *
 * CORS MODES (set CORS_MODE env var before starting):
 *
 *   CORS_MODE=none        No CORS headers — browser blocks all cross-origin fetches (default)
 *   CORS_MODE=open        Access-Control-Allow-Origin: *  (dangerous misconfiguration)
 *   CORS_MODE=strict      Access-Control-Allow-Origin: http://localhost:3002  (correct)
 *
 * Example:
 *   CORS_MODE=strict node api-server.js
 *
 * DEMO FLOW:
 *   Phase 1 (none):   fetch from inject.js or dashboard fails — browser blocks it
 *   Phase 2 (open):   fetch succeeds — but now injected XSS script can also read the API
 *   Phase 3 (strict): fetch from localhost:3002 succeeds, but attacker origin is blocked
 */

const express = require('express');
const app = express();
const PORT = 3003;

const CORS_MODE = process.env.CORS_MODE || 'none';

// Fake account data — the "sensitive" payload
const ACCOUNTS = [
  { id: 'acct-001', name: 'Primary Checking', balance: 12480.55, currency: 'USD' },
  { id: 'acct-002', name: 'High-Yield Savings', balance: 47200.00, currency: 'USD' },
  { id: 'acct-003', name: 'Investment Portfolio', balance: 198340.12, currency: 'USD' },
];

const TRANSACTIONS = [
  { id: 'tx-001', date: '2026-04-18', description: 'AMZN Marketplace', amount: -84.99 },
  { id: 'tx-002', date: '2026-04-17', description: 'Payroll Direct Deposit', amount: 3200.00 },
  { id: 'tx-003', date: '2026-04-15', description: 'Whole Foods Market', amount: -67.43 },
  { id: 'tx-004', date: '2026-04-14', description: 'Netflix Subscription', amount: -15.99 },
  { id: 'tx-005', date: '2026-04-12', description: 'Gas Station #447', amount: -58.20 },
];

// CORS middleware — behavior changes with CORS_MODE
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log(`\n→ ${req.method} ${req.path} from origin: ${origin || '(same-origin or no origin)'}`);
  console.log(`  CORS_MODE: ${CORS_MODE}`);

  switch (CORS_MODE) {
    case 'open':
      // ⚠️  DANGEROUS: any origin can read this API's responses
      // When combined with XSS on localhost:3002, attacker-injected script
      // can exfiltrate account data to any server.
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('  → Sent: Access-Control-Allow-Origin: *  ⚠️  OPEN');
      break;

    case 'strict':
      // ✅  CORRECT: only the legitimate app origin is allowed
      if (origin === 'http://localhost:3002') {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
        res.setHeader('Vary', 'Origin');
        console.log('  → Sent: Access-Control-Allow-Origin: http://localhost:3002  ✅  STRICT');
      } else {
        console.log(`  → Origin ${origin} not in allowlist — no CORS header sent (browser will block)`);
      }
      break;

    case 'none':
    default:
      // No CORS headers — browser blocks all cross-origin reads
      console.log('  → No CORS headers sent — browser will block cross-origin reads');
      break;
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }

  next();
});

// GET /api/accounts — the sensitive endpoint
app.get('/api/accounts', (req, res) => {
  console.log('  → Serving account data');
  res.json({
    user: 'demo-user-1234',
    accounts: ACCOUNTS,
    total_balance: ACCOUNTS.reduce((sum, a) => sum + a.balance, 0),
  });
});

// GET /api/transactions — also sensitive
app.get('/api/transactions', (req, res) => {
  console.log('  → Serving transaction data');
  res.json({
    user: 'demo-user-1234',
    transactions: TRANSACTIONS,
  });
});

// GET /api/status — useful for checking the server is up
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    cors_mode: CORS_MODE,
    port: PORT,
    message: `CORS is currently set to: ${CORS_MODE}`,
  });
});

app.listen(PORT, () => {
  console.log(`\n🔌  VaultLine Core API running at http://localhost:${PORT}`);
  console.log(`    CORS mode: ${CORS_MODE.toUpperCase()}`);
  console.log(`    Accounts:     http://localhost:${PORT}/api/accounts`);
  console.log(`    Transactions: http://localhost:${PORT}/api/transactions`);
  console.log(`    Status:       http://localhost:${PORT}/api/status`);
  console.log(`\n    To change CORS mode: CORS_MODE=strict node api-server.js\n`);
});
