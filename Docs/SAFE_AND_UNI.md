# **Technical Document: Modifications and New Contract Implementation for AI Agent & Token Deployment**

## **Overview**

This document outlines the necessary modifications and new contract logic required for AI Agent deployment, managing token control post-bonding curve, vault creation, Contributor Vault management, and liquidity transfer to Uniswap V3 once the bonding curve reaches 100%. The system is designed to give the Agent Developer full control over the token contract after the bonding curve phase is completed, while allowing flexible vault creation, managing tokenless agent deployment, and handling the protocol's fee allocation with LP token burning for security.

## **Objectives**

1. **Deploy AI Agents Without Tokens**: Enable the system to deploy AI Agents without requiring the creation of tokens.
2. **Full Control After Bonding Curve Completion**: After the bonding curve reaches 100% and liquidity transitions to a DEX (Uniswap V3), the Agent Developer will have full control over the token contract (minting, burning, governance, etc.).
3. **Create Additional Vaults**: Allow Agent Developers to create multiple vaults post-deployment, each being a 1/1 multisig controlled by the Agent Developer.
4. **Contributor Vault Creation**: Create a Contributor Vault only if the Contributor Pool allocation is greater than 0%. If the allocation is 0%, no Contributor Vault will be created.
5. **Liquidity Transfer to Uniswap V3**: Move liquidity from the bonding curve to Uniswap V3 once the bonding curve reaches 100%, allocating a percentage of collected ETH (5%) as a fee payable to the protocol. Burn the LP tokens for the remaining 95% to ensure security.

---

## **1. Modify `AIAgentFactory.sol` to Allow Tokenless Agent Deployment**

### **Changes**:
- Introduce an option to deploy AI Agents without creating a token.
- Metadata relating to the Agent (name, skills, description) will remain, but token-related fields and the bonding curve will be omitted when the `withToken` flag is `false`.

### **Implementation**:

```solidity
function createAgent(
    string memory name,
    string memory symbol,
    address agentWallet,  // the deployer's address
    uint256 initialTokenSupply,
    uint256 vEth,
    uint256 vToken,
    AgentToken.Metadata memory metadata,
    bool withToken,  // New flag to indicate whether to create a token
    uint256 contributorAllocation // New parameter for Contributor Pool allocation
) external returns (address) {
    require(agentWallet != address(0), "Invalid agent wallet");

    if (withToken) {
        require(bytes(name).length > 0, "Token name required");
        require(bytes(symbol).length > 0, "Token symbol required");
        require(initialTokenSupply > 0, "Initial token supply must be greater than zero");

        // Clone and initialize the token
        address clone = Clones.clone(implementationContract);
        AgentToken newToken = AgentToken(payable(clone));
        newToken.initialize(
            name,
            symbol,
            agentWallet,
            platformWallet,
            initialTokenSupply,
            vEth,
            vToken,
            metadata
        );
        newToken.transferOwnership(msg.sender);
        emit AgentCreated(address(newToken), msg.sender);
        
        // Conditionally create Contributor Vault if allocation > 0
        if (contributorAllocation > 0) {
            createContributorVault(agentWallet);
        }

        return address(newToken);
    } else {
        // If no token is needed, deploy just the multisig (without token)
        emit AgentCreatedWithoutToken(agentWallet, metadata.name);
        return agentWallet;
    }
}
```

---

## **2. Modify `AgentToken.sol` to Grant Full Control After Bonding Curve Completion**

### **Changes**:
- Implement a restriction to prevent minting, burning, or other token modifications until the bonding curve has reached 100% and liquidity transitions to Uniswap V3.
- Once the bonding curve is complete, full control over the token contract is granted to the Agent Developer.

### **Implementation**:

```solidity
bool public bondingCurveComplete;

modifier onlyAfterBondingCurve() {
    require(bondingCurveComplete, "Bonding curve phase is still active");
    _;
}

// Function to mark the bonding curve phase as complete (only callable by platform)
function completeBondingCurve() external onlyOwner {
    bondingCurveComplete = true;
}

// Example mint function for the Agent Developer, allowed only after bonding curve
function mint(address to, uint256 amount) external onlyOwner onlyAfterBondingCurve {
    _mint(to, amount);
}

// Agent Dev will have full control over token functions after bonding curve completion
function burn(address from, uint256 amount) external onlyOwner onlyAfterBondingCurve {
    _burn(from, amount);
}

// Full flexibility for contract ownership transfer
function transferTokenContractOwnership(address newOwner) external onlyOwner onlyAfterBondingCurve {
    transferOwnership(newOwner);
}
```

