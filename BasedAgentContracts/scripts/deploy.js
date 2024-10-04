const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AgentToken implementation first
  const AgentToken = await ethers.getContractFactory("AgentToken");
  const agentTokenImpl = await upgrades.deployImplementation(AgentToken);
  console.log("AgentToken implementation deployed at:", agentTokenImpl);

  // Deploy the AgentFactory contract
  const AgentFactory = await ethers.getContractFactory("AgentFactory");
  const factory = await upgrades.deployProxy(
    AgentFactory,
    [agentTokenImpl, "0x4fC3CDC06cB4B583abe914befb959A1Bbda9572c"],
    { initializer: "initialize" }
  );
  await factory.deployed();
  console.log("AgentFactory deployed to:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
