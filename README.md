# Subscribe Onchain

## Getting Started

### Environment Variables

Copy our template environment file and fill in missing variables.

```bash
cp template.env .env
```

```
NEXT_PUBLIC_ONCHAINKIT_CDP_KEY=""
BASE_SEPOLIA_PAYMASTER_URL=""
SPENDER_OWNER_PRIVATE_KEY=""
NEXT_PUBLIC_SPENDER_WALLET_ADDRESS=""
```

First, go to [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com) and sign up for an account.

- `NEXT_PUBLIC_ONCHAINKIT_CDP_KEY`: Go to "Onchain Tools" > "OnchainKit" and copy "Client API Key"
- `BASE_SEPOLIA_PAYMASTER_URL`: Go to "Onchain Tools" > "Paymaster" > "Configuration" and change the network dropdown on the far right to "Base Testnet (Sepolia)" and copy "Paymaster & Bundler endpoint"

Next, you need to generate a **new** private key. Foundry's `cast wallet new` is recommended and you can [install Foundry here](https://book.getfoundry.sh/getting-started/installation).

- `SPENDER_OWNER_PRIVATE_KEY`: set the output private key from `cast wallet new`
- `NEXT_PUBLIC_SPENDER_WALLET_ADDRESS`: set the output address from `cast wallet new` (note we will actually change this later)

### Install and run

```bash
npm install
npm run dev
```
