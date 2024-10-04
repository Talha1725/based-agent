import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BasedAgent } from "../target/types/based_agent";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { assert } from "chai";

describe("based_agent", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BasedAgent as Program<BasedAgent>;

  let aiAgentKeypair: Keypair;
  let tokenMintKeypair: Keypair;
  let adminKeypair: Keypair;
  let buyerKeypair: Keypair;
  let buyerTokenAccount: PublicKey;

  const agentMetadata = {
    name: "Test Agent",
    description: "A test AI agent",
    website: "https://testagent.com",
    telegram: "@testagent",
    twitter: "@testagent",
    github: "testagent",
    logoIpfsHash: "QmTest...",
  };

  before(async () => {
    aiAgentKeypair = Keypair.generate();
    tokenMintKeypair = Keypair.generate();
    adminKeypair = Keypair.generate();
    buyerKeypair = Keypair.generate();

    // Airdrop SOL to admin and buyer
    await provider.connection.requestAirdrop(adminKeypair.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(buyerKeypair.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);

    // Create buyer's token account
    const token = new Token(
      provider.connection,
      tokenMintKeypair.publicKey,
      TOKEN_PROGRAM_ID,
      adminKeypair
    );
    buyerTokenAccount = await token.createAccount(buyerKeypair.publicKey);
  });

  it("Initializes the AI agent", async () => {
    await program.methods
      .initialize(
        "Test Token",
        "TEST",
        80,
        0,
        agentMetadata
      )
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
        tokenMint: tokenMintKeypair.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([aiAgentKeypair, adminKeypair, tokenMintKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert.equal(aiAgentAccount.name, "Test Token");
    assert.equal(aiAgentAccount.symbol, "TEST");
    assert.equal(aiAgentAccount.admin.toBase58(), adminKeypair.publicKey.toBase58());
    assert.equal(aiAgentAccount.tokenMint.toBase58(), tokenMintKeypair.publicKey.toBase58());
    assert.equal(aiAgentAccount.agentMetadata.name, agentMetadata.name);
  });

  it("Buys tokens", async () => {
    const solAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .buyTokens(solAmount)
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        buyer: buyerKeypair.publicKey,
        tokenMint: tokenMintKeypair.publicKey,
        buyerTokenAccount: buyerTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyerKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert(aiAgentAccount.tokensSold.gt(new anchor.BN(0)), "Tokens should have been sold");

    const buyerTokenAccountInfo = await provider.connection.getTokenAccountBalance(buyerTokenAccount);
    assert(Number(buyerTokenAccountInfo.value.amount) > 0, "Buyer should have received tokens");
  });

  it("Sells tokens", async () => {
    const tokenAmount = new anchor.BN(100000000); // Assuming 9 decimal places

    await program.methods
      .sellTokens(tokenAmount)
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        seller: buyerKeypair.publicKey,
        tokenMint: tokenMintKeypair.publicKey,
        sellerTokenAccount: buyerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyerKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert(aiAgentAccount.tokensSold.lt(new anchor.BN(100000000000000000)), "Tokens should have been sold back");

    const buyerTokenAccountInfo = await provider.connection.getTokenAccountBalance(buyerTokenAccount);
    assert(Number(buyerTokenAccountInfo.value.amount) < 100000000000000000, "Buyer should have fewer tokens");
  });

  it("Updates agent metadata", async () => {
    const newMetadata = {
      ...agentMetadata,
      description: "Updated description",
    };

    await program.methods
      .updateAgentMetadata(newMetadata)
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert.equal(aiAgentAccount.agentMetadata.description, "Updated description");
  });

  it("Pauses the contract", async () => {
    await program.methods
      .pause()
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert.isTrue(aiAgentAccount.paused);
  });

  it("Unpauses the contract", async () => {
    await program.methods
      .unpause()
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert.isFalse(aiAgentAccount.paused);
  });

  it("Transfers admin rights to DAO", async () => {
    const newAdminKeypair = Keypair.generate();

    await program.methods
      .transferAdminToDao(newAdminKeypair.publicKey)
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    const aiAgentAccount = await program.account.aiAgent.fetch(aiAgentKeypair.publicKey);
    assert.equal(aiAgentAccount.admin.toBase58(), newAdminKeypair.publicKey.toBase58());
  });

  it("Fails to buy tokens when paused", async () => {
    // First, pause the contract
    await program.methods
      .pause()
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    // Then try to buy tokens
    const solAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    try {
      await program.methods
        .buyTokens(solAmount)
        .accounts({
          aiAgent: aiAgentKeypair.publicKey,
          buyer: buyerKeypair.publicKey,
          tokenMint: tokenMintKeypair.publicKey,
          buyerTokenAccount: buyerTokenAccount,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([buyerKeypair])
        .rpc();

      assert.fail("The transaction should have failed");
    } catch (error) {
      assert.include(error.toString(), "ContractPaused");
    }

    // Unpause the contract for further tests
    await program.methods
      .unpause()
      .accounts({
        aiAgent: aiAgentKeypair.publicKey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();
  });

  // Add more tests as needed for other functionalities
});