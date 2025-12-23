# Frontend-MetaMask-Smart Contract Integration Test

## Test Scenarios to Verify Success

### Test 1: MetaMask Detection & Connection
**Expected Result:** ✅ SUCCESS
```
1. Open browser console
2. Type: window.ethereum
   Result: Should return MetaMask object (not undefined)

3. Click "Connect Wallet" button in your app
   Expected: MetaMask popup appears asking for permission
   Result: User can approve connection
   UI: Button changes to "Connected" state with address
```

### Test 2: Contract Deployment Check
**Expected Result:** ✅ SUCCESS
```bash
# Run in smart-contract directory
cd smart-contract
npx hardhat run scripts/deploy.js --network localhost

Expected Output:
SmartBank deployed to: 0x1234...abcd
```

### Test 3: Balance Reading
**Expected Result:** ✅ SUCCESS
```javascript
// In browser console or your app
const balance = await smartBankService.getUserBalance(userAddress);
console.log('Balance result:', balance);
// Should return: { success: true, balance: "0.000", rawBalance: "0" }
```

### Test 4: Deposit Transaction
**Expected Result:** ✅ SUCCESS
```javascript
const result = await smartBankService.deposit("0.1", userAddress);
console.log('Deposit result:', result);
// Should return: { success: true, transactionHash: "0x...", ... }
```

### Test 5: Withdraw Transaction  
**Expected Result:** ✅ SUCCESS
```javascript
const result = await smartBankService.withdraw("0.05", userAddress);
console.log('Withdraw result:', result);
// Should return: { success: true, transactionHash: "0x...", ... }
```

### Test 6: Event Listening
**Expected Result:** ✅ SUCCESS
```javascript
// Should receive events for transactions
contract.on('Deposit', (user, amount, timestamp) => {
    console.log('✅ Deposit event received:', { user, amount: amount.toString() });
});
```

## 🚨 Failure Indicators (❌ FAILED)

### MetaMask Issues:
- `window.ethereum` returns `undefined`
- "No wallet provider found" error
- Connection popup doesn't appear
- Wrong network detected

### Contract Issues:
- "Contract not deployed" error
- "Contract not initialized" error
- Transaction reverts
- Gas estimation fails

### Frontend Issues:
- UI doesn't update after transactions
- Balance shows wrong values
- Transaction history empty
- Console errors present

## 🛠️ Debug Commands

### Check Current Status:
```bash
# Run the integration test
./test-integration.sh

# Check if hardhat node is running
lsof -i :8545

# Check contract deployment
cd smart-contract && npx hardhat run scripts/deploy.js --network localhost
```

### Browser Console Debug:
```javascript
// Check all Web3 states
console.log('Provider:', window.ethereum);
console.log('Accounts:', await window.ethereum.request({method: 'eth_accounts'}));
console.log('Chain ID:', await window.ethereum.request({method: 'eth_chainId'}));

// Test contract connection
const contract = new ethers.Contract(contractAddress, SmartBankABI, signer);
const stats = await contract.getBankStatistics();
console.log('Contract stats:', stats);
```

### Network Debug:
```javascript
// Switch to localhost network
await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x7a69' }] // 31337 in hex
});
```

## 📊 Integration Health Dashboard

### ✅ Green (Working):
- MetaMask connects successfully
- Contract methods return expected results
- Transactions complete without errors
- UI updates reflect blockchain state
- Events are received and processed

### 🟡 Yellow (Warning):
- Works but with warnings
- High gas fees
- Slow transaction confirmation
- Intermittent connection issues

### ❌ Red (Broken):
- Connection fails
- Contract methods revert
- Transactions fail
- UI doesn't update
- Events not received

## 🎯 Complete Integration Test

Run this sequence to verify everything works:

1. **Setup Environment**
   ```bash
   # Terminal 1: Start blockchain
   cd smart-contract && npx hardhat node
   
   # Terminal 2: Deploy contract  
   cd smart-contract && npx hardhat run scripts/deploy.js --network localhost
   
   # Terminal 3: Start frontend
   cd Front-End && npm start
   ```

2. **Test User Flow**
   ```
   ✅ Open http://localhost:3000
   ✅ Click "Connect Wallet"
   ✅ Approve MetaMask connection
   ✅ Verify address displays
   ✅ Check balance shows "0.000"
   ✅ Deposit "0.1" ETH
   ✅ Verify balance updates to "0.100"
   ✅ Check transaction history shows deposit
   ✅ Withdraw "0.05" ETH  
   ✅ Verify balance updates to "0.050"
   ✅ Check transaction history shows withdrawal
   ✅ Verify events were received
   ```

3. **Success Criteria**
   - All steps complete without errors
   - UI updates in real-time
   - No console errors
   - Transactions confirm successfully
   - Balance calculations are correct

## 🚀 Quick Start Testing

If you want to quickly test your integration:

1. **Run the automated test:**
   ```bash
   ./test-integration.sh
   ```

2. **Follow the manual verification guide:**
   ```bash
   # Read the detailed guide
   cat INTEGRATION_VERIFICATION_GUIDE.md
   ```

3. **Test the complete flow:**
   - Connect MetaMask → Should work ✅
   - Deploy contract → Should succeed ✅  
   - Make transactions → Should work ✅
   - View results → Should update ✅

## 📞 Success Confirmation

You'll know integration is successful when:
- ✅ MetaMask connects without errors
- ✅ Transactions complete successfully  
- ✅ Balances update correctly
- ✅ Transaction history displays
- ✅ No console errors
- ✅ Events are received
- ✅ All user interactions work smoothly

If any of these fail, refer to the troubleshooting section in the INTEGRATION_VERIFICATION_GUIDE.md for solutions.
