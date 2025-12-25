# 🔧 Complete MetaMask Setup Guide for SmartBank Local Development

## 🎯 What You'll Accomplish
This guide will help you set up MetaMask to work perfectly with SmartBank's local blockchain environment, giving you **free ETH** for testing without any real money involved.

## 📋 Prerequisites Checklist

### ✅ Required Software
- [ ] **MetaMask** browser extension installed
- [ ] **Node.js** v16+ (already installed)
- [ ] **VSCode** with SmartBank project open
- [ ] **Terminal** access

### ✅ Project Status
- [ ] **SmartBank Contract** - Ready for deployment
- [ ] **Frontend App** - Configured for localhost:3000
- [ ] **Hardhat Network** - Ready for local blockchain

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Run Quick Setup Script
```bash
# In your SmartBank root directory
chmod +x quick-start.sh
./quick-start.sh
```

### Step 2: Start Local Blockchain
```bash
# Terminal 1 - Keep this running!
cd smart-contract
npm run node
```
**⏱️ Wait for:** `Hardhat network started!`

### Step 3: Deploy Smart Contract
```bash
# Terminal 2 - Run this after blockchain starts
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost
```
**⏱️ Note the contract address printed at the end**

### Step 4: Update Frontend Configuration
```bash
# Update Front-End/src/config/SmartBankConfig.js
# Replace localhost: '0x0000000000000000000000000000000000000000'
# With your deployed contract address
```

### Step 5: Configure MetaMask
1. **Open MetaMask** → Click network dropdown
2. **Add Network** → **Add Network Manually**
3. **Enter these exact details:**
   - **Network Name**: `Localhost 8545`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer**: Leave empty

### Step 6: Import Test Account
1. **Copy private key** from Hardhat terminal output
2. **MetaMask** → Account menu → **Import Account**
3. **Paste private key** → **Import**
4. **Rename account** to "SmartBank Test"

### Step 7: Test Connection
1. **Open**: http://localhost:3000
2. **Click**: "Connect Wallet" 
3. **Select**: "Localhost 8545"
4. **Confirm**: Should see 10,000 ETH balance!

---

## 🔧 Detailed MetaMask Configuration

### Adding Local Network Manually

#### Method 1: Through MetaMask Settings
1. **Click MetaMask icon** → **Settings**
2. **Go to "Networks"** → **Add Network**
3. **Select "Add Network Manually"**
4. **Fill in network details:**
   ```json
   {
     "networkName": "Localhost 8545",
     "rpcUrl": "http://127.0.0.1:8545", 
     "chainId": "31337",
     "currencySymbol": "ETH",
     "blockExplorerUrl": ""
   }
   ```

#### Method 2: Through Network Dropdown
1. **Click network dropdown** at top of MetaMask
2. **Click "Add Network"**
3. **Click "Add Network Manually"**
4. **Enter the same details as above**

### Importing Test Accounts

#### From Hardhat Output
When you run `npm run node`, Hardhat shows test accounts:
```
Account #0: 0x1234...abcd (10000 ETH) <- Use this one
Account #1: 0x5678...efgh (10000 ETH)
```

**Steps to import:**
1. **Copy the private key** (starts with `0x...`)
2. **MetaMask** → Account menu (circle icon)
3. **"Import Account"**
4. **Paste private key**
5. **"Import"**
6. **Rename to "SmartBank Test"**

#### Getting Additional Test ETH
```bash
# Stop the current blockchain (Ctrl+C)
# Restart to get fresh 10,000 ETH
npm run node
```

---

## 💰 Testing SmartBank Features

### Basic Testing Workflow

#### 1. Connect Wallet
- **Visit**: http://localhost:3000
- **Click**: "Connect Wallet" in navbar
- **Select**: "Localhost 8545" network
- **Confirm**: Connection in MetaMask popup

#### 2. Verify Connection
✅ **Should see:**
- Green "Connected" status
- Your wallet address (truncated)
- 10,000 ETH balance in MetaMask
- 0 ETH balance in SmartBank (initially)

#### 3. Test Deposit
1. **Go to "Deposit" page**
2. **Enter amount**: 0.1 ETH
3. **Click "Deposit ETH"**
4. **MetaMask will show:**
   - Transaction details
   - Gas fee (usually 0)
   - Contract address
5. **Click "Confirm"**
6. **Wait for confirmation**
7. **Check dashboard** for updated balance

