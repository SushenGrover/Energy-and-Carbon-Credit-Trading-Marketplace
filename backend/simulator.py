#simulator.py
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
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
    "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
    "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
    "0xbcd4042de499d14e55001ccbb24a551f3b954096",
    "0x71be63f3384f5fb98995898a86b02fb2426c5788",
    "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
    "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec",
    "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097",
    "0xcd3b766ccdd6ae721141f452c550ca635964ce71",
    "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
    "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
    "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
    "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
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

    time.sleep(5) # Wait 5 seconds before the next cycle