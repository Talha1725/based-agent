# BasedAgent

BasedAgent is a platform for creating and managing AI agents with custom tokens, featuring bonding curves, referral systems, and cross-chain compatibility.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Project Structure](#project-structure)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Usage](#usage)

## Prerequisites

- Node.js (v14.0.0 or later)
- Yarn (v1.22.0 or later)
- Solidity (v0.8.0 or later)
- Rust (latest stable version)
- Anchor CLI (latest version)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/based-agent.git
   cd based-agent
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   PRIVATE_KEY=your_ethereum_private_key
   INFURA_PROJECT_ID=your_infura_project_id
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. Compile the contracts:
   For Ethereum/BASE:
   ```
   npx hardhat
   ```
    ```
   npx hardhat compile
   ```
   For Solana:
   ```
   anchor build
   ```

## Project Structure

```
based-agent/
├── contracts/
│   ├── BasedAgentToken.sol
│   ├── BasedAgentReferral.sol
│   └── AIAgentFactory.sol
├── programs/
│   └── based-agent/
│       └── src/
│           └── lib.rs
├── tests/
│   ├── BasedAgentToken.test.js
│   ├── BasedAgentReferral.test.js
│   └── AIAgentFactory.test.js
├── scripts/
│   ├── deploy_ethereum.js
│   └── deploy_solana.js
├── hardhat.config.js
├── Anchor.toml
└── package.json
```

## Deployment

### Ethereum/BASE

1. Deploy to a testnet (e.g., Goerli):
   ```
   npx hardhat run scripts/deploy_ethereum.js --network goerli
   ```

2. Verify the contract on Etherscan:
   ```
   npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS "Constructor Argument 1" "Constructor Argument 2"
   ```

### Solana

1. Deploy to devnet:
   ```
   anchor deploy
   ```

2. Update the program ID in `Anchor.toml` and `lib.rs` with the deployed program ID.

## Testing

### Ethereum/BASE

Run the test suite:
```
npx hardhat test
```

### Solana

Run the test suite:
```
anchor test
```

## Usage

After deployment, interact with the contracts using a web3 library like ethers.js for Ethereum/BASE or @project-serum/anchor for Solana.

Example (Ethereum/BASE):
```javascript
const { ethers } = require("ethers");
const BasedAgentToken = require("./artifacts/contracts/BasedAgentToken.sol/BasedAgentToken.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
  const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
  const contract = new ethers.Contract("CONTRACT_ADDRESS", BasedAgentToken.abi, signer);

  // Interact with the contract
  const result = await contract.someFunction();
  console.log(result);
}

main();
```

For more detailed usage instructions, refer to the comprehensive documentation.
