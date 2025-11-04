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
      console.log("Connected network:", await signer.provider.getNetwork());
      console.log("Account:", account);
      console.log("ETKN contract address:", energyTokenContract.address);
      console.log("CCT contract address:", carbonCreditTokenContract.address);
      console.log(
        "ETKN ABI contains balanceOf:",
        energyTokenContract.abi.some((f) => f.name === "balanceOf")
      );

      if (signer && account) {
        setIsLoading(true); // Ensure loading is true at the start
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

          // DEBUG: Log before calling balanceOf
          console.log(`Fetching ETKN balance for ${account}...`);
          const etknBal = await etknContract.balanceOf(account);
          // DEBUG: Log the raw balance received
          console.log("Raw ETKN Balance:", etknBal.toString()); // Use .toString() for BigInt

          // DEBUG: Log before calling balanceOf
          console.log(`Fetching CCT balance for ${account}...`);
          const cctBal = await cctContract.balanceOf(account);
          // DEBUG: Log the raw balance received
          console.log("Raw CCT Balance:", cctBal.toString()); // Use .toString() for BigInt

          // Format the raw balance (which has 18 decimals) into a readable string
          const formattedEtkn = ethers.formatUnits(etknBal, 18);
          const formattedCct = ethers.formatUnits(cctBal, 18);

          // DEBUG: Log the formatted balances
          console.log("Formatted ETKN:", formattedEtkn);
          console.log("Formatted CCT:", formattedCct);

          setEtknBalance(formattedEtkn);
          setCctBalance(formattedCct);
        } catch (error) {
          console.error("Error fetching balances:", error);
          // DEBUG: Log the specific error
          console.log("Error details:", error.message, error.code, error.data);
        } finally {
          setIsLoading(false);
          console.log("Finished fetching balances."); // DEBUG: Confirm fetch cycle ends
        }
      } else {
        // DEBUG: Log if signer or account is missing
        console.log("fetchBalances skipped: Signer or Account missing.");
      }
    };

    fetchBalances(); // Initial fetch

    // Set up an interval to refetch balances every 10 seconds
    const interval = setInterval(fetchBalances, 10000);

    // Clear the interval when the component is unmounted
    return () => {
      console.log("Clearing balance fetch interval."); // DEBUG: Log interval clear
      clearInterval(interval);
    };
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
