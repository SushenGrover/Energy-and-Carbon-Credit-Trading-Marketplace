// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Marketplace
 * @dev A contract for P2P trading of EnergyToken and CarbonCreditToken.
 */
contract Marketplace is Ownable {
    // Addresses of the token contracts this marketplace will trade
    IERC20 public immutable energyToken;
    IERC20 public immutable carbonCreditToken;

    // A struct to hold all the details of a sale
    struct Sale {
        uint256 id;
        address seller;
        address tokenContract; // Address of the token being sold
        uint256 amount;
        uint256 price; // Price in WEI (the smallest unit of Ether)
        bool active;
    }

    // A mapping to store all sales by their ID
    mapping(uint256 => Sale) public sales;

    // A counter to ensure each sale has a unique ID
    uint256 public nextSaleId;

    // Events to notify the frontend when actions happen
    event SaleCreated(uint256 id, address seller, address tokenContract, uint256 amount, uint256 price);
    event SaleCompleted(uint256 id, address buyer);
    event SaleCancelled(uint256 id);

    /**
     * @dev Sets the addresses of the token contracts when the marketplace is deployed.
     */
    constructor(address _energyTokenAddress, address _carbonCreditTokenAddress, address initialOwner) Ownable(initialOwner) {
        energyToken = IERC20(_energyTokenAddress);
        carbonCreditToken = IERC20(_carbonCreditTokenAddress);
    }

    /**
     * @dev Creates a new sale listing.
     * @param _tokenContract The address of the token being sold.
     * @param _amount The amount of tokens to sell.
     * @param _price The price for the total amount, in WEI.
     */
    function createSale(address _tokenContract, uint256 _amount, uint256 _price) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(_price > 0, "Price must be greater than zero");
        require(
            _tokenContract == address(energyToken) || _tokenContract == address(carbonCreditToken),
            "Invalid token contract"
        );

        // The seller must first approve this marketplace contract to spend their tokens.
        // Then, we pull the tokens from the seller's wallet into this contract for escrow.
        uint256 allowance = IERC20(_tokenContract).allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check token allowance");
        IERC20(_tokenContract).transferFrom(msg.sender, address(this), _amount);

        // Create and save the new sale
        sales[nextSaleId] = Sale(nextSaleId, msg.sender, _tokenContract, _amount, _price, true);
        
        emit SaleCreated(nextSaleId, msg.sender, _tokenContract, _amount, _price);
        nextSaleId++;
    }

    /**
     * @dev Executes a sale, transferring tokens to the buyer and payment to the seller.
     * @param _saleId The ID of the sale to execute.
     */
    function executeSale(uint256 _saleId) external payable {
        Sale storage sale = sales[_saleId];
        
        require(sale.active, "Sale is not active");
        require(msg.sender != sale.seller, "Seller cannot buy their own sale");
        require(msg.value == sale.price, "Incorrect Ether value sent");

        // Mark the sale as inactive
        sale.active = false;

        // Transfer the tokens from this contract to the buyer
        IERC20(sale.tokenContract).transfer(msg.sender, sale.amount);
        
        // Transfer the Ether payment from this contract to the seller
        (bool success, ) = sale.seller.call{value: msg.value}("");
        require(success, "Failed to send Ether to seller");

        emit SaleCompleted(_saleId, msg.sender);
    }

    /**
     * @dev Allows a seller to cancel their sale listing.
     * @param _saleId The ID of the sale to cancel.
     */
    function cancelSale(uint256 _saleId) external {
        Sale storage sale = sales[_saleId];

        require(sale.active, "Sale is not active");
        require(msg.sender == sale.seller, "Only the seller can cancel");

        // Mark the sale as inactive
        sale.active = false;

        // Return the escrowed tokens back to the seller
        IERC20(sale.tokenContract).transfer(sale.seller, sale.amount);

        emit SaleCancelled(_saleId);
    }
}