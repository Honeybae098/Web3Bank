#!/bin/bash

# SmartBank Local Development Setup Script
# This script sets up everything needed for local blockchain development

echo "🚀 Setting up SmartBank Local Development Environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the smart-contract directory"
    echo "   Run: cd smart-contract && ./setup-local-dev.sh"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up Hardhat..."
npx hardhat compile

echo "🌐 Starting local blockchain..."
echo "   - This will start a local Ethereum network"
echo "   - Free ETH will be available for testing"
echo "   - Default RPC: http://127.0.0.1:8545"
echo "   - Chain ID: 31337"
echo ""
echo "Press Ctrl+C to stop the blockchain when done testing"
echo ""

# Start the local blockchain
npx hardhat node
