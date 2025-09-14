import { useState } from "react";
import { ethers } from "ethers";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard"; // 1. Import the new component

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
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header connectWallet={connectWallet} account={account} />
      <main className="container mx-auto p-8 mt-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-light mb-4">
            The Future of Decentralized Energy
          </h2>
          {!account && ( // Show this text only if wallet is NOT connected
            <p className="text-slate-400">
              Please connect your wallet to view the dashboard.
            </p>
          )}
        </div>

        {/* 2. Conditionally render the Dashboard component */}
        {account && <Dashboard signer={signer} account={account} />}
      </main>
    </div>
  );
}

export default App;