---

## **3. Allow Creation of Additional Vaults (1/1 Multisig) Post-Deployment**

### **Changes**:
- Add functionality to allow the Agent Developer to create additional vaults after deploying their AI Agent.
- Each vault will be a 1/1 multisig, with the Agent Developer as the sole signer.

### **Implementation**:

```solidity
function createVault() external onlyOwner returns (address) {
    address[] memory owners = new address[](1);
    owners[0] = msg.sender; // The deployer is the owner of the vault
    uint256 threshold = 1;

    // Deploy a new multisig vault using Gnosis Safe proxy factory
    GnosisSafeProxy safeProxy = gnosisSafeProxyFactory.createProxy(
        safeImplementation, 
        abi.encodeWithSignature(
            "setup(address[],uint256,address,bytes,address,address,uint256,address)",
            owners,
            threshold,
            address(0),
            "",
            address(0),
            address(0),
            0,
            address(0)
        )
    );
    
    emit VaultCreated(address(safeProxy), msg.sender);
    return address(safeProxy);
}
```

---

## **4. Contributor Vault Creation Based on Allocation**

### **Changes**:
- If the Contributor Pool allocation is set to greater than 0%, the system will programmatically create a Contributor Vault for the Agent Developer.
- If the allocation is 0%, the Contributor Vault will not be created to avoid unnecessary gas costs.

### **Implementation**:

```solidity
function createContributorVault(address agentWallet) internal returns (address) {
    address[] memory owners = new address[](1);
    owners[0] = agentWallet; // The deployer is the owner of the Contributor Vault
    uint256 threshold = 1;

    // Deploy a new multisig vault for the Contributor Pool
    GnosisSafeProxy safeProxy = gnosisSafeProxyFactory.createProxy(
        safeImplementation,
        abi.encodeWithSignature(
            "setup(address[],uint256,address,bytes,address,address,uint256,address)",
            owners,
            threshold,
            address(0),
            "",
            address(0),
            address(0),
            0,
            address(0)
        )
    );

    emit ContributorVaultCreated(address(safeProxy), agentWallet);
    return address(safeProxy);
}
```

---

## **5. Transfer of Liquidity to Uniswap V3 After Bonding Curve Completion**

### **Overview of Liquidity Transfer**:
When the bonding curve reaches 100%, the platform will transfer liquidity (tokens and ETH) to Uniswap V3. A portion of the ETH collected during the bonding curve phase will be used as a protocol fee (5%), and the remaining liquidity will be moved to the Uniswap pool.

### **Process**:

1. **Trigger Liquidity Transfer**:
   - Once the bonding curve is 100% complete, the platform will trigger the transfer of liquidity to Uniswap V3.
   - The bonding curve contract will hold both the AI Agent tokens and ETH that have been collected from token sales.

2. **Protocol Fee Allocation**:
   - Before transferring liquidity, a percentage of the ETH collected during the bonding curve phase (5%) will be allocated to the platform's wallet as a **protocol fee**.
   - The remaining ETH will be paired with the AI Agent tokens to provide liquidity on Uniswap V3.

3. **Burn the LP Tokens**:
   - The protocol burns the LP tokens representing **95%** of the liquidity to lock it permanently.
   - The LP tokens representing the **5% share** of the protocol's liquidity are **retained** for future management or sale.

### **Implementation**:

