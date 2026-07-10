# Evenly

**Evenly is a Solana-powered financial coordination app that helps people prepare personal expenses and shared financial commitments whenever money comes in.**

Instead of only showing where money was spent, Evenly helps users decide where it should go before important payments are due.

## The problem

People often receive income at different times while rent, bills, savings goals, and group contributions remain fixed.

Managing these commitments across spreadsheets, wallets, banking apps, and group chats creates missed payments, confusion, and disputes.

## The solution

Evenly automatically divides incoming money according to the user’s priorities.

Example:

```text
Payment received: 1,000 USDC

Available spending       400 USDC
Rent and bills           250 USDC
Emergency savings        150 USDC
Payday buffer            100 USDC
Group contribution        75 USDC
Tax reserve               25 USDC
```

Users can immediately see which commitments are:

* Ready
* Building
* At risk

## Product areas

### Life

Manage:

* Income
* Spending
* Rent and bills
* Emergency savings
* Personal payday
* Savings goals
* Shared household expenses

### Groups

Coordinate money with other people through:

* Recurring contributions
* Shared savings goals
* Rotating payouts
* Emergency funds
* Shared treasuries
* Approval-based withdrawals
* Contribution records

Personal finances remain private while shared commitments and shared money remain transparent.

## Why Solana

Solana powers:

* Fast stablecoin payments
* Low-cost contribution transfers
* Programmable allocation rules
* Shared treasury accounts
* Multi-member approvals
* Verifiable contribution receipts
* Cross-border participation

Blockchain details remain hidden from normal users.

## Current MVP

The current build includes:

* Life dashboard
* Income allocation rules
* Bills and savings preparation
* Readiness tracking
* Group creation
* Member contribution tracking
* Treasury proposal flows
* Solana wallet connection
* Devnet proof transactions
* Anchor treasury program source

The Life and Groups balances currently use a local demo ledger.

The Anchor program has not yet been deployed or connected to the frontend.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Workspace commands

```bash
npm run dev
npm run build
npm run typecheck
npm run test
```

## Product principle

> When money comes in, everything important gets prepared.
