# Architecture

## Prototype architecture

```text
Next.js web app
  ├─ Product state (React context + localStorage)
  ├─ Allocation engine (@coordination/core)
  ├─ LazorKit passkey wallet
  └─ Solana Memo proof receipt

Future production services
  ├─ Encrypted user database
  ├─ Payment processor / fiat and mobile-money partners
  ├─ Indexer and notification worker
  ├─ Risk and reconciliation service
  └─ Anchor coordination program
```

## Onchain / offchain boundary

Onchain:
- shared treasury token balances
- member contribution events
- payout proposals and approvals
- compact receipt hashes
- role and threshold controls

Offchain and encrypted:
- names and phone numbers
- client and salary information
- personal spending history
- invoice descriptions
- household conversations
- supporting documents
- notifications

## Why the prototype uses a memo receipt

The web demo must remain runnable before a custom program is deployed. The Memo program allows the passkey wallet to anchor a compact SHA-256 state fingerprint on Devnet. The included Anchor program is the migration path for token-backed treasuries and enforceable approvals.
