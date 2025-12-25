const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting SmartBank deployment to Sepolia testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.getBalance()), "ETH");
  
  // Deploy SmartBank contract
  const SmartBank = await ethers.getContractFactory("SmartBank");
  console.log("⛓️ Deploying SmartBank contract...");
  
  const smartBank = await SmartBank.deploy();
  await smartBank.waitForDeployment();
  
  const contractAddress = await smartBank.getAddress();
  console.log("✅ SmartBank deployed to:", contractAddress);
  console.log("🔗 Etherscan URL: https://sepolia.etherscan.io/address/" + contractAddress);
  
  // Get deployment info
  console.log("\n📊 Deployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network: Sepolia (Chain ID: 11155111)");
  console.log("Transaction Hash:", smartBank.deploymentTransaction().hash);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: "sepolia",
    chainId: 11155111,
    deploymentHash: smartBank.deploymentTransaction().hash,
    blockNumber: (await smartBank.deploymentTransaction().wait()).blockNumber,
    timestamp: new Date().toISOString()
  };
  
  console.log("\n💾 Save this deployment info for Front-End configuration:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Test contract deployment
  console.log("\n🧪 Testing contract deployment...");
  try {
    const bankStats = await smartBank.getBankStatistics();
    console.log("✅ Contract is working! Bank statistics:", {
      totalLiquidity: ethers.formatEther(bankStats[0]),
      bankProfit: ethers.formatEther(bankStats[1])
    });
  } catch (error) {
    console.log("❌ Contract test failed:", error.message);
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("1. Verify the contract on Etherscan");
  console.log("2. Update Front-End config with this contract address");
  console.log("3. Test the Web3 integration");
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
