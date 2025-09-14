import os
import json
import time
import random
from dotenv import load_dotenv
from web3 import Web3

# --- 1. SETUP & CONNECTION (Same as run.py) ---
load_dotenv()

RPC_URL = os.getenv('RPC_URL')
w3 = Web3(Web3.HTTPProvider(RPC_URL))
print("Simulator connecting to blockchain...")

if not w3.is_connected():
    print("Failed to connect!")
    exit()

print("Simulator connected.")

OWNER_PRIVATE_KEY = os.getenv('OWNER_PRIVATE_KEY')
OWNER_ACCOUNT = w3.eth.account.from_key(OWNER_PRIVATE_KEY)

# --- 2. LOAD CONTRACTS (Same as run.py) ---
def load_contract_abi(filename):
    with open(f'contracts/{filename}') as f:
        return json.load(f)['abi']

energy_token_abi = load_contract_abi('EnergyToken.json')
carbon_credit_token_abi = load_contract_abi('CarbonCreditToken.json')

ENERGY_TOKEN_ADDRESS = os.getenv('ENERGY_TOKEN_ADDRESS')
CARBON_CREDIT_TOKEN_ADDRESS = os.getenv('CARBON_CREDIT_TOKEN_ADDRESS')

energy_token_contract = w3.eth.contract(address=ENERGY_TOKEN_ADDRESS, abi=energy_token_abi)
carbon_credit_token_contract = w3.eth.contract(address=CARBON_CREDIT_TOKEN_ADDRESS, abi=carbon_credit_token_abi)

# --- 3. SIMULATION LOGIC ---

# Let's pretend these are our prosumers.
# Use addresses from your `npx hardhat node` output (e.g., Account #1, Account #2)
raw_addresses = [
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
]
# Convert all addresses to the required checksum format
PROSUMER_ADDRESSES = [Web3.to_checksum_address(addr) for addr in raw_addresses]

def mint_tokens(prosumer_address, amount, contract):
    """Builds, signs, and sends a transaction to call the mint function."""
    try:
        symbol = contract.functions.symbol().call()
        print(f"Minting {amount / (10**18)} {symbol} for {prosumer_address[:10]}...")

        # Build the transaction
        tx = contract.functions.mint(prosumer_address, amount).build_transaction({
            'from': OWNER_ACCOUNT.address,
            'nonce': w3.eth.get_transaction_count(OWNER_ACCOUNT.address),
            'gas': 300000,  # set a reasonable gas limit
            'gasPrice': w3.eth.gas_price
        })

        # Sign the transaction
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=OWNER_PRIVATE_KEY)

        # ✅ Web3.py v6 returns a dict with raw_transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Wait for the transaction to be mined
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"  -> Minting successful! Tx: {receipt.transactionHash.hex()}")

    except Exception as e:
        print(f"  -> An error occurred during minting: {e}")


# Main simulation loop
while True:
    print("\n--- Running simulation cycle ---")
    for prosumer in PROSUMER_ADDRESSES:
        energy_generated = random.randint(5, 20)  # in kWh
        energy_consumed = random.randint(2, 10)   # in kWh
        
        print(f"Prosumer {prosumer[:10]}... | Generated: {energy_generated} kWh | Consumed: {energy_consumed} kWh")

        if energy_generated > energy_consumed:
            excess_energy = energy_generated - energy_consumed
            # We need to handle token decimals. Let's assume 1 kWh = 1 token (with 18 decimals)
            amount_to_mint = excess_energy * (10**18)
            
            print(f"  -> Excess energy: {excess_energy} kWh. Minting tokens...")
            
            # Mint both Energy Tokens and Carbon Credit Tokens
            mint_tokens(prosumer, amount_to_mint, energy_token_contract)
            mint_tokens(prosumer, amount_to_mint, carbon_credit_token_contract) # 1-to-1 credit for simplicity

    time.sleep(30) # Wait 30 seconds before the next cycle