import { useState } from "react";
import { ethers } from "ethers";
import { energyTokenContract, marketplaceContract } from "../contractConfig";

const SellForm = ({ signer }) => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [message, setMessage] = useState("");

  const handleApprove = async () => {
    if (!signer || !amount) {
      setMessage("Please connect wallet and enter an amount.");
      return;
    }
    setIsApproving(true);
    setMessage("Approving marketplace to spend your ETKN...");
    try {
      const etknContract = new ethers.Contract(
        energyTokenContract.address,
        energyTokenContract.abi,
        signer
      );
      const amountInWei = ethers.parseUnits(amount, 18); // Convert amount to WEI

      // Call the ERC20 approve function
      const tx = await etknContract.approve(
        marketplaceContract.address,
        amountInWei
      );
      await tx.wait(); // Wait for transaction confirmation

      setMessage("Approval successful! You can now create the sale.");
    } catch (error) {
      console.error("Approval failed:", error);
      setMessage(`Approval failed: ${error.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCreateSale = async () => {
    if (!signer || !amount || !price) {
      setMessage("Please fill in all fields.");
      return;
    }
    setIsCreatingSale(true);
    setMessage("Creating sale on the blockchain...");
    try {
      const marketContract = new ethers.Contract(
        marketplaceContract.address,
        marketplaceContract.abi,
        signer
      );
      const amountInWei = ethers.parseUnits(amount, 18);
      const priceInWei = ethers.parseUnits(price, 18); // Price is also in WEI (smallest unit of ETH)

      // Call the createSale function on the marketplace contract
      const tx = await marketContract.createSale(
        energyTokenContract.address,
        amountInWei,
        priceInWei
      );
      await tx.wait();

      setMessage("Sale created successfully!");
      setAmount("");
      setPrice("");
    } catch (error) {
      console.error("Sale creation failed:", error);
      // Check if it's the allowance error
      if (error.message.includes("Check token allowance")) {
        setMessage(
          "Sale creation failed: Please approve the marketplace first."
        );
      } else {
        setMessage(`Sale creation failed: ${error.message}`);
      }
    } finally {
      setIsCreatingSale(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-xl max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-green-400 mb-4">
        Sell Your Energy Tokens (ETKN)
      </h3>
      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Amount (ETKN)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            min="0"
          />
        </div>
        {/* Price Input */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Total Price (ETH)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 0.1"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            min="0"
            step="any"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleApprove}
            disabled={isApproving || isCreatingSale || !amount}
            className={`flex-1 py-2 px-4 rounded-md text-slate-900 font-semibold transition-colors duration-200 ${
              isApproving || !amount
                ? "bg-slate-500 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {isApproving ? "Approving..." : "1. Approve Marketplace"}
          </button>
          <button
            onClick={handleCreateSale}
            disabled={isApproving || isCreatingSale || !amount || !price}
            className={`flex-1 py-2 px-4 rounded-md text-slate-900 font-semibold transition-colors duration-200 ${
              isCreatingSale || !amount || !price
                ? "bg-slate-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isCreatingSale ? "Creating Sale..." : "2. Create Sale"}
          </button>
        </div>
        {/* Message Area */}
        {message && (
          <p className="text-sm text-center text-slate-400 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SellForm;
