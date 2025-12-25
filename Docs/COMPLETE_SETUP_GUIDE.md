# 🚀 SmartBank Local Development - Complete Setup Guide

## 🎯 What You'll Get
- **Free ETH** for testing (no real money needed)
- **Local blockchain** running on your machine
- **MetaMask integration** with localhost network
- **SmartBank contract** with 5% annual interest
- **Full-stack testing** of deposits, withdrawals, and interest calculations

## 📋 Current Status
✅ **SmartBank Smart Contract** - Ready (5% interest rate)
✅ **Frontend Application** - Running on http://localhost:3000
✅ **Contract Service Layer** - Created with full functionality
✅ **Web3 Integration** - Configured for MetaMask
✅ **Setup Scripts** - Ready for deployment

## 🔧 Step-by-Step Setup

### Step 1: Start Local Blockchain (REQUIRED FIRST)
```bash
# Open NEW terminal and run:
cd smart-contract
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Available Accounts
==================
(0) 0x1234...abcd (10000 ETH) <- Use this account in MetaMask
(1) 0x5678...efgh (10000 ETH)
...
```

**⚠️ IMPORTANT:** Keep this terminal running! The blockchain stops when you close it.

### Step 2: Deploy SmartBank Contract
```bash
# Open ANOTHER terminal and run:
cd smart-contract
npx hardhat run scripts/deploy.ts --network localhost
```

**Expected Output:**
```
SmartBank deployed at: 0x1234567890123456789012345678901234567890
```

**📝 SAVE THIS ADDRESS** - You'll need it to update the frontend!

### Step 3: Update Frontend Configuration
Edit `Front-End/src/config/SmartBankConfig.js` and replace:
```javascript
localhost: '0x0000000000000000000000000000000000000000',
```
with your actual contract address:
```javascript
localhost: '0x1234567890123456789012345678901234567890',
```

### Step 4: Setup MetaMask
1. **Install MetaMask** browser extension (if not installed)
2. **Add Localhost Network:**
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account:**
   - Click "Import Account"
   - Copy the **Private Key** from Step 1 output (first account)
   - Name it "SmartBank Test Account"

### Step 5: Test the Application
1. **Visit:** http://localhost:3000
2. **Click:** "Connect Wallet" 
3. **Select:** "Localhost 8545" network
4. **Approve:** Connection in MetaMask
5. **Test Features:**
   - View account balance
   - Make a deposit (minimum 0.001 ETH)
   - Check virtual balance (includes interest)
   - View transaction history
   - Make a withdrawal

## 🎮 Testing Scenarios

### Basic Testing:
```javascript
// Test these scenarios:
1. Connect wallet to localhost network
2. Deposit 0.1 ETH
3. Check virtual balance (should show deposit + any interest)
4. View transaction history
5. Withdraw 0.05 ETH
6. Check final balance
```

### Interest Testing:
```javascript
// Interest calculations happen on contract interaction
1. Deposit 1 ETH
2. Wait or interact with contract (deposit/withdraw)
3. Check if balance increased by ~5% annually
4. View "Interest Earned" transactions
```

### Multiple Account Testing:
```javascript
// Test with multiple accounts:
1. Import second test account from Step 1
2. Switch accounts in MetaMask
3. Make deposits from different accounts
4. Verify each account tracks separately
```

## 🔍 SmartBank Features Available

### Contract Functions:
- ✅ `deposit()` - Add ETH to your account
- ✅ `withdraw(amount)` - Withdraw specified amount
- ✅ `getBalance(user)` - View virtual balance with interest
- ✅ `getHistory(user)` - View transaction history
- ✅ `getBankStatistics()` - View total liquidity and bank profit

### Interest System:
- ✅ **5% Annual Interest** on deposited ETH
- ✅ **Automatic Calculation** on deposits/withdrawals
- ✅ **Performance Fee** (10% to bank)
- ✅ **Real-time Tracking** of interest accrual

### Security Features:
- ✅ **ReentrancyGuard** - Prevents reentrancy attacks
- ✅ **Access Control** - Admin functions protected
- ✅ **Liquidity Checks** - Ensures sufficient funds
- ✅ **Input Validation** - Prevents invalid transactions

## 💡 Tips for Local Development

### Managing Free ETH:
```javascript
// Get more free ETH:
- Each test account starts with 10,000 ETH
- Restart blockchain to reset everything
- Import different private keys for testing
```

### Debugging:
```javascript
// Check these if issues occur:
1. Blockchain running? (Terminal 1)
2. Contract deployed? (Check Step 2 output)
3. Contract address updated? (Step 3)
4. MetaMask connected to localhost? (Step 4)
5. Correct account imported? (Check private key)
```

### Reset Everything:
```javascript
// To start fresh:
1. Stop all terminals (Ctrl+C)
2. Restart blockchain: npm run node
3. Redeploy contract: npx hardhat run scripts/deploy.ts --network localhost
4. Update contract address in frontend
5. Reset MetaMask account if needed
```

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ MetaMask shows "Localhost 8545" network
- ✅ Test account shows 10,000 ETH balance
- ✅ Frontend loads without errors
- ✅ "Connect Wallet" button works
- ✅ Deposits execute successfully
- ✅ Virtual balance includes interest
- ✅ Transaction history shows all activities

## 🚨 Important Notes

### Security:
- **Test Only:** Never use real ETH on localhost
- **Private Keys:** Keep test account keys secure
- **Reset Frequently:** Restart blockchain for clean state

### Development:
- **Keep Terminals Open:** Blockchain stops when terminal closes
- **Update Addresses:** Contract address changes after redeployment
- **Test Thoroughly:** Verify all features before production

## 📞 Troubleshooting

### Common Issues:

**"Contract not found" Error:**
- Check contract address in `SmartBankConfig.js`
- Verify contract is deployed (Step 2)
- Restart blockchain and redeploy if needed

**"Insufficient funds" Error:**
- Import correct test account private key
- Check account has ETH balance in MetaMask
- Get more free ETH by restarting blockchain

**"Network error" Error:**
- Verify blockchain is running (Terminal 1)
- Check RPC URL: http://127.0.0.1:8545
- Restart blockchain if needed

**Interest Not Showing:**
- Interest calculates on contract interaction
- Make a deposit/withdrawal to trigger calculation
- Check transaction history for "Interest Earned" entries

## 🎯 Next Steps After Testing

1. **Frontend Integration:** Connect SmartBank UI components
2. **Testing:** Test all deposit/withdrawal scenarios
3. **UI Polish:** Add loading states, error handling
4. **Security Audit:** Review contract before mainnet
5. **Mainnet Deployment:** Deploy to Sepolia/testnet first

---

**🚀 Ready to start testing SmartBank with free ETH!**
