// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnergyToken
 * @dev An ERC20 token representing energy units (e.g., kWh).
 * The contract owner (our backend) can mint new tokens.
 */
contract EnergyToken is ERC20, Ownable {
    /**
     * @dev Sets the token's name, symbol, and initial owner.
     */
    constructor(address initialOwner) ERC20("Energy Token", "ETKN") Ownable(initialOwner) {}

    /**
     * @dev Creates `amount` new tokens for the `to` address.
     * Can only be called by the contract owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}