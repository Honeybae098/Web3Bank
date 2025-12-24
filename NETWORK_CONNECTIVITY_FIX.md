# Network Connectivity Fix - SmartBank DApp

## 🚨 Current Issue
React app cannot connect to blockchain network on localhost:8545 due to network connectivity errors.

## 🔍 Root Cause Analysis
1. **Blockchain Node**: ✅ Running correctly on port 8545
2. **RPC Endpoints**: ✅ Responding to direct calls
3. **React App**: ❌ Cannot reach blockchain from browser environment
4. **MetaMask**: ❌ Not properly configured for local network

## 🛠️ Step-by-Step Solution

### Step 1: Restart Blockchain Node with CORS Fix

Stop the current blockchain node and restart it with proper CORS configuration:

```bash
# In smart-contract directory
Ctrl+C  # Stop current node
```

### Step 2: Configure Hardhat with CORS Support

Create or update `hardhat.config.js` to allow CORS:

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  mocha: {
    timeout: 40000,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
```

### Step 3: Start Blockchain Node with CORS Headers

Start the blockchain node with proper CORS configuration:

```bash
cd /Users/macbook/smartbank/smart-contract
npm run node
```

### Step 4: Configure MetaMask for Local Network

1. **Add Local Network in MetaMask:**
   - Network Name: `Hardhat Local Network`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account:**
   - Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

3. **Switch to Local Network** in MetaMask dropdown

### Step 5: Verify Frontend Connection

1. Open your React app (http://localhost:3000 or http://localhost:3001)
2. Click "Connect Wallet" 
3. MetaMask should connect without network errors
4. You should see your account with 10,000 ETH balance

## 🔧 Troubleshooting Common Issues

### Issue 1: "Failed to fetch" Errors
**Solution:** Ensure MetaMask is connected to the local network and the RPC URL is exactly `http://127.0.0.1:8545`

### Issue 2: CORS Errors
**Solution:** The blockchain node should allow CORS by default. If issues persist, restart the node.

### Issue 3: MetaMask "Unable to connect"
**Solution:** 
1. Verify blockchain node is running: `curl http://127.0.0.1:8545`
2. Check MetaMask network settings match exactly
3. Try switching networks in MetaMask

### Issue 4: Contract Not Found
**Solution:** Deploy the contract first:
```bash
cd /Users/macbook/smartbank/smart-contract
npm run deploy
```

## 📋 Verification Checklist

- [ ] Blockchain node running on port 8545
- [ ] RPC calls work: `curl http://127.0.0.1:8545`
- [ ] MetaMask configured with local network
- [ ] Test account imported in MetaMask
- [ ] MetaMask switched to local network
- [ ] React app connects to MetaMask without errors
- [ ] Account shows 10,000 ETH balance
- [ ] Contract deployment successful

## 🚀 Expected Result

After completing these steps:
- MetaMask connects to local network successfully
- React app shows no network connectivity errors
- Wallet connection works properly
- Transaction functionality becomes available

## 🆘 If Issues Persist

1. **Check Browser Console** for specific error messages
2. **Verify MetaMask Network** matches exactly: Chain ID 31337, RPC http://127.0.0.1:8545
3. **Restart Everything** in order:
   - Stop blockchain node (Ctrl+C)
   - Stop React app (Ctrl+C)
   - Start blockchain node: `npm run node`
   - Start React app: `npm start`
4. **Clear MetaMask Data** if needed: Settings → Advanced → Clear activity data
