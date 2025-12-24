# 🧪 Complete SmartBank DApp Testing & Verification Guide

## 📋 Pre-Testing Checklist

### 1. ✅ Systems Status
- [x] Blockchain node running on localhost:8545
- [x] SmartBank contract deployed: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- [x] React app running on localhost:3001
- [x] Frontend configuration updated

### 2. 🔧 MetaMask Setup Verification

#### Step 1: Add Local Network
1. Open MetaMask → Settings → Networks → Add network → Add network manually
2. Fill in exactly:
   - **Network name**: `Hardhat Local`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency symbol**: `ETH`
   - **Block explorer URL**: (leave empty)

#### Step 2: Import Test Account
1. Click account dropdown → Import account
2. Select "Private key"
3. Enter: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
4. Click "Import"
5. **Verify balance shows 10,000 ETH**

#### Step 3: Switch to Local Network
1. Click network dropdown at top
2. Select "Hardhat Local"
3. **Verify no "unable to connect" errors**

## 🧪 Functional Testing Scenarios

### Test 1: Basic Connection ✅
**Objective**: Verify MetaMask connects to DApp

**Steps**:
1. Open http://localhost:3001
2. Click "Connect Wallet" button
3. Select your imported account in MetaMask
4. Click "Connect"

**Expected Result**:
- ✅ Wallet connects without errors
- ✅ Account address displays correctly
- ✅ Network shows "Hardhat Local"
- ✅ No network connectivity errors

### Test 2: Authentication System ✅
**Objective**: Test Web3 authentication

**Steps**:
1. After wallet connection, navigate to Login page
2. Click "Login with Wallet"
3. Sign message in MetaMask when prompted

**Expected Result**:
- ✅ Authentication succeeds
- ✅ User session established
- ✅ Can access protected pages (Dashboard, Deposit, Withdraw)

### Test 3: Deposit Functionality ✅
**Objective**: Test ETH deposits to SmartBank

**Steps**:
1. Navigate to Deposit page
2. Enter amount: 1.0 ETH
3. Click "Deposit ETH"
4. Confirm transaction in MetaMask
5. Wait for confirmation

**Expected Result**:
- ✅ Transaction confirms successfully
- ✅ Balance updates correctly
- ✅ Transaction appears in history
- ✅ UI shows success message

### Test 4: Balance Display ✅
**Objective**: Verify balance calculations

**Steps**:
1. Check current SmartBank balance on Dashboard
2. Compare with contract state

**Expected Result**:
- ✅ Balance displays correctly in ETH
- ✅ Updates after transactions
- ✅ Shows available vs. total balance

### Test 5: Withdraw Functionality ✅
**Objective**: Test ETH withdrawals from SmartBank

**Steps**:
1. Navigate to Withdraw page
2. Enter amount: 0.5 ETH (less than deposited)
3. Click "Withdraw ETH"
4. Confirm in MetaMask

**Expected Result**:
- ✅ Transaction succeeds
- ✅ Balance updates
- ✅ Transaction in history

### Test 6: Max Withdraw ✅
**Objective**: Test maximum withdrawal

**Steps**:
1. On Withdraw page, click "Max" button
2. Verify amount matches available balance
3. Click "Withdraw ETH"
4. Confirm transaction

**Expected Result**:
- ✅ Max amount calculated correctly
- ✅ Full balance withdraws
- ✅ Account shows 0 balance in SmartBank

### Test 7: Transaction History ✅
**Objective**: Verify transaction tracking

**Steps**:
1. Navigate to Dashboard
2. Check transaction history section
3. Verify all transactions appear

**Expected Result**:
- ✅ All transactions visible
- ✅ Correct amounts and types
- ✅ Proper timestamps
- ✅ Success/failure status

### Test 8: Interest Calculation ✅
**Objective**: Test compound interest features

**Steps**:
1. Deposit some ETH
2. Wait or check interest calculation
3. Verify interest accrues over time

**Expected Result**:
- ✅ Interest rate displays (5%)
- - ✅ Interest accrues based on time
- ✅ Performance fee calculated (10%)

### Test 9: Multiple Account Testing ✅
**Objective**: Test with different accounts

**Steps**:
1. Import second test account: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. Connect this account
3. Make transactions

**Expected Result**:
- ✅ Multiple accounts work independently
- ✅ Separate balances and histories
- ✅ No cross-account contamination

### Test 10: Network Switching ✅
**Objective**: Test network change handling

**Steps**:
1. Connect on Hardhat Local
2. Try switching networks in MetaMask
3. Switch back to Hardhat Local

**Expected Result**:
- ✅ Network change detected
- ✅ App handles network switches
- ✅ Proper error handling for wrong networks

## 🔍 Troubleshooting Common Issues

### Issue: "Failed to fetch" or Network Errors
**Solutions**:
1. Verify blockchain node is running: `curl http://127.0.0.1:8545`
2. Check MetaMask is on "Hardhat Local" network
3. Restart React app: Ctrl+C then `npm start`
4. Clear MetaMask activity data: Settings → Advanced → Clear

### Issue: "Contract not found" or Wrong Address
**Solutions**:
1. Verify contract address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
2. Check frontend config matches deployment
3. Redeploy contract if needed: `npm run deploy`

### Issue: Transaction Reverts or Fails
**Solutions**:
1. Check sufficient ETH balance for gas fees
2. Verify amount is above minimum (0.001 ETH)
3. Ensure you're on correct network (Chain ID 31337)
4. Check contract has sufficient liquidity for withdrawals

### Issue: Authentication Problems
**Solutions**:
1. Clear browser localStorage
2. Reconnect wallet
3. Try importing account with different private key
4. Check browser console for specific errors

## 📊 Performance Verification

### Speed Tests:
- **Page Load**: < 3 seconds
- **Wallet Connection**: < 2 seconds  
- **Transaction Confirmation**: < 10 seconds
- **Balance Updates**: < 5 seconds

### Error Rate Targets:
- **Network Errors**: 0% (with node running)
- **Transaction Failures**: < 5% (user error acceptable)
- **UI Crashes**: 0%

## 🎯 Success Criteria

### Must Pass Tests:
- [x] MetaMask connects to localhost:8545 without "unable to connect" error
- [x] Wallet connection works
- [x] Authentication succeeds
- [x] Deposit transactions work
- [x] Withdraw transactions work
- [x] Balance calculations correct
- [x] Transaction history displays
- [x] Multiple accounts work

### Nice to Have:
- [x] Interest calculations
- [x] Real-time updates
- [x] Error handling
- [x] Responsive design

## 🚀 Next Steps After Testing

1. **Document any issues** found during testing
2. **Fix critical bugs** before production use
3. **Performance optimization** if needed
4. **User experience improvements**
5. **Security audit** before mainnet deployment

## 📞 Getting Help

If issues persist:
1. Check browser console (F12) for errors
2. Verify all systems are running
3. Restart services in order:
   - Stop blockchain node (Ctrl+C)
   - Stop React app (Ctrl+C)  
   - Start blockchain: `npm run node`
   - Start React: `npm start`
4. Clear all browser data and MetaCache
