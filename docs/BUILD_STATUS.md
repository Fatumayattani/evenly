# Build status

Validated on 10 July 2026 with Node.js 22 and npm 10.

## Passed

- `npm install`
- `npm test` — 5 allocation/readiness tests passed
- `npm run typecheck` — core and web packages passed
- `npm run build` — Next.js production build completed
- Production server returned HTTP 200

## Real Solana behavior

- Connects to an injected Solana browser wallet.
- Builds, signs, submits, and confirms a Devnet Memo transaction containing a SHA-256 fingerprint of the current coordination state.
- Includes Anchor program source for token-backed group treasuries, member contribution events, payout proposals, unique approvals, and threshold-controlled payouts.

## Prototype-only behavior

- Life balances, allocation rules, Group data, and contribution actions use a local demo ledger persisted in `localStorage`.
- The custom Anchor program has not been compiled, audited, deployed, or connected to the web UI in this environment.
- KES values are display/accounting values only; there is no fiat conversion, M-Pesa integration, custody, or live stablecoin settlement.
- Group invitations and identity are local demo records.

## Production gates

1. Compile and integration-test the Anchor program with LiteSVM and a local validator.
2. Complete an independent security audit before any live treasury use.
3. Replace the browser-wallet adapter with an audited passkey smart-wallet adapter.
4. Add encrypted backend persistence, reconciliation, notifications, and recovery.
5. Integrate licensed fiat/mobile-money and stablecoin partners.
6. Complete legal, consumer-protection, privacy, and financial-services reviews.
