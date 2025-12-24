# MetaMask Localhost Connection Guide

## ✅ Local Blockchain Status
- **Network**: Hardhat Local Network
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Status**: ✅ RUNNING

## 🚀 Step-by-Step MetaMask Setup

### Step 1: Open MetaMask
1. Click on the MetaMask extension in your browser
2. Make sure you're on the main screen

### Step 2: Add Local Network
1. Click on the network dropdown at the top (usually shows "Ethereum Mainnet")
2. Click "Add network" → "Add network manually"
3. Fill in the following details:

**Network Details:**
- **Network name**: `Hardhat Local`
- **New RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency symbol**: `ETH`
- **Block explorer URL**: (leave blank)

4. Click "Save"

### Step 3: Import Test Account
Choose one of these test accounts to import:

**Option 1 - Account #1 (Recommended for testing):**
- **Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Option 2 - Account #0:**
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**To import:**
1. Click your account avatar (top right)
2. Click "Import account"
3. Select "Private key"
4. Paste one of the private keys above
5. Click "Import"

### Step 4: Switch to Local Network
1. Click the network dropdown at the top
2. Select "Hardhat Local"
3. You should now see your account with 10,000 ETH balance

## 🔧 Troubleshooting

### If connection fails:
1. **Check if blockchain is running**: The terminal should show "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
2. **Restart blockchain**: Stop the current process (Ctrl+C) and run `npm run node` again
3. **Clear MetaMask cache**: Settings → Advanced → Clear activity data

### If you see "Unable to connect":
1. Ensure the blockchain node is running in the terminal
2. Verify you're using the correct RPC URL: `http://127.0.0.1:8545`
3. Check that Chain ID is exactly `31337`

## 🧪 Testing the Connection

### Test 1: Balance Check
- Your imported account should show **10,000 ETH**
- This confirms the connection is working

### Test 2: Web App Connection
1. Open your SmartBank application (usually at http://localhost:3000 or http://localhost:3001)
2. Click "Connect Wallet"
3. You should see your imported account listed
4. MetaMask should connect without the "Unable to connect to Localhost 8545" error

## 📋 Available Test Accounts

| Account # | Address | Private Key | Use Case |
|-----------|---------|-------------|----------|
| 0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 | Primary testing |
| 1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d | Recommended |
| 2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a | Alternative testing |

## 🎯 Next Steps

Once MetaMask is connected:
1. **Visit your web application**
2. **Connect your wallet** - MetaMask should connect successfully
3. **Test transactions** - Try depositing and withdrawing
4. **Verify transaction history** - Check that transactions appear in history

## 🛡️ Security Notes

⚠️ **IMPORTANT**: These test accounts are for development only!
- Private keys are publicly known
- Only use on local/test networks
- Never import these keys into MetaMask on mainnet
- Never use these private keys with real funds

## 📞 Need Help?

If you still encounter issues:
1. Check that the blockchain node is running (look for the terminal output)
2. Verify MetaMask network settings match exactly
3. Try refreshing MetaMask and reconnecting
4. Restart your browser if needed
