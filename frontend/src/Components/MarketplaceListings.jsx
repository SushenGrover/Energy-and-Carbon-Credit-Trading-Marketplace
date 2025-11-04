import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { marketplaceContract, energyTokenContract } from "../contractConfig"; // We need energyToken for the symbol

const MarketplaceListings = ({ signer, account }) => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buyMessage, setBuyMessage] = useState({}); // To show messages per listing

  // Function to fetch active sales from the contract
  const fetchSales = async () => {
    if (!signer) return;
    setIsLoading(true);
    try {
      const marketContract = new ethers.Contract(
        marketplaceContract.address,
        marketplaceContract.abi,
        signer
      );
      const nextId = await marketContract.nextSaleId();
      const fetchedSales = [];

      for (let i = 0; i < nextId; i++) {
        const saleData = await marketContract.sales(i);
        // Only add active sales and filter for EnergyToken sales (optional, could show CCT too)
        if (
          saleData.active &&
          saleData.tokenContract === energyTokenContract.address
        ) {
          fetchedSales.push({
            id: Number(saleData.id),
            seller: saleData.seller,
            amount: ethers.formatUnits(saleData.amount, 18), // Format amount
            price: ethers.formatUnits(saleData.price, 18), // Format price
          });
        }
      }
      setSales(fetchedSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle buying tokens
  const handleBuy = async (saleId, price) => {
    if (!signer) return;
    setBuyMessage((prev) => ({
      ...prev,
      [saleId]: "Processing transaction...",
    }));
    try {
      const marketContract = new ethers.Contract(
        marketplaceContract.address,
        marketplaceContract.abi,
        signer
      );
      const priceInWei = ethers.parseUnits(price, 18); // Convert price back to WEI

      // Call executeSale, sending the required ETH value
      const tx = await marketContract.executeSale(saleId, {
        value: priceInWei,
      });
      await tx.wait(); // Wait for confirmation

      setBuyMessage((prev) => ({ ...prev, [saleId]: "Purchase successful!" }));
      fetchSales(); // Refresh the sales list after purchase
    } catch (error) {
      console.error("Purchase failed:", error);
      setBuyMessage((prev) => ({
        ...prev,
        [saleId]: `Purchase failed: ${error.reason || error.message}`,
      }));
    }
  };

  useEffect(() => {
    fetchSales();
    // Refresh sales periodically
    const interval = setInterval(fetchSales, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, [signer]); // Rerun if signer changes

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-green-400 mb-6 text-center">
        Energy Token Marketplace
      </h3>
      {isLoading ? (
        <p className="text-center text-slate-400">Loading listings...</p>
      ) : sales.length === 0 ? (
        <p className="text-center text-slate-400">No active sales found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Sale ID: {sale.id}
                </p>
                <p className="text-2xl font-bold text-white mb-1">
                  {parseFloat(sale.amount).toFixed(2)}{" "}
                  <span className="text-green-400 font-mono text-xl">ETKN</span>
                </p>
                <p className="text-lg text-slate-300 mb-3">
                  Price: {parseFloat(sale.price).toFixed(5)}{" "}
                  <span className="text-slate-400 font-mono text-sm">ETH</span>
                </p>
                <p
                  className="text-xs text-slate-500 truncate mb-4"
                  title={sale.seller}
                >
                  Seller: {sale.seller}
                </p>
              </div>
              <div>
                {/* Prevent seller from buying their own listing */}
                {account.toLowerCase() !== sale.seller.toLowerCase() ? (
                  <button
                    onClick={() => handleBuy(sale.id, sale.price)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                  >
                    Buy Now
                  </button>
                ) : (
                  <p className="text-center text-xs text-slate-500">
                    (Your Listing)
                  </p>
                )}
                {buyMessage[sale.id] && (
                  <p className="text-xs text-center text-slate-400 mt-2">
                    {buyMessage[sale.id]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceListings;
