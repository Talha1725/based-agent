// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Upgradeable Contracts
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

// Import ABDK Math for fixed-point arithmetic
import "abdk-libraries-solidity/ABDKMath64x64.sol";

contract AgentToken is
    ERC20VotesUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    struct Metadata {
        string name;
        string url;
    }

    uint256 public vEth;
    uint256 public vToken;
    address public agentWallet; // Wallet of the agent
    address public platformWallet; // Wallet of the platform
    uint256 public constant feePercentage = 1; // 1% fee
    uint256 public constant agentShare = 50; // Agent receives 50% of the fee
    Metadata public metadata;

    event TokensPurchased(
        address indexed buyer,
        uint256 ethAmount,
        uint256 tokenAmount
    );
    event TokensSold(
        address indexed seller,
        uint256 tokenAmount,
        uint256 ethAmount
    );
    event MetadataUpdated(string field, string value);

    // Initialize the token with metadata and bonding curve
    function initialize(
        string memory name,
        string memory symbol,
        address _agentWallet,
        address _platformWallet,
        uint256 _initialTokenSupply,
        uint256 _vEth,
        uint256 _vToken,
        Metadata memory _metadata
    ) public initializer {
        __ERC20_init(name, symbol);
        __ERC20Votes_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        require(_agentWallet != address(0), "Invalid agent wallet");
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(
            _initialTokenSupply > 0,
            "Initial token supply must be greater than zero"
        );

        agentWallet = _agentWallet;
        platformWallet = _platformWallet;
        vEth = _vEth; // Initial virtual ETH reserve
        vToken = _vToken; // Initial virtual token reserve
        metadata = _metadata;

        _mint(msg.sender, _initialTokenSupply);
    }

    // Exponential price function based on market cap
    function calculatePrice(uint256 marketCap) public pure returns (uint256) {
        // y = 0.6015 * e^(0.00003606 * marketCap)
        int128 a = ABDKMath64x64.divu(6015, 10000); // 0.6015 in 64.64 format
        int128 b = ABDKMath64x64.divu(3606, 100000000); // 0.00003606 in 64.64 format

        int128 x = ABDKMath64x64.fromUInt(marketCap); // Convert marketCap to 64.64 format

        int128 exponent = b.mul(x); // b * x
        int128 expResult = exponent.exp(); // e^(b * x)

        int128 y = a.mul(expResult); // y = a * e^(b * x)

        uint256 price = y.mulu(1e18); // Convert back to uint256 with scaling

        return price; // Price per token in wei
    }

    function calculateTokensToReceive(
        uint256 ethAmount
    ) public view returns (uint256) {
        uint256 marketCap = totalSupply() + vToken; // Adjusted market cap
        uint256 pricePerToken = calculatePrice(marketCap);
        require(pricePerToken > 0, "Price per token is zero");

        uint256 tokens = (ethAmount * 1e18) / pricePerToken;

        return tokens;
    }

    function buyTokens() external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "Must send ETH to buy tokens");

        // Calculate fees
        uint256 fee = (msg.value * feePercentage) / 100; // 1% fee
        uint256 agentFee = (fee * agentShare) / 100; // 50% to agent
        uint256 platformFee = fee - agentFee; // Remaining 50% to platform
        uint256 netEthAmount = msg.value - fee; // ETH amount after fees

        uint256 tokensToReceive = calculateTokensToReceive(netEthAmount);
        require(tokensToReceive > 0, "Insufficient purchase amount");

        // Mint tokens to buyer
        _mint(msg.sender, tokensToReceive);

        // Adjust virtual reserves
        vEth += netEthAmount;
        vToken -= tokensToReceive;

        // Distribute fees
        (bool sentAgentFee, ) = agentWallet.call{value: agentFee}("");
        require(sentAgentFee, "Failed to send agent fee");
        (bool sentPlatformFee, ) = platformWallet.call{value: platformFee}("");
        require(sentPlatformFee, "Failed to send platform fee");

        emit TokensPurchased(msg.sender, netEthAmount, tokensToReceive);
    }

    // Function to calculate the ETH to receive based on tokens sold using the exponential formula
    function calculateEthToReceive(
        uint256 tokenAmount
    ) public view returns (uint256) {
        uint256 marketCap = totalSupply() - tokenAmount + vToken; // Adjusted market cap after tokens are burned
        uint256 pricePerToken = calculatePrice(marketCap);
        require(pricePerToken > 0, "Price per token is zero");

        uint256 ethAmount = (tokenAmount * pricePerToken) / 1e18;

        return ethAmount;
    }

    function sellTokens(
        uint256 tokenAmount
    ) external whenNotPaused nonReentrant {
        require(tokenAmount > 0, "Must sell at least some tokens");
        require(
            balanceOf(msg.sender) >= tokenAmount,
            "Insufficient token balance"
        );

        uint256 ethToReceive = calculateEthToReceive(tokenAmount);
        require(ethToReceive > 0, "Insufficient sale amount");
        require(
            address(this).balance >= ethToReceive,
            "Contract has insufficient ETH"
        );

        // Calculate fees
        uint256 fee = (ethToReceive * feePercentage) / 100; // 1% fee
        uint256 agentFee = (fee * agentShare) / 100; // 50% to agent
        uint256 platformFee = fee - agentFee; // Remaining 50% to platform
        uint256 netEthToReceive = ethToReceive - fee; // ETH amount after fees

        // Burn tokens
        _burn(msg.sender, tokenAmount);

        // Adjust virtual reserves
        vEth -= netEthToReceive;
        vToken += tokenAmount;

        // Transfer ETH to seller
        (bool sent, ) = msg.sender.call{value: netEthToReceive}("");
        require(sent, "Failed to send ETH to seller");

        // Transfer fees
        (bool sentAgentFee, ) = agentWallet.call{value: agentFee}("");
        require(sentAgentFee, "Failed to send agent fee");
        (bool sentPlatformFee, ) = platformWallet.call{value: platformFee}("");
        require(sentPlatformFee, "Failed to send platform fee");

        emit TokensSold(msg.sender, tokenAmount, netEthToReceive);
    }

    // Update agent metadata
    function updateMetadata(Metadata memory _metadata) external onlyOwner {
        metadata = _metadata;
        emit MetadataUpdated("all", "updated");
    }

    // Pause contract for emergencies
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    // Required for UUPSUpgradeable pattern
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    receive() external payable {}
}
