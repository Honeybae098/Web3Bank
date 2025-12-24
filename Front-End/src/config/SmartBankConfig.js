// SmartBank Contract ABI
import { ethers } from 'ethers';
export const SmartBankABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "INTEREST_RATE_BP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PERFORMANCE_FEE_BP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SECONDS_IN_YEAR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BASE_RATE_FACTOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTreasuryFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "lastInterestCalculationTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "receive",
    "value": 0
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "txType",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct SmartBank.Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBankStatistics",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalLiquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bankProfit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "InterestPaid",
    "type": "event"
  }
];

// Contract addresses - Updated after successful deployment
export const CONTRACT_ADDRESSES = {
  localhost: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // Deployed SmartBank contract
  // sepolia: '0x0000000000000000000000000000000000000000', // Replace with actual address
  mainnet: '0x0000000000000000000000000000000000000000'   // When ready for mainnet
};

// Network configurations
export const NETWORK_CONFIGS = {
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: null
  }
  // sepolia: {
  //   chainId: 11155111,
  //   name: 'Sepolia',
  //   rpcUrl: 'https://rpc.sepolia.org',
  //   explorer: 'https://sepolia.etherscan.io'
  // },
  // mainnet: {
  //   chainId: 1,
  //   name: 'Ethereum',
  //   rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  //   explorer: 'https://etherscan.io'
  // }
};

// Contract constants
export const CONTRACT_CONSTANTS = {
  MIN_DEPOSIT_AMOUNT: ethers.parseEther('0.001'), // 0.001 ETH
  INTEREST_RATE_BP: 500, // 5%
  PERFORMANCE_FEE_BP: 1000, // 10%
  SECONDS_IN_YEAR: 31536000,
  BASE_RATE_FACTOR: 10000
};

// Transaction types
export const TX_TYPES = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw',
  INTEREST: 'InterestPaid'
};

// Utility functions for contract interactions
export const SmartBankUtils = {
  /**
   * Format transaction type for display
   */
  formatTransactionType: (txType) => {
    const typeMap = {
      'Deposit': 'Deposit',
      'Withdraw': 'Withdrawal', 
      'InterestPaid': 'Interest Payment'
    };
    return typeMap[txType] || txType;
  },

  /**
   * Calculate time passed for interest calculation
   */
  calculateTimePassed: (lastTime, currentTime) => {
    return Math.floor((currentTime - lastTime) / 31536000); // Years
  },

  /**
   * Format balance for display
   */
  formatBalance: (balance) => {
    return ethers.formatEther(balance);
  },

  /**
   * Format timestamp to readable date
   */
  formatTimestamp: (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  },

  /**
   * Validate deposit amount
   */
  isValidDepositAmount: (amount) => {
    try {
      const parsedAmount = ethers.parseEther(amount.toString());
      return parsedAmount >= CONTRACT_CONSTANTS.MIN_DEPOSIT_AMOUNT;
    } catch {
      return false;
    }
  }
};
