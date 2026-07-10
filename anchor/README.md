# Coordination program

Anchor program source for a future production version of the product.

It supports:
- user profiles
- token-backed group treasuries
- self-service group membership
- verifiable contribution events
- payout proposals
- one approval per member and proposal
- threshold-controlled payouts
- SPL Token and Token-2022 through `token_interface`

## Security notes

This code is an MVP and has not been audited. Before mainnet use, add:
- controlled invitation / membership policy
- member removal and safe exit flows
- proposal cancellation and expiry
- threshold-change governance and timelocks
- group closure and rent recovery
- transfer-fee / Token-2022 extension handling
- account versioning and migrations
- emergency pause design
- comprehensive integration and invariant tests
- independent audit
