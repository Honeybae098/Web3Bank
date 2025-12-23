# 🚀 SmartBank Local Development Setup - Free Testing with MetaMask

## Overview
Set up a complete local blockchain environment for testing SmartBank with **free ETH** using MetaMask and Hardhat.

## 🎯 What You'll Get
- **Local Blockchain**: Free ETH for testing (no real money)
- **MetaMask Integration**: Connect your wallet to localhost
- **Smart Contract Deployment**: Deploy and interact with SmartBank
- **Real Transactions**: Test deposits, withdrawals, and interest calculations

## 📋 Prerequisites Checklist

### ✅ Required Software
- [ ] **Node.js** (v16 or higher) - Already installed
- [ ] **MetaMask** browser extension - Install from Chrome/Firefox store
- [ ] **VSCode** - Already running
- [ ] **Terminal** - Already available

### ✅ Project Status
- [ ] **SmartBank Contract** - ✅ Ready (5% interest rate)
- [ ] **Frontend App** - ✅ Running on http://localhost:3000
- [ ] **Hardhat Setup** - ✅ Configured for localhost
- [ ] **Dependencies** - ✅ Installing...

## 🔧 Step-by-Step Setup

### Step 1: Complete Smart Contract Dependencies
Wait for the current npm install to complete, then:
```bash
cd smart-contract
npm run node  # Start local blockchain
```

### Step 2: Deploy Smart Contract
In a new terminal window:
```bash
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost
```

### Step 3: Configure MetaMask for Local Network

#### Add Localhost Network to MetaMask:
1. **Open MetaMask** → Click network dropdown → "Add Network"
2. **Manual Network**:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
   - **Block Explorer**: Leave blank

#### Import Test Account:
1. **Go to MetaMask** → Click account avatar → "Import Account"
2. **Private Key**: Use one from Hardhat output (starts with 0x...)
3. **Name it**: "SmartBank Test Account"

### Step 4: Update Frontend Configuration

#### Update Contract Address:
After deployment, copy the contract address and update:
```javascript
// In Front-End/src/contexts/Web3Context.jsx
const CONTRACT_ADDRESSES = {
  localhost: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // Replace this!
  sepolia: 'YOUR_SEPOLIA_CONTRACT_ADDRESS_HERE'
};
```

### Step 5: Test the Application

#### Start Everything:
```bash
# Terminal 1: Local Blockchain
cd smart-contract
npm run node

# Terminal 2: Deploy Contract (after blockchain starts)
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Frontend (already running)
cd Front-End
npm start
```

#### Connect MetaMask:
1. **Visit**: http://localhost:3000
2. **Click**: "Connect Wallet" in the navbar
3. **Select**: "Localhost 8545" network
4. **Approve**: Connection in MetaMask
5. **Test**: Deposit 0.1 ETH and see interest grow!

## 🎮 Testing Scenarios

### Basic Functionality Test:
1. **Connect Wallet** → Verify connection to localhost
2. **Check Balance** → Should show 0 ETH initially
3. **Make Deposit** → Test minimum 0.001 ETH deposit
4. **View Interest** → Check if 5% annual interest is applied
5. **Withdraw Funds** → Test withdrawal functionality
6. **View History** → Check transaction history

### Advanced Testing:
- **Multiple Accounts**: Import different test accounts
- **Interest Calculation**: Wait and see interest accumulate
- **Large Deposits**: Test with significant amounts
- **Admin Functions**: Test fee withdrawal (if you're the owner)

## 🔍 Contract Features to Test

### SmartBank Contract Capabilities:
- ✅ **5% Annual Interest** on deposited ETH
- ✅ **Automatic Interest Calculation** on deposits/withdrawals
- ✅ **Performance Fees** (10% to bank)
- ✅ **Transaction History** for each user
- ✅ **Security Features** (ReentrancyGuard)
- ✅ **Admin Functions** for fee management

### Functions to Test:
- `deposit()` - Payable function to add funds
- `withdraw(amount)` - Withdraw specified amount
- `getBalance(user)` - Check virtual balance (with interest)
- `getHistory(user)` - View transaction history
- `getBankStatistics()` - View total liquidity and bank profit

## 💡 Tips for Local Development

### Free ETH Management:
- **Get Free ETH**: Hardhat automatically funds test accounts
- **Multiple Accounts**: Import different private keys for testing
- **Reset Blockchain**: Restart `npm run node` to reset everything

### Debugging:
- **Contract Events**: Check console for transaction details
- **Interest Calculation**: Interest only applies when interacting with contract
- **Balance Display**: Shows virtual balance (deposited + earned interest)

### MetaMask Tips:
- **Network Switching**: Easily switch between localhost and mainnet
- **Transaction History**: View all local transactions in MetaMask
- **Account Management**: Import/export accounts as needed

## 🚨 Important Notes

### Security:
- **Test Only**: Never use real ETH on localhost
- **Private Keys**: Keep test account private keys secure
- **Contract Audit**: Required before mainnet deployment

### Development:
- **Reset Frequently**: Restart blockchain for clean testing
- **Update Addresses**: Update contract address after redeployment
- **Test Thoroughly**: Test all features before production

## 🎉 Success Indicators

You'll know it's working when:
- ✅ MetaMask connects to localhost network
- ✅ You see free ETH in test account
- ✅ SmartBank contract responds to deposits
- ✅ Interest calculations work correctly
- ✅ Transaction history displays properly
- ✅ Frontend shows real-time balances

## 📞 Support

### Common Issues:
- **"Contract not found"**: Check contract address in Web3Context
- **"Insufficient funds"**: Get more free ETH from Hardhat
- **"Network error"**: Verify localhost:8545 is running
- **Interest not showing**: Interest only calculates on contract interaction

### Resources:
- **Hardhat Console**: Check blockchain logs
- **MetaMask**: View transaction details
- **Browser Console**: Frontend debugging

---

**🎯 Ready to start testing SmartBank with free ETH!** 🚀
