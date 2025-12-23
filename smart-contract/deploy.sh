#!/bin/bash

# SmartBank Contract Deployment Script
# Deploy SmartBank to local blockchain and get contract address

echo "🚀 Deploying SmartBank Contract..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Running npm install first..."
    npm install
fi

# Compile contracts
echo "🔧 Compiling SmartBank contracts..."
npx hardhat compile

# Deploy contract
echo "📦 Deploying SmartBank to local network..."
npx hardhat run scripts/deploy.ts --network localhost

echo ""
echo "✅ Contract deployed successfully!"
echo "📋 Next steps:"
echo "1. Copy the contract address from the output above"
echo "2. Update Front-End/src/contexts/Web3Context.jsx with the contract address"
echo "3. Add 'localhost' to the CONTRACT_ADDRESSES object"
echo "4. Test the application with MetaMask connected to localhost"
echo ""
echo "🔗 MetaMask setup:"
echo "   Network: Localhost 8545"
echo "   RPC URL: http://127.0.0.1:8545"
echo "   Chain ID: 31337"
echo "   Currency Symbol: ETH"
