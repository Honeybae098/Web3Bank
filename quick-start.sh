#!/bin/bash

# SmartBank Quick Start Script
# Sets up local development with free ETH and MetaMask

echo "🚀 SmartBank Local Development Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${YELLOW}Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "smart-contract" ] || [ ! -d "Front-End" ]; then
    print_error "Please run this script from the smartbank root directory"
    exit 1
fi

print_step "1" "Checking dependencies..."
cd smart-contract

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

print_step "2" "Compiling SmartBank contracts..."
npx hardhat compile
if [ $? -eq 0 ]; then
    print_success "Contracts compiled successfully"
else
    print_error "Failed to compile contracts"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next Steps:"
echo "1. Start local blockchain (NEW TERMINAL):"
echo "   cd smart-contract && npm run node"
echo ""
echo "2. Deploy contract (NEW TERMINAL):"
echo "   cd smart-contract && npx hardhat run scripts/deploy.ts --network localhost"
echo ""
echo "3. Update contract address in Front-End/src/config/SmartBankConfig.js"
echo ""
echo "4. Setup MetaMask:"
echo "   - Add network: Localhost 8545"
echo "   - RPC: http://127.0.0.1:8545"
echo "   - Chain ID: 31337"
echo "   - Import test account private key"
echo ""
echo "5. Test at http://localhost:3000"
echo ""
echo -e "${YELLOW}⚠️  Keep the blockchain terminal running during testing!${NC}"
