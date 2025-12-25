#!/bin/bash
# SmartBank Emergency Reset Script

echo "🆘 SmartBank Emergency Reset"
echo "==========================="

echo "Step 1: Stopping current processes..."
# Kill any existing processes
pkill -f "npm run node"
pkill -f "react-scripts start"

echo "Step 2: Cleaning caches..."
cd /Users/macbook/smartbank
rm -rf Front-End/node_modules/.cache
rm -rf smart-contract/cache
rm -rf smart-contract/artifacts

echo "Step 3: Restarting blockchain..."
cd smart-contract
npm run node > /dev/null 2>&1 &
BLOCKCHAIN_PID=$!

echo "Step 4: Waiting for blockchain to start..."
sleep 5

echo "Step 5: Redeploying contract..."
npx hardhat run scripts/deploy.js --network localhost > /dev/null 2>&1

echo "Step 6: Starting frontend..."
cd ../Front-End
npm start > /dev/null 2>&1 &

echo "Step 7: Waiting for frontend..."
sleep 10

echo "✅ Reset Complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "⛓️  Blockchain: http://127.0.0.1:8545"
echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:3000"
echo "2. Hard refresh browser (Ctrl+Shift+R)"
echo "3. Connect MetaMask to Localhost 8545"
echo "4. Import test account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo "5. Test deposit of 0.01 ETH"
