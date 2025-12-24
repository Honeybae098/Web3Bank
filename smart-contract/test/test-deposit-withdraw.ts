import { ethers } from "hardhat";
import { expect } from "chai";

describe("SmartBank Contract", function () {
  let smartBank: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    const SmartBank = await ethers.getContractFactory("SmartBank");
    smartBank = await SmartBank.deploy();
    await smartBank.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await smartBank.getAddress()).to.be.properAddress;
  });

  it("Should allow deposits", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // User1 deposits 1 ETH
    await expect(smartBank.connect(user1).deposit({ value: depositAmount }))
      .to.emit(smartBank, "Deposit");

    // Check balance
    const balance = await smartBank.getBalance(user1.address);
    expect(balance).to.equal(depositAmount);
  });

  it("Should allow withdrawals", async function () {
    const depositAmount = ethers.parseEther("2.0");
    const withdrawAmount = ethers.parseEther("1.0");

    // User1 deposits 2 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });

    // User1 withdraws 1 ETH
    await expect(smartBank.connect(user1).withdraw(withdrawAmount))
      .to.emit(smartBank, "Withdraw");

    // Check balance
    const balance = await smartBank.getBalance(user1.address);
    expect(balance).to.equal(depositAmount - withdrawAmount);
  });

  it("Should calculate and pay interest", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // User1 deposits 1 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });
    
    const balanceBefore = await smartBank.getBalance(user1.address);
    
    // Wait 10 seconds for interest calculation
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Trigger interest calculation by making a transaction
    await smartBank.connect(user1).deposit({ value: 0 });
    
    const balanceAfter = await smartBank.getBalance(user1.address);
    expect(balanceAfter).to.be.greaterThan(balanceBefore);
  });

  it("Should record transaction history", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // User1 deposits 1 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });
    
    // Check transaction history
    const history = await smartBank.getHistory(user1.address);
    expect(history.length).to.equal(1);
    expect(history[0].txType).to.equal("Deposit");
    expect(history[0].amount).to.equal(depositAmount);
  });

  it("Should provide correct bank statistics", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // User1 deposits 1 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });
    
    const stats = await smartBank.getBankStatistics();
    expect(stats[0]).to.equal(depositAmount); // Total liquidity
    expect(stats[1]).to.equal(0); // Bank profit (no interest yet)
  });

  it("Should prevent withdrawals with insufficient balance", async function () {
    const depositAmount = ethers.parseEther("1.0");
    const withdrawAmount = ethers.parseEther("2.0");
    
    // User1 deposits 1 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });
    
    // Try to withdraw more than balance
    await expect(smartBank.connect(user1).withdraw(withdrawAmount))
      .to.be.revertedWith("Insufficient account balance");
  });

  it("Should allow owner to withdraw fees", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // User1 deposits 1 ETH
    await smartBank.connect(user1).deposit({ value: depositAmount });
    
    // Wait for interest to accrue
    await new Promise(resolve => setTimeout(resolve, 10000));
    await smartBank.connect(user1).deposit({ value: 0 }); // Trigger interest
    
    const statsBefore = await smartBank.getBankStatistics();
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    
    // Owner withdraws fees
    await smartBank.connect(owner).withdrawFees();
    
    const statsAfter = await smartBank.getBankStatistics();
    expect(statsAfter[1]).to.be.lessThan(statsBefore[1]); // Bank profit decreased
  });

  it("Should emit events for all transactions", async function () {
    const depositAmount = ethers.parseEther("1.0");
    
    // Test Deposit event
    await expect(smartBank.connect(user1).deposit({ value: depositAmount }))
      .to.emit(smartBank, "Deposit");
    
    // Wait and trigger interest
    await new Promise(resolve => setTimeout(resolve, 5000));
    await smartBank.connect(user1).deposit({ value: 0 });
    
    // Test Withdraw event
    await expect(smartBank.connect(user1).withdraw(ethers.parseEther("0.5")))
      .to.emit(smartBank, "Withdraw");
  });
});
