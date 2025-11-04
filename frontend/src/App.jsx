import { useState } from "react";
import { ethers } from "ethers";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import SellForm from "./Components/SellForm"; // <-- Import SellForm
import MarketplaceListings from "./Components/MarketplaceListings";
function App() {

  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setSigner(signer);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Failed to connect wallet. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-16">
      <Header connectWallet={connectWallet} account={account} />
      <main className="container mx-auto p-8 mt-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-light mb-4">
            The Future of Decentralized Energy
          </h2>
          {!account && (
            <p className="text-slate-400">
              Please connect your wallet to view the dashboard and marketplace.
            </p>
          )}
        </div>

        {/* Conditionally render components */}
        {account && (
          <>
            <Dashboard signer={signer} account={account} />
            <SellForm signer={signer} />
            <MarketplaceListings signer={signer} account={account} />{" "}
            {/* <-- 2. Add Listings */}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
