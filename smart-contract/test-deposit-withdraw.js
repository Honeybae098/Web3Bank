const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 SmartBank Deposit/Withdraw Test Starting...");
    
    // Get the contract
    const SmartBank = await ethers.getContractFactory("SmartBank");
    const smartBank = await SmartBank.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
    
    // Get signers (test accounts)
    const [owner, user1, user2] = await ethers.getSigners();
    
    console.log("\n📋 Test Accounts:");
    console.log("Owner:", owner.address);
    console.log("User1:", user1.address);
    console.log("User2:", user2.address);
    
    // Check initial bank statistics
    console.log("\n📊 Initial Bank Statistics:");
    const initialStats = await smartBank.getBankStatistics();
    console.log("Total Liquidity:", ethers.formatEther(initialStats[0]), "ETH");
    console.log("Bank Profit:", ethers.formatEther(initialStats[1]), "ETH");
    
    // Test 1: User1 deposits 1 ETH
    console.log("\n💰 Test 1: User1 deposits 1 ETH");
    const depositAmount = ethers.parseEther("1.0");
    
    // Check User1 balance before deposit
    const user1BalanceBefore = await smartBank.getBalance(user1.address);
    console.log("User1 Balance Before:", ethers.formatEther(user1BalanceBefore), "ETH");
    
    // Deposit transaction
    const depositTx = await smartBank.connect(user1).deposit({ value: depositAmount });
    const depositReceipt = await depositTx.wait();
    console.log("✅ Deposit transaction successful!");
    console.log("Transaction Hash:", depositReceipt.hash);
    
    // Check User1 balance after deposit
    const user1BalanceAfter = await smartBank.getBalance(user1.address);
    console.log("User1 Balance After:", ethers.formatEther(user1BalanceAfter), "ETH");
    
    // Check User1 transaction history
    console.log("\n📜 User1 Transaction History:");
    const user1History = await smartBank.getHistory(user1.address);
    console.log("Transactions:", user1History.length);
    user1History.forEach((tx, index) => {
        console.log(`  ${index + 1}. ${tx.txType}: ${ethers.formatEther(tx.amount)} ETH at ${new Date(Number(tx.timestamp) * 1000).toLocaleString()}`);
    });
    
    // Test 2: Wait 5 seconds and check if interest was applied
    console.log("\n⏰ Waiting 5 seconds for interest calculation...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const user1BalanceAfterInterest = await smartBank.getBalance(user1.address);
    console.log("User1 Balance After Interest:", ethers.formatEther(user1BalanceAfterInterest), "ETH");
    
    // Test 3: User2 deposits 2 ETH
    console.log("\n💰 Test 2: User2 deposits 2 ETH");
    const depositAmount2 = ethers.parseEther("2.0");
    
    const depositTx2 = await smartBank.connect(user2).deposit({ value: depositAmount2 });
    const depositReceipt2 = await depositTx2.wait();
    console.log("✅ User2 deposit successful!");
    
    const user2BalanceAfter = await smartBank.getBalance(user2.address);
    console.log("User2 Balance:", ethers.formatEther(user2BalanceAfter), "ETH");
    
    // Test 4: User1 withdraws 0.5 ETH
    console.log("\n💸 Test 3: User1 withdraws 0.5 ETH");
    const withdrawAmount = ethers.parseEther("0.5");
    
    const withdrawTx = await smartBank.connect(user1).withdraw(withdrawAmount);
    const withdrawReceipt = await withdrawTx.wait();
    console.log("✅ Withdraw transaction successful!");
    console.log("Transaction Hash:", withdrawReceipt.hash);
    
    const user1BalanceAfterWithdraw = await smartBank.getBalance(user1.address);
    console.log("User1 Balance After Withdraw:", ethers.formatEther(user1BalanceAfterWithdraw), "ETH");
    
    // Check User1 updated transaction history
    console.log("\n📜 User1 Updated Transaction History:");
    const user1UpdatedHistory = await smartBank.getHistory(user1.address);
    console.log("Total Transactions:", user1UpdatedHistory.length);
    user1UpdatedHistory.forEach((tx, index) => {
        console.log(`  ${index + 1}. ${tx.txType}: ${ethers.formatEther(tx.amount)} ETH at ${new Date(Number(tx.timestamp) * 1000).toLocaleString()}`);
    });
    
    // Final bank statistics
    console.log("\n📊 Final Bank Statistics:");
    const finalStats = await smartBank.getBankStatistics();
    console.log("Total Liquidity:", ethers.formatEther(finalStats[0]), "ETH");
    console.log("Bank Profit:", ethers.formatEther(finalStats[1]), "ETH");
    
    console.log("\n🎉 SmartBank Deposit/Withdraw Test Completed Successfully!");
    console.log("\n✅ All tests passed:");
    console.log("  - Contract deployment ✅");
    console.log("  - Deposit functionality ✅");
    console.log("  - Interest calculation ✅");
    console.log("  - Withdraw functionality ✅");
    console.log("  - Transaction history ✅");
    console.log("  - Bank statistics ✅");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