```solidity
// Add liquidity function
function addLiquidityToUniswapV3(
    address tokenAddress,
    uint256 totalAmountETH,
    uint256 amountToken
) external returns (uint256 protocolTokenId, uint256 burnedTokenId) {
    // Check if pool exists, otherwise create it
    address poolAddress = uniswapV3Factory.getPool(address(tokenAddress), address(WETH), FEE_TIER);
    if (poolAddress == address(0)) {
        // Pool does not exist, create the pool
        poolAddress = createPool(tokenAddress);
    }

    // Calculate the protocol's share (5%) of ETH
    uint256 protocolEthShare = (totalAmountETH * protocolFeePercentage) / 100;
    uint256 liquidityEthShare = totalAmountETH - protocolEthShare;

    // Approve the position manager to spend tokens
    IERC20(tokenAddress).approve(address(positionManager), amountToken);
    
    // Approve WETH (wrapped ETH) approval for both liquidity and protocol shares
    IWETH(WETH).approve

(address(positionManager), liquidityEthShare);
    IWETH(WETH).approve(address(positionManager), protocolEthShare);

    // Add liquidity to the Uniswap V3 pool for the protocol's 5% share (without burning the NFT)
    INonfungiblePositionManager.MintParams memory protocolParams = INonfungiblePositionManager.MintParams({
        token0: tokenAddress,
        token1: address(WETH),
        fee: FEE_TIER,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: amountToken,     // Entire amount of tokens used for both liquidity and protocol share
        amount1Desired: protocolEthShare,  // Only the 5% of ETH for the protocol
        amount0Min: 0,
        amount1Min: 0,
        recipient: address(this),         // Protocol will receive the NFT
        deadline: block.timestamp + 1200  // 20 minutes deadline
    });

    // Mint the protocol's liquidity position (5%)
    (protocolTokenId,,,) = positionManager.mint(protocolParams);
    require(protocolTokenId > 0, "Protocol liquidity provision failed");

    // Add liquidity to the Uniswap V3 pool for the remaining 95% and burn the NFT
    INonfungiblePositionManager.MintParams memory liquidityParams = INonfungiblePositionManager.MintParams({
        token0: tokenAddress,
        token1: address(WETH),
        fee: FEE_TIER,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: amountToken,     // Same total amount of tokens
        amount1Desired: liquidityEthShare,  // Remaining 95% of ETH
        amount0Min: 0,
        amount1Min: 0,
        recipient: address(this),        // Contract will receive the NFT
        deadline: block.timestamp + 1200  // 20 minutes deadline
    });

    // Mint the liquidity position for the remaining share
    (burnedTokenId,,,) = positionManager.mint(liquidityParams);
    require(burnedTokenId > 0, "Liquidity provision failed");

    // Burn the NFT immediately for the 95% liquidity share
    positionManager.burn(burnedTokenId);

    emit LiquidityAdded(tokenAddress, amountToken, totalAmountETH, protocolTokenId, burnedTokenId);
}

// Function to create a pool if it doesn't exist
function createPool(address tokenAddress) internal returns (address pool) {
    pool = uniswapV3Factory.createPool(tokenAddress, address(WETH), FEE_TIER);
    require(pool != address(0), "Pool creation failed");
    IUniswapV3Pool(pool).initialize(MIN_SQRT_PRICE); // Initializing with min sqrt price

    emit PoolCreated(tokenAddress, pool);
}

// Event declarations for easier tracking
event LiquidityAdded(address indexed token, uint256 amountToken, uint256 totalAmountETH, uint256 protocolTokenId, uint256 burnedTokenId);
event PoolCreated(address indexed token, address indexed pool);
```

---

### **Summary of the Liquidity Transfer Process**:
- When the bonding curve reaches 100%, the platform triggers the transfer of liquidity to Uniswap V3.
- **5% protocol fee** (or another configured percentage) is deducted from the total ETH balance and sent to the platform’s wallet.
- The remaining ETH and AI Agent tokens are then moved to Uniswap V3, establishing or enhancing the liquidity pool for the token.
- The **LP tokens representing 95% of the liquidity** are burned to lock that liquidity permanently.
- The **protocol retains control** of LP tokens representing 5% of the liquidity for potential future sale or management.

---

## **Summary of Key Changes**

- **AI Agent Creation Without Token**: Developers can now create AI Agents without deploying a token by specifying agent metadata and skipping token-related logic.
- **Full Control After Bonding Curve**: Agent Developers will have full control of the token contract (including minting, burning, governance changes, etc.) after the bonding curve phase is complete.
- **Vault Creation Post-Deployment**: Developers can create additional 1/1 multisig vaults after deployment for flexible asset management without limits.
- **Contributor Vault Creation**: A Contributor Vault will be created only if the Contributor Pool allocation is greater than 0%. If set to 0%, no vault will be created to avoid gas overhead.
- **Liquidity Transfer to Uniswap V3**: Once the bonding curve reaches 100%, liquidity (ETH and AI Agent tokens) will be transferred to Uniswap V3. **5% of the ETH** is allocated as a protocol fee, with the LP tokens for **95%** of the liquidity being **burned** to secure it permanently.
