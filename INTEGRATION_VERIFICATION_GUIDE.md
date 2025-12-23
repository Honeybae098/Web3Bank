# MetaMask-Smart Contract Integration Verification Guide

## Overview
This guide will help you verify that your frontend, MetaMask, and SmartBank smart contract are properly integrated and working together.

## 🔍 Step-by-Step Verification Process

### 1. MetaMask Installation & Detection

**✅ Check MetaMask Installation**
```javascript
// Verify in browser console or your app
if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask is installed');
} else {
    console.log('❌ MetaMask is not installed');
}
```

**Expected Behavior:**
- ✅ MetaMask extension should be detected
- ✅ Your ConnectWallet component should show the "Connect Wallet" button
- ❌ If not installed, should show installation prompt

### 2. Wallet Connection Test

**✅ Test Wallet Connection**
```javascript
// Your ConnectWallet component should handle this
const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
});
console.log('Connected accounts:', accounts);
```

**Expected Behavior:**
- ✅ MetaMask popup should appear asking for permission
- ✅ Should connect to localhost (chainId: 31337) for local testing
- ✅ Should return at least one account address
- ❌ Should handle rejection gracefully

### 3. Smart Contract Deployment Verification

**✅ Check Contract Deployment**
```bash
# In your smart-contract directory
cd smart-contract
npx hardhat node  # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
SmartBank deployed to: 0x...
```

**✅ Verify Contract Address**
```javascript
// Your SmartBankService should show this
const contractAddress = "0x..."; // From deployment
console.log('✅ Contract deployed at:', contractAddress);
```

### 4. Contract Initialization Test

**✅ Test Contract Connection**
```javascript
// Your Web3Context should handle this
const contract = new ethers.Contract(contractAddress, SmartBankABI, signer);
const stats = await contract.getBankStatistics();
console.log('✅ Contract initialized successfully:', stats);
```

**Expected Behavior:**
- ✅ Should return totalLiquidity and bankProfit
- ❌ Should handle "Contract not deployed" errors gracefully

### 5. Transaction Testing

**✅ Test Deposit Transaction**
```javascript
// From your Deposit page
const result = await smartBankService.deposit("0.1", userAddress);
if (result.success) {
    console.log('✅ Deposit successful:', result.transactionHash);
} else {
    console.log('❌ Deposit failed:', result.error);
}
```

**Expected Behavior:**
- ✅ MetaMask should show transaction confirmation
- ✅ Transaction should succeed on localhost network
- ✅ Should return transaction hash
- ❌ Should handle insufficient funds, wrong network, etc.

**✅ Test Withdraw Transaction**
```javascript
// From your Withdraw page
const result = await smartBankService.withdraw("0.05", userAddress);
console.log('Withdraw result:', result);
```

**Expected Behavior:**
- ✅ Should withdraw successfully if balance sufficient
- ✅ Should show proper error if insufficient balance

### 6. Event Monitoring Test

**✅ Test Event Listening**
```javascript
// Your service should listen for events
const cleanup = smartBankService.setupEventListeners(userAddress, {
    onDeposit: (event) => {
        console.log('✅ Deposit event received:', event);
    },
    onWithdraw: (event) => {
        console.log('✅ Withdraw event received:', event);
    }
});
```

**Expected Behavior:**
- ✅ Should receive Deposit events after successful deposits
- ✅ Should receive Withdraw events after successful withdrawals
- ✅ Events should contain correct user address and amounts

## 🛠️ Testing Checklist

### Frontend Integration
- [ ] MetaMask detection works
- [ ] Connect/Disconnect wallet functionality
- [ ] Account change detection
- [ ] Network change detection
- [ ] Balance display updates
- [ ] Transaction history loads

### MetaMask Integration
- [ ] Transaction confirmations appear
- [ ] Gas estimation works
- [ ] Transaction status updates
- [ ] Error messages display properly
- [ ] Network switching works

