import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("DeployModule", (m) => {
  // Get the deployer address (the account that is deploying the contracts)
  const initialOwner = m.getAccount(0);

  // Deploy the EnergyToken contract, passing the deployer's address to its constructor
  const energyToken = m.contract("EnergyToken", [initialOwner]);

  // Deploy the CarbonCreditToken contract, also passing the deployer's address
  const carbonCreditToken = m.contract("CarbonCreditToken", [initialOwner]);

  // Deploy the Marketplace contract.
  // Its constructor needs the addresses of the two token contracts and the initial owner.
  const marketplace = m.contract("Marketplace", [
    energyToken,
    carbonCreditToken,
    initialOwner,
  ]);

  // Return the deployed contracts so we can easily access them later
  return { energyToken, carbonCreditToken, marketplace };
});

export default DeployModule;