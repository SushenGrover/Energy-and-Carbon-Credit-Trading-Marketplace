// src/Components/Header.jsx
import React from "react";
const Header = ({ connectWallet, account }) => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md p-4 border-b border-green-500/20 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Title with Green Gradient */}
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
          EnergySim Marketplace
        </h1>

        {/* Wallet Button */}
        {account ? (
          <div className="bg-slate-800 text-green-300 font-mono text-sm px-4 py-2 rounded-full border border-slate-700">
            {`${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300"
          >
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