### Smart Contract Integration
- [ ] Contract deployed successfully
- [ ] Contract methods callable
- [ ] Events emitting properly
- [ ] Balance calculations correct
- [ ] Interest calculations working

## 🚨 Common Issues & Solutions

### Issue 1: "No wallet provider found"
**Cause:** MetaMask not installed or not detected
**Solution:** 
```javascript
// Add detection in your app
if (!window.ethereum) {
    // Show installation prompt
}
```

### Issue 2: "Contract not deployed"
**Cause:** Contract not deployed on current network
**Solution:**
```bash
# Deploy contract first
npx hardhat run scripts/deploy.js --network localhost
```

### Issue 3: "Insufficient account balance"
**Cause:** Trying to withdraw more than deposited
**Solution:** Check balance before withdrawal
```javascript
const balance = await smartBankService.getUserBalance(userAddress);
if (parseFloat(balance.balance) < amount) {
    throw new Error('Insufficient balance');
}
```

### Issue 4: Wrong Network
**Cause:** Connected to wrong blockchain network
**Solution:**
```javascript
// Switch to localhost
await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x7a69' }] // 31337 in hex
});
```

## 🔧 Debugging Tools

### 1. Browser Console Debugging
```javascript
// Check all Web3 states
console.log('Provider:', provider);
console.log('Signer:', signer);
console.log('Address:', address);
console.log('Network:', network);
console.log('Balance:', balance);
```

### 2. Network Debugging
```javascript
// Check current network
const chainId = await window.ethereum.request({
    method: 'eth_chainId'
});
console.log('Current chainId:', parseInt(chainId, 16));
```

### 3. Transaction Debugging
```javascript
// Monitor transaction status
tx.wait().then(receipt => {
    console.log('Transaction confirmed:', receipt);
    console.log('Gas used:', receipt.gasUsed.toString());
    console.log('Status:', receipt.status);
});
```

### 4. Event Debugging
```javascript
// Add event listeners for debugging
contract.on('Deposit', (user, amount, timestamp) => {
    console.log('Deposit event:', { user, amount: amount.toString(), timestamp });
});
```

## 📱 Testing Commands

### Start Local Development
```bash
# Terminal 1: Start local blockchain
cd smart-contract
npx hardhat node

# Terminal 2: Start frontend
cd Front-End
npm start
```

### Deploy Contract
```bash
cd smart-contract
npx hardhat run scripts/deploy.js --network localhost
```

### Test Transaction Flow
1. Open frontend in browser
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Deposit test amount
5. Check balance updates
6. Withdraw test amount
7. Verify transaction history

## ✅ Success Indicators

### Frontend Success
- ✅ MetaMask connects without errors
- ✅ Account address displays correctly
- ✅ Balance updates after transactions
- ✅ Transaction history shows records
- ✅ No console errors

### MetaMask Success
- ✅ Transaction confirmations appear
- ✅ Gas fees calculated correctly
- ✅ Transaction status updates to "confirmed"
- ✅ Account balance reflects changes

### Contract Success
- ✅ Contract methods execute successfully
- ✅ Events emit with correct data
- ✅ Balance calculations accurate
- ✅ Interest calculations working
- ✅ No reverts or failed transactions

## 🎯 Integration Success Test

Complete this test to verify full integration:

1. **Setup**: Start local blockchain and frontend
2. **Connect**: Connect MetaMask wallet
3. **Deposit**: Deposit 0.1 ETH
4. **Verify**: Check balance and transaction history
5. **Withdraw**: Withdraw 0.05 ETH
6. **Verify**: Check balance decreased and history updated
7. **Events**: Confirm events were received
8. **Errors**: Test error handling (insufficient funds, etc.)

If all steps pass without errors, your integration is working correctly! 🎉

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify contract deployment
3. Confirm MetaMask is on correct network
4. Test with small amounts first
5. Check network connectivity
