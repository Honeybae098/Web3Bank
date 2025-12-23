// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract SmartBank is 
    Initializable, 
    UUPSUpgradeable, 
    OwnableUpgradeable, 
    ReentrancyGuardUpgradeable 
{
    // STORAGE
    mapping(address => uint256) private balances;
    mapping(address => uint256) public lastInterestCalculationTime;
    uint256 public totalTreasuryFees; // Bank's accumulated profit

    struct Transaction {
        string txType;
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => Transaction[]) private userHistory;

    // EVENTS for Web3 Authentication & Multi-User Design
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);
    event InterestPaid(address indexed user, uint256 amount, uint256 timestamp);

    // Constants
    uint256 public constant INTEREST_RATE_BP = 500;  // 5% 
    uint256 public constant PERFORMANCE_FEE_BP = 1000; // 10% of earned interest
    uint256 public constant BASE_RATE_FACTOR = 10000; // Performance Fee: fee from withdraw amount (cut 10%)
    uint256 public constant SECONDS_IN_YEAR = 31536000;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}


    // CORE FEATURES
    /// DEPOSIT FEATURE
    function deposit() public payable {
        require(msg.value > 0, "Zero deposit");
        _applyInterest(msg.sender);
        
        balances[msg.sender] += msg.value;
        _recordTransaction(msg.sender, "Deposit", msg.value);
        
        // Emit event for Web3 transaction history
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }


    /// WITHDRAW FEATURE
    function withdraw(uint256 amount) public nonReentrant {
        _applyInterest(msg.sender);
        
        // Check user has enough in their virtual account
        require(balances[msg.sender] >= amount, "Insufficient account balance");

        // Check contract has enough physical ETH (Liquidity Guard)
        require(address(this).balance >= amount, "Bank Liquidity Error: Contact Admin");

        // Update state
        balances[msg.sender] -= amount;
        _recordTransaction(msg.sender, "Withdraw", amount);

        // Transfer
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // Emit event for Web3 transaction history
        emit Withdraw(msg.sender, amount, block.timestamp);
    }


    /// APPLY INTEREST
    function _applyInterest(address user) internal {
        uint256 currentTime = block.timestamp;
        uint256 lastTime = lastInterestCalculationTime[user];

        if (balances[user] > 0 && lastTime > 0) {
            uint256 timePassed = currentTime - lastTime;
            
            // Raw interest calculation
            uint256 totalInterest = (balances[user] * INTEREST_RATE_BP * timePassed) / 
                                    (BASE_RATE_FACTOR * SECONDS_IN_YEAR);

            if (totalInterest > 0) {
                // Calculate bank's cut (Performance Fee)
                uint256 bankCut = (totalInterest * PERFORMANCE_FEE_BP) / BASE_RATE_FACTOR;
                uint256 userShare = totalInterest - bankCut;

                balances[user] += userShare;
                totalTreasuryFees += bankCut; // Store the fee in the treasury

                _recordTransaction(user, "Interest Earned", userShare);
                
                // Emit event for Web3 transaction history
                emit InterestPaid(user, userShare, currentTime);
            }
        }
        lastInterestCalculationTime[user] = currentTime;
    }

    /// RECORD TRANSACTION FUNCTION
    function _recordTransaction(address user, string memory _type, uint256 _amount) internal {
        userHistory[user].push(Transaction(_type, _amount, block.timestamp));
    }

    

    // VIEW FUNCTIONS
    function getBankStatistics() external view returns (uint256 totalLiquidity, uint256 bankProfit) {
        return (address(this).balance, totalTreasuryFees);
    }

    function getHistory(address user) external view returns (Transaction[] memory) {
        return userHistory[user];
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    // Admin can withdraw the profit (fees) without touching user deposits
    function withdrawFees() external onlyOwner {
        uint256 amount = totalTreasuryFees;
        totalTreasuryFees = 0;
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
}