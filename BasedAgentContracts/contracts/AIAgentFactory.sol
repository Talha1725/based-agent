// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Upgradeable Contracts
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Import OpenZeppelin Clone Library
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./AgentToken.sol";

contract AgentFactory is OwnableUpgradeable, UUPSUpgradeable {
    address public implementationContract;
    address public platformWallet;

    // Event emitted when a new agent is created
    event AgentCreated(
        address indexed agentTokenAddress,
        address indexed admin
    );

    function initialize(
        address _implementationContract,
        address _platformWallet
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        require(
            _implementationContract != address(0),
            "Invalid implementation contract"
        );
        require(_platformWallet != address(0), "Invalid platform wallet");

        implementationContract = _implementationContract;
        platformWallet = _platformWallet;
    }

    // Create a new agent token with metadata
    function createAgent(
        string memory name,
        string memory symbol,
        address agentWallet,
        uint256 initialTokenSupply,
        uint256 vEth,
        uint256 vToken,
        AgentToken.Metadata memory metadata
    ) external returns (address) {
        require(agentWallet != address(0), "Invalid agent wallet");
        require(bytes(name).length > 0, "Token name required");
        require(bytes(symbol).length > 0, "Token symbol required");
        require(
            initialTokenSupply > 0,
            "Initial token supply must be greater than zero"
        );

        // Clone the implementation contract
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

        // Transfer ownership of the token to the agent developer
        newToken.transferOwnership(msg.sender);

        emit AgentCreated(address(newToken), msg.sender);

        return address(newToken);
    }

    // Update platform wallet address
    function updatePlatformWallet(
        address _newPlatformWallet
    ) external onlyOwner {
        require(_newPlatformWallet != address(0), "Invalid platform wallet");
        platformWallet = _newPlatformWallet;
    }

    // Update the token implementation contract address
    function updateImplementationContract(
        address _newImplementationContract
    ) external onlyOwner {
        require(
            _newImplementationContract != address(0),
            "Invalid implementation contract"
        );
        implementationContract = _newImplementationContract;
    }

    // Authorization for contract upgrades
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
