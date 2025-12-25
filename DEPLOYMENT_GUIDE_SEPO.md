# Sepolia Testnet Deployment Guide

## 🚀 Quick Setup for SmartBank Deployment

### Step 1: Environment Setup

1. **Navigate to smart-contract directory:**
   ```bash
   cd smart-contract
   ```

2. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

3. **Get Required Services:**

   **Infura (RPC Provider):**
   - Go to https://infura.io
   - Create free account
   - Create new project (Ethereum)
   - Copy the project ID from project settings
   - Replace `YOUR_INFURA_PROJECT_ID` in `.env`

   **MetaMask Private Key:**
   - Open MetaMask extension
   - Go to Account Details
   - Click "Export Private Key"
   - Copy the key (starts with 0x...)
   - Replace `your_private_key_here` in `.env`

   **Etherscan API Key (Optional):**
   - Go to https://etherscan.io/apis
   - Create free account
   - Generate API key
   - Replace `your_etherscan_api_key_here` in `.env`

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Compile Contract
```bash
npx hardhat compile
```

### Step 4: Deploy to Sepolia
```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### Step 5: Verify on Etherscan (Optional)
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 🔧 Troubleshooting

### Common Issues:

**"insufficient funds" error:**
- Make sure your wallet has Sepolia ETH (free from faucets)
- Get test ETH from: https://sepoliafaucet.com

**"RPC provider not available" error:**
- Check your Infura project ID is correct
- Ensure project is set to Ethereum mainnet

**"private key invalid" error:**
- Make sure private key doesn't have 0x prefix in .env
- Export key directly from MetaMask

---

## 💰 Getting Sepolia Test ETH

1. **Infura Faucet:**
   - Go to https://www.infura.io/faucet/sepolia
   - Connect MetaMask wallet
   - Request test ETH

2. **Alchemy Faucet:**
   - Go to https://www.alchemy.com/faucets/ethereum-sepolia
   - Connect MetaMask wallet
   - Request test ETH

---

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Contract compiles successfully
- [ ] Wallet has Sepolia ETH
- [ ] Deployment script runs without errors
- [ ] Contract address saved for Front-End
- [ ] Contract tested on Sepolia

---

## 🎯 After Deployment

1. **Update Front-End Config:**
   - Copy contract address from deployment
   - Update `CONTRACT_ADDRESSES.sepolia` in `Front-End/src/config/SmartBankConfig.js`

2. **Test Web3 Integration:**
   - Start Front-End: `cd Front-End && npm start`
   - Connect MetaMask to Sepolia
   - Test deposit/withdraw functionality

3. **Verify Contract:**
   - Go to https://sepolia.etherscan.io/address/[CONTRACT_ADDRESS]
   - Confirm contract is verified and source code matches

---

## 📞 Support

If you encounter issues:
1. Check console output for specific error messages
2. Verify environment variables are set correctly
3. Ensure MetaMask is connected to Sepolia network
4. Check wallet has sufficient test ETH
