# 🔧 MetaMask Setup Guide for SmartBank

## Quick Setup Instructions

### 1. Add Localhost Network
1. Open MetaMask → Settings → Networks → Add Network → Add Network Manually
2. Enter these exact values:
   - **Network Name**: `Localhost 8545`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`

### 2. Import Test Account
Use this private key to import a test account with 10,000 ETH:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 3. Switch to Localhost Network
- Make sure you're connected to "Localhost 8545" network
- Account should show 10,000 ETH balance

## Common Issues & Solutions

### Issue: "Network Error"
**Solution**: 
- Check blockchain is running (Terminal 1 should show blocks)
- Verify RPC URL: http://127.0.0.1:8545
- Try switching networks in MetaMask

### Issue: "Insufficient Funds"
**Solution**:
- Import correct test account private key
- Check account has 10,000 ETH

### Issue: "Contract Not Found"
**Solution**:
- Refresh browser (Ctrl+Shift+R)
- Check contract address: 0x5fbdb2315678afecb367f032d93f642f64180aa3

### Issue: Transaction Failed
**Solution**:
- Minimum deposit: 0.001 ETH
- Check account balance
- Try smaller amounts first

## Test Sequence
1. ✅ Visit http://localhost:3000
2. ✅ Connect MetaMask to Localhost 8545
3. ✅ Verify 10,000 ETH balance
4. ✅ Try deposit of 0.01 ETH
5. ✅ Check virtual balance increases
6. ✅ View transaction history