#### 4. Test Withdrawal
1. **Go to "Withdraw" page**
2. **Click "Max"** to withdraw all
3. **Click "Withdraw ETH"**
4. **Confirm in MetaMask**
5. **Verify** balance increased in MetaMask

#### 5. Monitor Interest
- **SmartBank gives 5% annual interest**
- **Interest updates** when you interact with contract
- **Check dashboard** for virtual balance (deposited + interest)

---

## 🔍 Advanced Testing Scenarios

### Multi-User Testing (Web3 Authentication Demo)
The SmartBank now supports **true multi-user functionality** with Web3 authentication:

#### 1. Run Multi-User Demo Script
```bash
# Terminal 3 - Deploy and test multiple users
cd smart-contract
npx hardhat run scripts/multiUserDemo.js
```
This creates 3 test users and demonstrates:
- Multiple users depositing ETH
- Isolated user balances (each user sees only their own data)
- Event-based transaction history
- Secure Web3 authentication

#### 2. Import Multiple Test Accounts
After running the demo script, you'll get 3 private keys:
```bash
# Copy these private keys and import them to MetaMask:
User 1: 0x... (import as "SmartBank User 1")
User 2: 0x... (import as "SmartBank User 2") 
User 3: 0x... (import as "SmartBank User 3")
```

#### 3. Test Multi-User Isolation
1. **Connect with User 1**: Should only see User 1's transactions
2. **Switch to User 2**: Should only see User 2's transactions
3. **Switch to User 3**: Should only see User 3's transactions
4. **Verify**: No user can see another user's data

#### 4. Web3 Authentication Features
- **Wallet Address = User Identity**: No usernames/passwords needed
- **MetaMask Signature**: Secure authentication without storing private keys
- **Event Filtering**: Users only see their own transaction history
- **Real-time Updates**: New transactions appear instantly for authenticated users

### Legacy Multi-Account Testing
1. **Import second account** from Hardhat:
   ```bash
   # Get Account #1 private key from terminal
   # Import to MetaMask as "SmartBank Test 2"
   ```
2. **Switch accounts** in MetaMask
3. **Make deposits** from different accounts
4. **Verify** each account has separate balance

### Stress Testing
1. **Large deposits**: Test with 1-5 ETH
2. **Multiple transactions**: Make several deposits/withdrawals
3. **Interest calculation**: Wait and check if interest accumulates
4. **Admin functions**: Test fee withdrawal (if owner)

### Edge Cases
1. **Minimum deposit**: Try 0.001 ETH (minimum)
2. **Insufficient funds**: Try to withdraw more than deposited
3. **Network switching**: Switch to mainnet and back
4. **Account disconnect**: Disconnect and reconnect wallet

---

## 🛠️ Troubleshooting MetaMask Issues

### Common Problems & Solutions

#### "Connection Failed"
**Symptoms**: Can't connect to localhost network
**Solutions**:
1. **Check blockchain is running**: `npm run node` in smart-contract folder
2. **Verify MetaMask network**: Should show "Localhost 8545"
3. **Clear MetaMask cache**: Settings → Advanced → Reset Account
4. **Restart browser**: Close all tabs, reopen

#### "Insufficient Funds"
**Symptoms**: Transaction fails with "insufficient funds"
**Solutions**:
1. **Check MetaMask balance**: Should show 10,000 ETH
2. **Get more ETH**: Restart blockchain (`npm run node`)
3. **Verify network**: Make sure on localhost:8545
4. **Import correct account**: Use private key from Hardhat terminal

#### "Wrong Network"
**Symptoms**: App shows wrong network error
**Solutions**:
1. **Switch to localhost**: MetaMask network dropdown
2. **Add network manually**: If localhost not visible
3. **Check chain ID**: Should be 31337
4. **Clear state**: Disconnect and reconnect wallet

#### "Contract Not Found"
**Symptoms**: SmartBank features don't work
**Solutions**:
1. **Check contract address**: Update in SmartBankConfig.js
2. **Redeploy contract**: `npx hardhat run scripts/deploy.ts --network localhost`
3. **Verify deployment**: Check Hardhat terminal for success
4. **Restart frontend**: `npm start` in Front-End folder

#### "Transaction Reverted"
**Symptoms**: Transactions fail after confirmation
**Solutions**:
1. **Check contract code**: Ensure SmartBank.sol is correct
2. **Verify gas settings**: Try increasing gas limit
3. **Check balance**: Ensure sufficient ETH for gas
4. **Review logs**: Check browser console for errors

### Debugging Tools

