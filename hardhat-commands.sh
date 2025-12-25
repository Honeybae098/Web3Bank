#!/bin/bash

# Hardhat Commands Helper Script
# Usage: ./hardhat-commands.sh [compile|deploy|test|node]

case "$1" in
  "compile")
    echo "📋 Compiling contracts..."
    cd smart-contract && npx hardhat compile
    ;;
  "deploy")
    echo "🚀 Deploying SmartBank contract..."
    cd smart-contract && npx hardhat run scripts/deploy.js --network localhost
    ;;
  "test")
    echo "🧪 Running tests..."
    cd smart-contract && npx hardhat test
    ;;
  "node")
    echo "⛓️ Starting local Hardhat node..."
    cd smart-contract && npx hardhat node
    ;;
  *)
    echo "Usage: $0 [compile|deploy|test|node]"
    echo ""
    echo "Available commands:"
    echo "  compile  - Compile smart contracts"
    echo "  deploy   - Deploy SmartBank contract to localhost"
    echo "  test     - Run test suite"
    echo "  node     - Start local Hardhat blockchain node"
    ;;
esac

