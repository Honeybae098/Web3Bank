const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Starting SmartBank Upgradeable Contract Deployment...");
  
  // Get the contract factory
  const SmartBank = await ethers.getContractFactory("SmartBank");
  console.log("📋 Contract factory loaded");
  
  // Deploy as upgradeable proxy
  console.log("⛏️  Deploying SmartBank as upgradeable proxy...");
  const smartBank = await upgrades.deployProxy(SmartBank, {
    initializer: "initialize",
    kind: "uups",
  });
  
  // Wait for deployment to complete
  await smartBank.waitForDeployment();
  
  // Get the deployed contract address
  const contractAddress = await smartBank.getAddress();
  
  console.log("✅ SmartBank upgradeable proxy deployed successfully!");
  console.log("📍 Proxy Address:", contractAddress);
  console.log("🔗 Network: localhost (127.0.0.1:8545)");
  
  // Optional: Verify contract is working by calling a view function
  try {
    const bankStats = await smartBank.getBankStatistics();
    console.log("🧪 Contract test successful:");
    console.log("   - Total Liquidity:", ethers.formatEther(bankStats[0]), "ETH");
    console.log("   - Bank Profit:", ethers.formatEther(bankStats[1]), "ETH");
  } catch (error) {
    console.log("⚠️  Contract deployed but initial test failed:", error.message);
  }
  
  console.log("🎉 Deployment complete! Use this address in your frontend:");
  console.log(`SmartBank Contract: "${contractAddress}"`);
  console.log("🔧 This contract is upgradeable using UUPS pattern");
  
  return {
    contractAddress,
    transactionHash: smartBank.deploymentTransaction().hash
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("\n🎯 Deployment Summary:");
    console.log("Proxy Address:", result.contractAddress);
    console.log("Transaction Hash:", result.transactionHash);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
