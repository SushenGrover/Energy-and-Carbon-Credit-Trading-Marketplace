import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  energyTokenContract,
  carbonCreditTokenContract,
} from "../contractConfig";

const Dashboard = ({ signer, account }) => {
  const [etknBalance, setEtknBalance] = useState("0");
  const [cctBalance, setCctBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (signer && account) {
        try {
          // Create ethers contract instances
          const etknContract = new ethers.Contract(
            energyTokenContract.address,
            energyTokenContract.abi,
            signer
          );
          const cctContract = new ethers.Contract(
            carbonCreditTokenContract.address,
            carbonCreditTokenContract.abi,
            signer
          );

          // Fetch balances for the connected account
          const etknBal = await etknContract.balanceOf(account);
          const cctBal = await cctContract.balanceOf(account);

          // Format the raw balance (which has 18 decimals) into a readable string
          setEtknBalance(ethers.formatUnits(etknBal, 18));
          setCctBalance(ethers.formatUnits(cctBal, 18));
        } catch (error) {
          console.error("Error fetching balances:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBalances();

    // Set up an interval to refetch balances every 10 seconds
    const interval = setInterval(fetchBalances, 10000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [signer, account]); // This effect re-runs if the signer or account changes

  return (
    <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-green-400 mb-6">
        Your Asset Dashboard
      </h3>
      {isLoading ? (
        <p className="text-slate-400">Loading balances...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {/* Energy Token Card */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Energy Tokens</p>
            <p className="text-4xl font-mono font-bold text-white">
              {parseFloat(etknBalance).toFixed(4)}
            </p>
            <p className="text-green-500 font-mono mt-1">ETKN</p>
          </div>
          {/* Carbon Credit Card */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Carbon Credits</p>
            <p className="text-4xl font-mono font-bold text-white">
              {parseFloat(cctBalance).toFixed(4)}
            </p>
            <p className="text-green-500 font-mono mt-1">CCT</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
