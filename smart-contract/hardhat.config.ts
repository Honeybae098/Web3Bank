import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      type: "http",                  // <-- REQUIRED
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: process.env.LOCALHOST_PRIVATE_KEY ? [process.env.LOCALHOST_PRIVATE_KEY] : [],
    },
    sepolia: {
      type: "http",                  // <-- REQUIRED
      url: process.env.SEPOLIA_RPC_URL || "",
      chainId: 11155111,
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};

export default config;
