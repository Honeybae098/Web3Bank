#!/bin/bash

# SmartBank Integration Testing Script
# This script helps you verify your frontend, MetaMask, and smart contract integration

echo "🔍 SmartBank Integration Verification Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "Step 1: Checking Prerequisites..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "smart-contract/hardhat.config.js" ] && [ ! -f "smart-contract/hardhat.config.ts" ]; then
    print_status 1 "SmartBank contract directory not found"
    exit 1
else
    print_status 0 "SmartBank contract directory found"
fi

# Check if frontend directory exists
if [ ! -d "Front-End" ]; then
    print_status 1 "Frontend directory not found"
    exit 1
else
    print_status 0 "Frontend directory found"
fi

echo ""
echo "Step 2: Checking Node.js Dependencies..."
echo "========================================"

# Check smart contract dependencies
if [ -f "smart-contract/package.json" ]; then
    cd smart-contract
    if [ -d "node_modules" ]; then
        print_status 0 "Smart contract dependencies installed"
    else
        print_warning "Installing smart contract dependencies..."
        npm install
        print_status $? "Smart contract dependencies installation"
    fi
    cd ..
else
    print_status 1 "Smart contract package.json not found"
fi

# Check frontend dependencies
if [ -f "Front-End/package.json" ]; then
    cd Front-End
    if [ -d "node_modules" ]; then
        print_status 0 "Frontend dependencies installed"
    else
        print_warning "Installing frontend dependencies..."
        npm install
        print_status $? "Frontend dependencies installation"
    fi
    cd ..
else
    print_status 1 "Frontend package.json not found"
fi

echo ""
echo "Step 3: Checking Contract Deployment..."
echo "======================================="

# Check if contract is deployed on localhost
cd smart-contract

# Try to get the contract address from deployment artifacts
if [ -f "artifacts/smart-contract/contracts/SmartBank.sol/SmartBank.json" ]; then
    echo "SmartBank contract artifacts found"
    
    # Check if we can get the deployed address
    if [ -f "deployment.json" ]; then
        DEPLOYED_ADDRESS=$(grep -o '"address": "[^"]*"' deployment.json | cut -d'"' -f4)
        if [ ! -z "$DEPLOYED_ADDRESS" ] && [ "$DEPLOYED_ADDRESS" != "0x0000000000000000000000000000000000000000" ]; then
            print_status 0 "SmartBank contract deployed at: $DEPLOYED_ADDRESS"
        else
            print_status 1 "SmartBank contract address not found or invalid"
        fi
    else
        print_warning "Deployment file not found. Contract may need to be deployed."
    fi
else
    print_status 1 "SmartBank contract artifacts not found"
fi

cd ..

echo ""
echo "Step 4: Testing Local Blockchain Setup..."
echo "========================================="

cd smart-contract

# Check if hardhat node is running
if lsof -i :8545 > /dev/null 2>&1; then
    print_status 0 "Hardhat local blockchain appears to be running (port 8545)"
else
    print_warning "Hardhat local blockchain not detected on port 8545"
    print_status 1 "Please start with: npx hardhat node"
fi

cd ..

echo ""
echo "Step 5: Frontend Configuration Check..."
echo "======================================="

# Check if frontend has Web3 integration files
if [ -f "Front-End/src/contexts/Web3Context.jsx" ]; then
    print_status 0 "Web3 context found"
else
    print_status 1 "Web3 context not found"
fi

if [ -f "Front-End/src/components/ConnectWallet.jsx" ]; then
    print_status 0 "Connect wallet component found"
else
    print_status 1 "Connect wallet component not found"
fi

if [ -f "Front-End/src/services/smartBankService.js" ]; then
    print_status 0 "SmartBank service found"
else
    print_status 1 "SmartBank service not found"
fi

echo ""
echo "Step 6: Package.json Scripts Check..."
echo "====================================="

# Check smart contract scripts
cd smart-contract
if grep -q '"deploy"' package.json; then
    print_status 0 "Deploy script found in smart contract"
else
    print_status 1 "Deploy script not found in smart contract"
fi

cd ..

# Check frontend scripts
cd Front-End
if grep -q '"start"' package.json; then
    print_status 0 "Start script found in frontend"
else
    print_status 1 "Start script not found in frontend"
fi

cd ..

echo ""
echo "Step 7: Testing Commands Summary..."
echo "==================================="
echo ""
echo "To test your integration, run these commands in order:"
echo ""
echo "1. Start local blockchain:"
echo "   cd smart-contract && npx hardhat node"
echo ""
echo "2. In another terminal, deploy contract:"
echo "   cd smart-contract && npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "3. In another terminal, start frontend:"
echo "   cd Front-End && npm start"
echo ""
echo "4. Open browser to http://localhost:3000"
echo ""
echo "5. Test the integration:"
echo "   - Click 'Connect Wallet' button"
echo "   - Approve MetaMask connection"
echo "   - Deposit test amount"
echo "   - Check balance updates"
echo "   - Withdraw test amount"
echo "   - Verify transaction history"
echo ""

echo "Step 8: Quick Health Check..."
echo "============================="

# Check if MetaMask extension might be detected (basic check)
if [ -f "Front-End/src/components/ConnectWallet.jsx" ]; then
    if grep -q "window.ethereum" "Front-End/src/components/ConnectWallet.jsx"; then
        print_status 0 "MetaMask detection code found in ConnectWallet component"
    else
        print_status 1 "MetaMask detection code not found in ConnectWallet component"
    fi
fi

# Check for Web3 context usage
if [ -f "Front-End/src/contexts/Web3Context.jsx" ]; then
    if grep -q "useWeb3" "Front-End/src/contexts/Web3Context.jsx"; then
        print_status 0 "Web3 context with useWeb3 hook found"
    else
        print_status 1 "Web3 context with useWeb3 hook not found"
    fi
fi

echo ""
echo "🎯 Integration Test Complete!"
echo "============================"
echo ""
echo "Next steps:"
echo "1. If all checks passed, start the development environment"
echo "2. If some checks failed, review the issues above"
echo "3. Follow the INTEGRATION_VERIFICATION_GUIDE.md for detailed testing"
echo ""
echo "Good luck with your SmartBank integration! 🚀"
