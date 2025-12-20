import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", function () {
  it("should increment counter", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    await counter.inc();
    expect(await counter.x()).to.equal(1);
  });
});
