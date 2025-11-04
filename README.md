# ⚡ EnergySim Marketplace

A **Blockchain-Based Peer-to-Peer (P2P) Energy Trading Simulation** built to demonstrate how decentralized systems can enable fair energy exchange, reward green production, and automate trustless transactions using **smart contracts, Python backend simulation, and a React dApp**.

---

## 🧠 Overview

**EnergySim Marketplace** is a decentralized application (dApp) that simulates a renewable energy trading ecosystem where users can **generate, trade, and earn carbon credits**.  
The project implements a **full-stack blockchain system** combining Solidity, Python, and React to create a transparent and autonomous marketplace for renewable energy tokens.

---

## 🚀 Features

- ⚙️ **Smart Contracts:** Secure ERC-20 tokens for Energy (`$ETKN`) and Carbon Credits (`$CCT`)  
- 🔁 **Decentralized Marketplace:** Users can list, buy, and sell tokens via on-chain escrow logic  
- ⚡ **Energy Simulation:** Python backend mimics real-world energy production/consumption  
- 💼 **Wallet Integration:** MetaMask connection for Web3 interactions  
- 📈 **Live Dashboard:** Real-time balance updates for tokens and transactions  
- 🔒 **Trustless Transactions:** All trades are executed transparently via smart contracts  

---

## 🏗️ System Architecture

The project is divided into three core layers:

### 1. **Blockchain Layer (Smart Contracts)**
- Built with **Solidity** on **Hardhat** local network
- Includes:
  - `EnergyToken.sol` — ERC-20 token for energy trading  
  - `CarbonCreditToken.sol` — ERC-20 token rewarding green generation  
  - `Marketplace.sol` — Handles escrow, listing, and trade execution  

### 2. **Backend Layer (Simulation Engine)**
- Developed in **Python (Flask + Web3.py)**
- Components:
  - `simulator.py`: Generates and mints tokens based on simulated energy surplus  
  - `run.py`: Flask-based server for blockchain connectivity and potential API endpoints  

### 3. **Frontend Layer (User Interface)**
- Built using **React (Vite + Tailwind CSS)**  
- Key Components:
  - `App.jsx` — MetaMask wallet connection  
  - `Dashboard.jsx` — Displays real-time token balances  
  - `SellForm.jsx` & `MarketplaceListings.jsx` — Enable users to create and execute P2P trades  

---

## 🧩 Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js, Vite, Ethers.js, Tailwind CSS |
| **Backend** | Python, Flask, Web3.py |
| **Blockchain** | Solidity, Hardhat, OpenZeppelin |
| **Wallet** | MetaMask |

---

## 🔄 End-to-End Flow

1. Start the Hardhat local node  
2. Deploy all contracts and update addresses  
3. Launch Flask server (`run.py`)  
4. Run the energy simulator (`simulator.py`)  
5. Start the React frontend (`npm run dev`)  
6. Connect MetaMask and observe:
   - Tokens being minted in real-time  
   - Users listing and buying tokens on-chain  

---

## 🧱 Smart Contract Snippet (Example)

```solidity
function executeSale(uint256 _saleId) external payable {
    Sale storage sale = sales[_saleId];
    require(sale.active, "Sale inactive");
    require(msg.value == sale.price, "Incorrect ETH");
    
    sale.active = false;
    IERC20(sale.tokenContract).transfer(msg.sender, sale.amount);
    (bool success, ) = sale.seller.call{value: msg.value}("");
    require(success, "ETH transfer failed");
    
    emit SaleCompleted(_saleId, msg.sender);
}
```
---

## 📸 Screenshots & Demo

Below are some screenshots of the **EnergySim Marketplace** in action:

| Description | Screenshot |
|--------------|-------------|
| 🏠 **Homepage / Wallet Connection** | <img src="assets/screenshots/homepage.png" width="600"/> |
| 📊 **Dashboard Showing Token Balances** | <img src="assets/screenshots/dashboard.png" width="600"/> |
| 💰 **Selling Tokens (SellForm)** | <img src="assets/screenshots/sellform.png" width="600"/> |
| 🛒 **Active Marketplace Listings** | <img src="assets/screenshots/marketplace.png" width="600"/> |
| 🔄 **Transaction Confirmation (MetaMask)** | <img src="assets/screenshots/metamask.png" width="600"/> |

---

## 🧪 Results
- ✅ Real-time simulation of renewable energy token minting
- ✅ Fully functional decentralized marketplace with trustless trading
- ✅ Smooth wallet integration and live UI updates

---

## ⚠️ Challenges Faced
1. React (Vite + Tailwind) configuration issues
2. Contract desynchronization after Hardhat redeployment
3. Web3.py version incompatibility with signed transactions

---

## 🔮 Future Enhancements
- 🌐 IoT Integration: Real smart meters instead of simulated data
- 🤖 AI-Powered Dynamic Pricing: Adjust token prices based on demand & supply
- 🪙 Carbon Credit NFTs: Transition from ERC-20 to ERC-721 for traceable credits
- ⛓️ Layer-2 Deployment: Use Polygon/Arbitrum for scalability and lower gas fees

---

## 👨‍💻 Team
|   Name   | Reg. No. | Role |
|----------|----------|------|
|**Sushen Grover**|23BCE1728|Blockchain Developer, Backend Integration|
|**Advit Bhutani**|23BCE1883|Frontend Developer, Smart Contract Interaction|

---

## 🏁 Conclusion

EnergySim Marketplace demonstrates how blockchain can decentralize the energy sector — ensuring fairness, transparency, and sustainability.
It provides a complete, working prototype for tokenized energy trading and green energy rewards — a step toward a decentralized clean energy future.

