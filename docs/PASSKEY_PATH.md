# Passkey onboarding path

The runnable MVP uses a standard injected Solana wallet so the product can be validated with a small dependency surface. Production onboarding should replace this adapter with LazorKit or another audited passkey smart-wallet provider.

The official LazorKit React integration uses `LazorkitProvider` and `useWallet`, supports WebAuthn, smart-wallet PDAs, gas sponsorship, session keys, and spending limits. Keep the rest of the product behind the `SolanaWalletProvider` interface so this migration does not affect Life or Groups business logic.

Recommended production work:

1. Replace `lib/solana-wallet.tsx` with a LazorKit-backed adapter.
2. Display `wallet.vaultPda` as the user's funding address.
3. Use paymaster mode for consumer transactions.
4. Create scoped sessions only after explicit consent and with immutable spending limits.
5. Add recovery, device replacement, and account-export tests.
6. Never treat passkey authentication alone as compliance or transaction-risk screening.
