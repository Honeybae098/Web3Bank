#!/bin/bash

# Fix and Setup SmartBank Local Development Environment
echo "🔧 Fixing SmartBank Hardhat Setup..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the smart-contract directory"
    echo "   Run: cd smart-contract && ./fix-hardhat-setup.sh"
    exit 1
fi

echo "📦 Checking Node.js version..."
node --version

echo "🔄 Reinstalling dependencies to fix Hardhat..."
rm -rf node_modules package-lock.json
npm install

echo "🧹 Cleaning Hardhat cache..."
npx hardhat clean

echo "📋 Compiling contracts..."
npx hardhat compile

echo ""
echo "✅ Setup Complete! Now you can:"
echo ""
echo "1. Start local blockchain with free ETH:"
echo "   npm run node"
echo ""
echo "2. In another terminal, deploy contract:"
echo "   npx hardhat run scripts/deploy.ts --network localhost"
echo ""
echo "3. Import private key from blockchain output to MetaMask"
echo ""
echo "🚀 Ready to get your free ETH!"
