require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./smart-contract/contracts", // Hardhat looks here for your .sol files
    artifacts: "./artifacts",
    cache: "./cache",
  }
};