#run.py
import os
import json
from dotenv import load_dotenv
from web3 import Web3

# Load environment variables from .env file
load_dotenv()

# --- 1. SETUP CONNECTION TO BLOCKCHAIN ---
RPC_URL = os.getenv('RPC_URL')
w3 = Web3(Web3.HTTPProvider(RPC_URL))

if w3.is_connected():
    print("Successfully connected to the blockchain.")
else:
    print("Failed to connect to the blockchain.")
    exit()

# --- 2. LOAD CONTRACT ABIs ---
def load_contract_abi(filename):
    with open(f'contracts/{filename}') as f:
        return json.load(f)['abi']

energy_token_abi = load_contract_abi('EnergyToken.json')
carbon_credit_token_abi = load_contract_abi('CarbonCreditToken.json')
marketplace_abi = load_contract_abi('Marketplace.json')

# --- 3. CREATE CONTRACT INSTANCES ---
ENERGY_TOKEN_ADDRESS = os.getenv('ENERGY_TOKEN_ADDRESS')
CARBON_CREDIT_TOKEN_ADDRESS = os.getenv('CARBON_CREDIT_TOKEN_ADDRESS')
MARKETPLACE_ADDRESS = os.getenv('MARKETPLACE_ADDRESS')

energy_token_contract = w3.eth.contract(address=ENERGY_TOKEN_ADDRESS, abi=energy_token_abi)
carbon_credit_token_contract = w3.eth.contract(address=CARBON_CREDIT_TOKEN_ADDRESS, abi=carbon_credit_token_abi)
marketplace_contract = w3.eth.contract(address=MARKETPLACE_ADDRESS, abi=marketplace_abi)

print("Contract instances created successfully.")

# --- 4. FLASK SERVER (for later) ---
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    # You can now access contract data here, for example:
    token_name = energy_token_contract.functions.name().call()
    return f"Backend server is running! Energy Token name: {token_name}"

if __name__ == '__main__':
    app.run(debug=True, port=5001)