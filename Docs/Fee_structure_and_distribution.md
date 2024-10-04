# BasedAgent Fee Structure and Distribution Documentation

## 1. Fee Types and Amounts

### 1.1 One-Time Fees:
- **Deployment Fee:** 0.01 ETH (paid when deploying a new AI Agent)
- **Liquidity Fee:** 1 ETH (paid when AI Agent Token's liquidity moves to a DEX after 100% raise on bonding curve)

### 1.2 Ongoing Fees:
- **Trading Fee:** 1% of total transaction value
- **Usage Fee:** 1% of total transaction value

## 2. Fee Distribution

### 2.1 One-Time Fees:
- **Deployment and Liquidity Fees** go directly to the multisig wallet.

### 2.2 Trading and Usage Fees:

#### a) With a referrer:
- **Referrer:** 0.5/3% (≈0.167%)
- **Middle Layer Agent (e.g. Frontend):** 0.5/3% (≈0.167%)
- **AI Agent:** 0.5/3% (≈0.167%)
- **Multisig:** 0.5%

#### b) Without a referrer:
- **Middle Layer Agent (e.g. Frontend):** 0.5/2% (0.25%)
- **AI Agent:** 0.5/2% (0.25%)
- **Multisig:** 0.5%

## 3. Fee Accrual and Claiming Process

### 3.1 Batched Balance Updates:
- The system accumulates owed amounts for each party (AI Agents, Middle Layer Agents, Referrers) in a smart contract.
- Balances are updated in batches at regular intervals or when certain thresholds are met to optimize gas costs.

### 3.2 Claim-Based System:
- Parties must actively claim their earned ETH rather than receiving automatic transfers.
- A `claim()` function will be implemented in the smart contract for withdrawals.
- A minimum claimable amount will be set to prevent dust accumulation.

### 3.3 Unclaimed Fees:
- Fees unclaimed for 6 months automatically transfer to the multisig wallet.
- This process should be automated within the smart contract.

### 3.4 Optimizations:
- Consider implementing on Layer 2 solutions for reduced gas costs.
- Use gas price oracles to execute batch updates during low gas price periods.
- Implement Merkle proofs for efficient balance verification in large-scale systems.

## 4. Frontend/Middle Layer Interface Attribution

### 4.1 Frontend Registration:
- Each frontend must register as a Middle Layer Agent in the Agent registry.
- Assign a unique identifier to each registered frontend.

### 4.2 User Interaction Tracking:
- When a user connects their wallet to a frontend, capture the frontend's unique identifier.
- Store this association (user wallet address ↔ frontend identifier) in the smart contract.

### 4.3 Transaction Attribution:
- For each transaction (trading or usage), check the user's associated frontend.
- Attribute the appropriate portion of the fee to the linked frontend.

### 4.4 Implementation Approach:
- Use a mapping in the smart contract: `mapping(address => bytes32) public userFrontendAssociation;`
- Update this mapping when a user connects to a frontend: `function associateUserWithFrontend(address user, bytes32 frontendId) public`
- Check this mapping during fee distribution to attribute fees correctly.

### 4.5 Considerations:
- Allow users to change their associated frontend.
- Implement a time-lock or cool-down period for changing frontends to prevent abuse.
- Consider a default "no frontend" state for direct smart contract interactions.

## 5. Rationale for Fee Structure

### 5.1 Incentivizing Participation:
- The fee structure encourages the development of AI Agents, frontends, and promotional activities.
- Ongoing fees provide sustainable income for all participants.

### 5.2 Fair Distribution:
- Splitting fees among referrers, frontends, and AI Agents ensures all contributors are rewarded.
- The multisig portion ensures continued funding for infrastructure and security.

### 5.3 Scalability and Efficiency:
- Batched updates and claim-based distribution reduce gas costs and network congestion.
- The 6-month unclaimed fee transfer prevents indefinite fund locks and provides additional resources to the protocol.

## 6. Smart Contract Implementation Guidelines

### 6.1 Core Functions:
- Implement fee calculation and distribution logic.
- Create batching mechanisms for balance updates.
- Develop the `claim()` function with appropriate checks and balances.
- Implement the 6-month unclaimed fee transfer mechanism.

### 6.2 Security Considerations:
- Implement access controls for administrative functions.
- Use SafeMath or similar libraries to prevent overflows.
- Include emergency pause functionality.
- Thoroughly test edge cases, especially around fee calculations and distributions.

### 6.3 Gas Optimization:
- Use efficient data structures for storing balances and fee information.
- Optimize loops and batch processing to minimize gas costs.

### 6.4 Upgrade Path:
- Consider using upgradeable contract patterns to allow for future improvements.
