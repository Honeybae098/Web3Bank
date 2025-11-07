import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { artifacts } from "hardhat";

async function main() {
  const localRpcUrl = "http://127.0.0.1:8545";

  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const account = privateKeyToAccount(privateKey);

  // Minimal local Hardhat chain definition
  const hardhatLocalChain = {
    id: 31337,
    name: "Hardhat Local",
    network: "hardhat",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: [localRpcUrl] },
    },
  } as const;

  const publicClient = createPublicClient({
    chain: hardhatLocalChain,
    transport: http(localRpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: hardhatLocalChain,
    transport: http(localRpcUrl),
  });

  const { abi, bytecode } = await artifacts.readArtifact("Counter");

  console.log("Deploying Counter contract to local Hardhat node...");

  const txHash = await walletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    account,
    args: [], // constructor args
    chain: hardhatLocalChain, // chain is required here
  });

  console.log("Transaction hash:", txHash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Counter deployed at address:", receipt.contractAddress);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
