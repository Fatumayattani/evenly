# Solana Financial Coordination MVP

A working product prototype for coordinating personal and shared financial commitments on Solana.

The product deliberately has **no final brand name yet**. The interface is organized around two universal spaces:

- **Life** — income, upcoming bills, personal payday buffer, emergency savings, taxes, and selected shared household expenses.
- **Groups** — any multi-person contribution arrangement with shared goals, transparent commitments, a treasury, and approval rules.

## Signature behavior

When income arrives, allocation rules prepare the things that matter before their due dates. The app shows each commitment as **Ready**, **Building**, or **At risk**.

## Included

- Polished mobile-first Next.js application
- Real browser-wallet connection on Solana Devnet
- Gas-sponsored onchain proof receipts using the Solana Memo program
- Deterministic allocation engine with integer-safe rounding
- Life dashboard and automatic income allocation
- Group contribution readiness and treasury tracking
- Multi-approval payout demo
- Local persistence for a complete demo without a backend
- Anchor program source for token-backed group treasuries and approval-controlled payouts
- Unit tests for the allocation engine

## Run the web app

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works immediately in demo-ledger mode. Connect a compatible browser wallet to record state proofs on Solana Devnet. A LazorKit passkey adapter is documented as the production onboarding path.

## Validate

```bash
npm test
npm run typecheck
npm run build
```

## Onchain program

The Anchor workspace is under `anchor/`. It is intentionally separate from the demo ledger so the product can be tested before deploying custody logic.

Prerequisites: Rust, Solana CLI, and Anchor CLI.

```bash
cd anchor
anchor build
anchor test
```

Before deployment, run `anchor keys sync`, rebuild, and replace the placeholder program ID.

## Important product boundaries

This repository is a prototype, not production financial software. It does not provide custody, lending, insurance, investment returns, fiat conversion, or regulatory compliance. Live-money deployment requires security audits, licensed payment/off-ramp partners, consumer protection controls, and jurisdiction-specific legal review.