#### Browser Console
```javascript
// Check MetaMask connection
console.log('MetaMask available:', window.ethereum);
console.log('Current account:', await window.ethereum.request({method: 'eth_accounts'}));
console.log('Current chain:', await window.ethereum.request({method: 'eth_chainId'}));
```

#### Hardhat Console
```bash
# Check blockchain logs
# Look in the terminal running 'npm run node'
# Shows all transactions and contract calls
```

#### MetaMask Activity
1. **Click activity tab** in MetaMask
2. **View transaction details**
3. **Check gas fees and status**
4. **Copy transaction hash** for debugging

---

## 🎮 Testing Checklist

### Basic Functionality ✅
- [ ] MetaMask connects to localhost network
- [ ] Test account shows 10,000 ETH
- [ ] Frontend loads at localhost:3000
- [ ] "Connect Wallet" works
- [ ] Can make deposit transaction
- [ ] Can make withdrawal transaction
- [ ] Balance updates correctly
- [ ] Transaction history shows

### Advanced Features ✅
- [ ] Interest calculation works
- [ ] Multiple accounts tested
- [ ] Large transactions work
- [ ] Admin functions work (if owner)
- [ ] Error handling works
- [ ] Network switching works

### Performance ✅
- [ ] Transactions confirm quickly (< 5 seconds)
- [ ] No console errors
- [ ] UI updates in real-time
- [ ] Interest accumulates over time

---

## 💡 Pro Tips for Local Development

### Efficient Testing
1. **Keep blockchain running**: Don't restart unless necessary
2. **Use multiple accounts**: Test different user scenarios
3. **Monitor gas fees**: Local network has no real fees
4. **Test edge cases**: Try invalid inputs and error conditions

### MetaMask Best Practices
1. **Organize accounts**: Rename imported accounts clearly
2. **Backup private keys**: Save test account keys securely
3. **Clear history**: Reset account for fresh testing
4. **Network management**: Keep only needed networks

### Development Workflow
1. **Start blockchain first**: Always run `npm run node` first
2. **Deploy contract regularly**: After code changes
3. **Update frontend config**: Keep contract address current
4. **Test after each change**: Verify nothing breaks

### Security Considerations
1. **Never use real accounts**: Only test accounts
2. **Keep test keys private**: Don't share private keys
3. **Clear browser data**: Between testing sessions
4. **Verify contract code**: Review before deploying

---

## 🔧 Advanced Configuration

### Custom Network Settings
If you need to customize the local network:

```javascript
// In smart-contract/hardhat.config.js
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [
        // Add specific private keys here
        "0x..." // Your test account private key
      ],
      gas: "auto",
      gasPrice: "auto"
    }
  }
};
```

### MetaMask Network Detection
The frontend automatically detects MetaMask network:
```javascript
// In Web3Context.jsx
const isLocalhost = network?.chainId === 31337;
const isConnected = isConnected && isLocalhost;
```

### Contract Address Management
```javascript
// Update these after each deployment
const CONTRACT_ADDRESSES = {
  localhost: '0x1234567890123456789012345678901234567890',
  sepolia: '0x0000000000000000000000000000000000000000'
};
```

---

## 📞 Support & Resources

### Getting Help
1. **Check console logs**: Browser and Hardhat terminals
2. **Verify setup**: Follow checklist step by step
3. **Restart services**: Blockchain, frontend, browser
4. **Clear data**: Reset MetaMask account if needed

### Useful Commands
```bash
# Reset everything
cd smart-contract && npm run node &

# Deploy fresh contract
npx hardhat run scripts/deploy.ts --network localhost

# Restart frontend
cd Front-End && npm start

# Check blockchain status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://localhost:8545
```

### File Locations
- **Frontend**: `/Users/macbook/smartbank/Front-End/`
- **Contracts**: `/Users/macbook/smartbank/smart-contract/`
- **Config**: `Front-End/src/config/SmartBankConfig.js`
- **Web3 Context**: `Front-End/src/contexts/Web3Context.jsx`

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **MetaMask shows "Localhost 8545" network**  
✅ **Test account displays 10,000 ETH balance**  
✅ **SmartBank frontend loads without errors**  
✅ **"Connect Wallet" successfully connects**  
✅ **Deposits and withdrawals work smoothly**  
✅ **Transaction confirmations are instant**  
✅ **Interest calculations display correctly**  
✅ **No console errors during normal operation**  

---

**🚀 You're now ready to test SmartBank with MetaMask on local development!** 🎯

*Remember: This setup uses only test ETH on your local machine - completely free and safe!*
