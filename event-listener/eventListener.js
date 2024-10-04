import { JsonRpcProvider, Contract } from 'ethers';
import 'dotenv/config'; // Automatically loads environment variables
import express from 'express'; // Import express

// Initialize Express app
const app = express();
app.use(express.json()); // Enable JSON parsing for incoming requests

// Use Sepolia testnet RPC URL from .env
const provider = new JsonRpcProvider(process.env.RPC_URL);

// Smart contract details
const agentFactoryAddress = process.env.CONTRACT_ADDRESS;
const agentFactoryABI = [
  "event AgentCreated(address indexed agentTokenAddress, address indexed admin)"
];

// Create contract instance using ethers.js v6 syntax
const agentFactoryContract = new Contract(agentFactoryAddress, agentFactoryABI, provider);

// Set up event listener for 'AgentCreated'
agentFactoryContract.on('AgentCreated', (agentTokenAddress, admin) => {
  console.log('New Agent Created!');
  console.log('Agent Token Address:', agentTokenAddress);
  console.log('Admin Address:', admin);
});

// Define a webhook endpoint for Moralis events
app.post('/api/listener/webhook', async (req, res) => {
  // Handle events from Moralis if using Moralis Streams
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
