// 1. Import ABIs from the JSON files you copied into the backend
import EnergyTokenABI from "../../backend/contracts/EnergyToken.json";
import CarbonCreditTokenABI from "../../backend/contracts/CarbonCreditToken.json";

// 2. Add your deployed contract addresses here
const ENERGY_TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const CARBON_CREDIT_TOKEN_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// We'll add the marketplace later

// 3. Export the configuration
export const energyTokenContract = {
  address: ENERGY_TOKEN_ADDRESS,
  abi: EnergyTokenABI.abi,
};

export const carbonCreditTokenContract = {
  address: CARBON_CREDIT_TOKEN_ADDRESS,
  abi: CarbonCreditTokenABI.abi,
};
