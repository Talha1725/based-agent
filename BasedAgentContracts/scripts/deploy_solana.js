const anchor = require("@project-serum/anchor");
const { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } = anchor.web3;
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
require("dotenv").config();

async function main() {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Read the generated IDL.
  const idl = JSON.parse(require("fs").readFileSync("./target/idl/based_agent.json", "utf8"));

  // Address of the deployed program.
  const programId = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId);

  // Generate a new keypair for the AI Agent account
  const aiAgentKeypair = Keypair.generate();

  // Generate a new keypair for the token mint
  const mintKeypair = Keypair.generate();

  console.log("Deploying BasedAgent with the following accounts:");
  console.log("  AI Agent account:", aiAgentKeypair.publicKey.toString());
  console.log("  Token mint:", mintKeypair.publicKey.toString());

  try {
    // Initialize the AI Agent
    const tx = await program.rpc.initialize(
      "BasedAgent Token",
      "BAT",
      80, // bondingCurvePercentage
      0, // contributorPoolPercentage
      {
        name: "BasedAgent",
        description: "AI Agent on Solana",
        website: "https://basedagent.com",
        telegram: "@basedagent",
        twitter: "@basedagent",
        github: "basedagent",
        logoIpfsHash: "QmExample...",
      },
      {
        accounts: {
          aiAgent: aiAgentKeypair.publicKey,
          admin: provider.wallet.publicKey,
          tokenMint: mintKeypair.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [aiAgentKeypair, mintKeypair],
      }
    );

    console.log("Your transaction signature", tx);
    console.log("AI Agent initialized successfully!");

    // Initialize the Referral System
    const referralSystemKeypair = Keypair.generate();
    const referralTx = await program.rpc.initializeReferralSystem({
      accounts: {
        referralSystem: referralSystemKeypair.publicKey,
        admin: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [referralSystemKeypair],
    });

    console.log("Referral system initialized with signature:", referralTx);
    console.log("Referral system account:", referralSystemKeypair.publicKey.toString());

    // Note: Factory functionality is typically handled differently in Solana
    // You might want to add additional initialization or setup here if needed

    console.log("Deployment completed successfully!");

  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);