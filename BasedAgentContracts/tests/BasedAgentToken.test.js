const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("BasedAgentToken", function () {
  let BasedAgentToken;
  let basedAgentToken;
  let BasedAgentReferral;
  let basedAgentReferral;
  let AIAgentFactory;
  let aiAgentFactory;
  let owner;
  let aiAgentWallet;
  let contributorPoolWallet;
  let platformWallet;
  let addr1;
  let addr2;

  const TOKEN_NAME = "BasedAgent Token";
  const TOKEN_SYMBOL = "BAT";
  const TOTAL_SUPPLY = ethers.utils.parseEther("100000000"); // 100 million tokens
  const BONDING_CURVE_PERCENTAGE = 80;
  const CONTRIBUTOR_POOL_PERCENTAGE = 0;

  beforeEach(async function () {
    [owner, aiAgentWallet, contributorPoolWallet, platformWallet, addr1, addr2] = await ethers.getSigners();

    BasedAgentToken = await ethers.getContractFactory("BasedAgentToken");
    BasedAgentReferral = await ethers.getContractFactory("BasedAgentReferral");
    AIAgentFactory = await ethers.getContractFactory("AIAgentFactory");

    basedAgentToken = await upgrades.deployProxy(BasedAgentToken, [
      TOKEN_NAME,
      TOKEN_SYMBOL,
      aiAgentWallet.address,
      contributorPoolWallet.address,
      platformWallet.address,
      ethers.constants.AddressZero, // referral contract address, will be set later
      BONDING_CURVE_PERCENTAGE,
      CONTRIBUTOR_POOL_PERCENTAGE,
      {
        name: "Test Agent",
        description: "A test AI agent",
        website: "https://testagent.com",
        telegram: "@testagent",
        twitter: "@testagent",
        github: "testagent",
        logoIpfsHash: "QmTest...",
      }
    ]);

    basedAgentReferral = await upgrades.deployProxy(BasedAgentReferral, [basedAgentToken.address]);

    aiAgentFactory = await upgrades.deployProxy(AIAgentFactory, [
      basedAgentToken.address,
      basedAgentReferral.address
    ]);

    await basedAgentToken.setReferralContract(basedAgentReferral.address);
    await basedAgentToken.transferOwnership(aiAgentFactory.address);
    await basedAgentReferral.transferOwnership(aiAgentFactory.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await basedAgentToken.owner()).to.equal(aiAgentFactory.address);
    });

    it("Should assign the total supply of tokens to the contract", async function () {
      const contractBalance = await basedAgentToken.balanceOf(basedAgentToken.address);
      expect(await basedAgentToken.totalSupply()).to.equal(contractBalance);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await basedAgentToken.name()).to.equal(TOKEN_NAME);
      expect(await basedAgentToken.symbol()).to.equal(TOKEN_SYMBOL);
    });
  });

  describe("Token Purchase", function () {
    it("Should allow users to buy tokens", async function () {
      const buyAmount = ethers.utils.parseEther("1");
      await basedAgentToken.connect(addr1).buyTokens({ value: buyAmount });

      const addr1Balance = await basedAgentToken.balanceOf(addr1.address);
      expect(addr1Balance).to.be.gt(0);
    });

    it("Should update contract state after token purchase", async function () {
      const buyAmount = ethers.utils.parseEther("1");
      await basedAgentToken.connect(addr1).buyTokens({ value: buyAmount });

      const contractState = await basedAgentToken.getContractState();
      expect(contractState.ethRaised).to.equal(buyAmount);
      expect(contractState.tokensSold).to.be.gt(0);
    });

    it("Should fail when trying to buy tokens with 0 ETH", async function () {
      await expect(
        basedAgentToken.connect(addr1).buyTokens({ value: 0 })
      ).to.be.revertedWith("Insufficient purchase amount");
    });
  });

  describe("Token Sale", function () {
    it("Should allow users to sell tokens", async function () {
      // First, buy some tokens
      const buyAmount = ethers.utils.parseEther("1");
      await basedAgentToken.connect(addr1).buyTokens({ value: buyAmount });

      const initialBalance = await basedAgentToken.balanceOf(addr1.address);
      
      // Now sell half of the tokens
      await basedAgentToken.connect(addr1).sellTokens(initialBalance.div(2));

      const finalBalance = await basedAgentToken.balanceOf(addr1.address);
      expect(finalBalance).to.be.lt(initialBalance);
    });

    it("Should fail when trying to sell more tokens than owned", async function () {
      const buyAmount = ethers.utils.parseEther("1");
      await basedAgentToken.connect(addr1).buyTokens({ value: buyAmount });

      const balance = await basedAgentToken.balanceOf(addr1.address);

      await expect(
        basedAgentToken.connect(addr1).sellTokens(balance.add(1))
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });

  describe("Bonding Curve", function () {
    it("Should increase token price as more tokens are sold", async function () {
      const buyAmount1 = ethers.utils.parseEther("1");
      const buyAmount2 = ethers.utils.parseEther("1");

      await basedAgentToken.connect(addr1).buyTokens({ value: buyAmount1 });
      const tokensBought1 = await basedAgentToken.balanceOf(addr1.address);

      await basedAgentToken.connect(addr2).buyTokens({ value: buyAmount2 });
      const tokensBought2 = await basedAgentToken.balanceOf(addr2.address);

      expect(tokensBought2).to.be.lt(tokensBought1);
    });
  });

  describe("Referral System", function () {
    it("Should create a referral link", async function () {
      await basedAgentReferral.connect(owner).createReferralLink(addr1.address);
      const isReferrer = await basedAgentReferral.isReferrer(addr1.address);
      expect(isReferrer).to.be.true;
    });

    it("Should use a referral link", async function () {
      await basedAgentReferral.connect(owner).createReferralLink(addr1.address);
      await basedAgentReferral.connect(owner).useReferralLink(addr2.address, addr1.address);

      const referral = await basedAgentReferral.referrals(addr2.address);
      expect(referral.referrer).to.equal(addr1.address);
    });
  });

  describe("Contributor Pool", function () {
    it("Should vest contributor tokens over time", async function () {
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [86400 * 100]); // 100 days
      await ethers.provider.send("evm_mine");

      await basedAgentToken.claimVestedContributorTokens();

      const contributorPoolBalance = await basedAgentToken.balanceOf(contributorPoolWallet.address);
      expect(contributorPoolBalance).to.be.gt(0);
    });
  });

  describe("Metadata", function () {
    it("Should update agent metadata", async function () {
      const newMetadata = {
        name: "Updated Agent",
        description: "An updated AI agent",
        website: "https://updatedagent.com",
        telegram: "@updatedagent",
        twitter: "@updatedagent",
        github: "updatedagent",
        logoIpfsHash: "QmUpdated...",
      };

      await basedAgentToken.connect(owner).updateAgentMetadata(newMetadata);

      const updatedMetadata = await basedAgentToken.agentMetadata();
      expect(updatedMetadata.name).to.equal(newMetadata.name);
      expect(updatedMetadata.description).to.equal(newMetadata.description);
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause the contract", async function () {
      await basedAgentToken.connect(owner).pause();
      expect(await basedAgentToken.paused()).to.be.true;

      await expect(
        basedAgentToken.connect(addr1).buyTokens({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Pausable: paused");

      await basedAgentToken.connect(owner).unpause();
      expect(await basedAgentToken.paused()).to.be.false;

      await expect(
        basedAgentToken.connect(addr1).buyTokens({ value: ethers.utils.parseEther("1") })
      ).to.not.be.reverted;
    });
  });

  describe("Admin Transfer", function () {
    it("Should transfer admin rights to a new address", async function () {
      const newAdmin = addr1.address;
      await aiAgentFactory.connect(owner).transferOwnership(newAdmin);

      expect(await aiAgentFactory.owner()).to.equal(newAdmin);
    });
  });

  describe("AI Agent Factory", function () {
    it("Should create a new AI agent", async function () {
      const newAgentName = "New AI Agent";
      const newAgentSymbol = "NAI";

      const tx = await aiAgentFactory.connect(owner).createAIAgent(
        newAgentName,
        newAgentSymbol,
        aiAgentWallet.address,
        contributorPoolWallet.address,
        BONDING_CURVE_PERCENTAGE,
        CONTRIBUTOR_POOL_PERCENTAGE,
        {
          name: "New Agent",
          description: "A new AI agent",
          website: "https://newagent.com",
          telegram: "@newagent",
          twitter: "@newagent",
          github: "newagent",
          logoIpfsHash: "QmNew...",
        }
      );

      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'AIAgentCreated');
      expect(event).to.not.be.undefined;

      const newAgentAddress = event.args.aiAgentToken;
      const newAgent = await ethers.getContractAt("BasedAgentToken", newAgentAddress);

      expect(await newAgent.name()).to.equal(newAgentName);
      expect(await newAgent.symbol()).to.equal(newAgentSymbol);
    });
  });
});