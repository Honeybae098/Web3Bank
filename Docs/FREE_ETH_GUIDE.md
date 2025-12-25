# 🚀 Complete Guide: Get Free ETH for Local Development

## Overview
Your Hardhat setup automatically provides **unlimited free ETH** for local blockchain testing. Here's exactly how to access it.

## 🎯 What You'll Get
- **20 Test Accounts** with 10,000 ETH each
- **Private Keys** for MetaMask import
- **Completely Free** - no real money involved
- **Reset Anytime** - restart blockchain for fresh accounts

## 📋 Step-by-Step Instructions

### Step 1: Start Local Blockchain
```bash
cd smart-contract
npm run node
# OR
npx hardhat node
```

**Expected Output:**
```
Hardhat Network
=================

Accounts
========
Account #0: 0xabc123... (10000 ETH) ⭐
Account #1: 0xdef456... (10000 ETH)
Account #2: 0xghi789... (10000 ETH)
... (and 17 more accounts)

Private Keys
============
0xabc123... ← Use this for MetaMask
0xdef456... ← Use this for testing
0xghi789...
... (and 17 more private keys)
```

### Step 2: Import Test Account to MetaMask

#### Copy a Private Key
From the Hardhat node output, **copy any private key** (starts with `0x...`)

#### Import to MetaMask:
1. **Open MetaMask** extension
2. **Click account avatar** (top-right circle)
3. **Select "Import Account"**
4. **Paste the private key**
5. **Click "Import"**
6. **Name it**: "SmartBank Test Account"

### Step 3: Connect to Local Network

#### Add Localhost Network:
1. **In MetaMask**: Click network dropdown
2. **Select "Add Network"** → "Add Network Manually"
3. **Fill in**:
   - **Network Name**: `Localhost 8545`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer**: Leave blank
4. **Click "Save"**

### Step 4: Verify Free ETH

After connecting:
- ✅ **Switch to Localhost 8545** network
- ✅ **Select imported account**
- ✅ **Should show ~10,000 ETH balance**

## 🎮 Testing Your SmartBank

### Deploy Contract
```bash
# In new terminal
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost
```

### Update Frontend Configuration
After deployment, copy the contract address and update:
```javascript
// Front-End/src/config/SmartBankConfig.js
const SMARTBANK_CONFIG = {
  localhost: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'
};
```

### Test Features
1. **Connect Wallet** at http://localhost:3000
2. **Deposit ETH** (minimum 0.001 ETH)
3. **Check Balance** with interest calculation
4. **Withdraw Funds** to test functionality
5. **View History** of transactions

## 🔄 Getting More Free ETH

### Option 1: Use Different Account
- Import another private key from Hardhat node output
- Each account has 10,000 ETH

### Option 2: Reset Blockchain
```bash
# Stop current blockchain (Ctrl+C)
# Restart to get fresh accounts
npx hardhat node
```

### Option 3: Transfer Between Accounts
```bash
# In new terminal
npx hardhat console --network localhost

# Transfer ETH from account 0 to account 1
const [account0, account1] = await ethers.getSigners();
await account0.sendTransaction({
  to: await account1.getAddress(),
  value: ethers.parseEther("1000")
});
```

## 🛠️ Advanced Usage

### Programmatic Access
```javascript
// Get accounts in your scripts
const accounts = await ethers.getSigners();
const firstAccount = accounts[0];

// Send transaction
await firstAccount.sendTransaction({
  to: "0xRecipientAddress",
  value: ethers.parseEther("10")
});
```

### Multiple Terminal Setup
```bash
# Terminal 1: Keep blockchain running
cd smart-contract
npx hardhat node

# Terminal 2: Deploy contracts
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Run tests
cd smart-contract
npx hardhat test

# Terminal 4: Start frontend
cd Front-End
npm start
```

## 🎯 Your SmartBank Features to Test

### Interest Calculation
- **5% Annual Interest** on deposits
- **Automatic calculation** on contract interaction
- **Performance fee** of 10% to bank

### Functions to Test
- `deposit()` - Add funds to earn interest
- `withdraw(amount)` - Withdraw specified amount
- `getBalance(user)` - Check virtual balance with interest
- `getHistory(user)` - View transaction history
- `getBankStatistics()` - View total liquidity

## ⚠️ Important Notes

### Security
- **Never use real ETH** on localhost
- **Keep private keys secure** (only for testing)
- **Reset blockchain** regularly for clean state

### Best Practices
- **Use different accounts** for different test scenarios
- **Document contract addresses** for each deployment
- **Test thoroughly** before mainnet deployment

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Hardhat node shows 20 funded accounts
- ✅ MetaMask imports account with ~10,000 ETH
- ✅ Localhost network connects successfully
- ✅ SmartBank contract responds to transactions
- ✅ Interest calculations display correctly

## 🚨 Troubleshooting

### "Account not found"
- Restart Hardhat node
- Import fresh private key

### "Network not working"
- Check if blockchain is running on port 8545
- Verify RPC URL: http://127.0.0.1:8545

### "Insufficient funds"
- Use different test account
- Transfer ETH between accounts
- Restart blockchain for fresh accounts

---

**🎯 You're now ready to test SmartBank with unlimited free ETH!**
