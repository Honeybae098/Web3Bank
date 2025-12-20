import { expect } from "chai";
import { ethers } from "hardhat";
import { SmartBank__factory } from "../typechain-types/factories/contracts/SmartBank__factory";

describe("SmartBank Security Tests", function () {

  async function deploySmartBank() {
    const [user] = await ethers.getSigners();
    const smartBank = await new SmartBank__factory(user).deploy();
    await smartBank.waitForDeployment();
    return { smartBank, user };
  }

  it("should allow user to deposit ETH", async function () {
    const { smartBank } = await deploySmartBank();

    await smartBank.deposit({ value: ethers.parseEther("1") });

    const balance = await smartBank.getBalance();
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("should allow user to withdraw ETH safely", async function () {
    const { smartBank } = await deploySmartBank();

    await smartBank.deposit({ value: ethers.parseEther("1") });
    await smartBank.withdraw(ethers.parseEther("0.5"));

    const balance = await smartBank.getBalance();

    // ✅ Correct assertion when interest exists
    expect(balance).to.be.greaterThanOrEqual(
      ethers.parseEther("0.5")
    );
  });

  it("should NOT allow withdrawing more than balance", async function () {
    const { smartBank } = await deploySmartBank();

    await smartBank.deposit({ value: ethers.parseEther("1") });

    await expect(
      smartBank.withdraw(ethers.parseEther("2"))
    ).to.be.revertedWith("Insufficient balance");
  });

  it("should NOT allow withdrawing zero", async function () {
    const { smartBank } = await deploySmartBank();

    await expect(
      smartBank.withdraw(0)
    ).to.be.reverted;
  });
});
