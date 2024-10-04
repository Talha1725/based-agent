import { ethers } from 'ethers';
import BasedAgentTokenABI from './abis/BasedAgentToken.json';
import AIAgentFactoryABI from './abis/AIAgentFactory.json';

const BASED_AGENT_TOKEN_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const AI_AGENT_FACTORY_ADDRESS = 'YOUR_FACTORY_ADDRESS';

export const getWeb3Provider = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('No Ethereum browser extension detected');
};

export const getBasedAgentTokenContract = async (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(BASED_AGENT_TOKEN_ADDRESS, BasedAgentTokenABI, signer);
};

export const getAIAgentFactoryContract = async (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(AI_AGENT_FACTORY_ADDRESS, AIAgentFactoryABI, signer);
};

export const fetchTokenInfo = async (contract) => {
  const [name, symbol, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.TOTAL_SUPPLY(),
  ]);
  return { name, symbol, totalSupply: totalSupply.toString() };
};

export const fetchBondingCurveState = async (contract) => {
  const [tokensOnCurve, vEth, vToken, ethRaised, tokensSold, curveCompleted] = await Promise.all([
    contract.tokensOnCurve(),
    contract.vEth(),
    contract.vToken(),
    contract.ethRaised(),
    contract.tokensSold(),
    contract.curveCompleted(),
  ]);
  return {
    tokensAvailableForSale: tokensOnCurve.toString(),
    virtualEthReserve: vEth.toString(),
    virtualTokenReserve: vToken.toString(),
    totalEthRaised: ethRaised.toString(),
    tokensSold: tokensSold.toString(),
    bondingCurveCompleted: curveCompleted,
  };
};

export const buyTokens = async (contract, amount) => {
  const tx = await contract.buyTokens({ value: ethers.utils.parseEther(amount) });
  return tx.wait();
};

export const sellTokens = async (contract, amount) => {
  const tx = await contract.sellTokens(ethers.utils.parseEther(amount));
  return tx.wait();
};

// Add more functions for other contract interactions as needed