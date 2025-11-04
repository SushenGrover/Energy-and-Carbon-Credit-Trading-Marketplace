// 1. Import ABIs
import EnergyTokenABI from "../../backend/contracts/EnergyToken.json";
import CarbonCreditTokenABI from "../../backend/contracts/CarbonCreditToken.json";
import MarketplaceABI from "../../backend/contracts/Marketplace.json"; // <-- ADD THIS

// 2. Add your deployed contract addresses here
const ENERGY_TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const CARBON_CREDIT_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MARKETPLACE_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // <-- ADD THIS

// 3. Export the configuration
export const energyTokenContract = {
  address: ENERGY_TOKEN_ADDRESS,
  abi: EnergyTokenABI.abi,
};

export const carbonCreditTokenContract = {
  address: CARBON_CREDIT_TOKEN_ADDRESS,
  abi: CarbonCreditTokenABI.abi,
};

export const marketplaceContract = {
  // <-- ADD THIS
  address: MARKETPLACE_ADDRESS,
  abi: MarketplaceABI.abi,
};
