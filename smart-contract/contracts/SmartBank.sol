// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/*
  We use ReentrancyGuard from OpenZeppelin
  to protect withdraw() from reentrancy attacks
*/
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SmartBank is ReentrancyGuard {

    /* -------------------------
        STORAGE
    --------------------------*/

    // Store ETH balance for each user
    mapping(address => uint256) private balances;

    // Store last time interest was calculated for each user
    mapping(address => uint256) public lastInterestCalculationTime;

    // Contract owner (used only for emergency rescue)
    // UPDATED: declared immutable (Slither suggestion)
    address public immutable owner;

    /* -------------------------
        INTEREST SETTINGS
    --------------------------*/

    // Interest rate in basis points (500 = 5%)
    uint256 public constant INTEREST_RATE_BP = 500;

    // 10000 = 100% (basis point calculation)
    uint256 public constant BASE_RATE_FACTOR = 10000;

    /* -------------------------
        EVENTS (for transparency)
    --------------------------*/

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event InterestApplied(
        address indexed user,
        uint256 principal,
        uint256 interestAmount
    );

    /* -------------------------
        MODIFIERS
    --------------------------*/

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /* -------------------------
        CONSTRUCTOR
    --------------------------*/

    constructor() {
        owner = msg.sender;
    }

    /* -------------------------
        DEPOSIT FUNCTION
    --------------------------*/

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than zero");

        _applyInterest(msg.sender);
        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    /* -------------------------
        WITHDRAW FUNCTION
    --------------------------*/

    function withdraw(uint256 amount) public nonReentrant {
        require(amount > 0, "Invalid withdraw amount");

        _applyInterest(msg.sender);
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdraw(msg.sender, amount);
    }

    /* -------------------------
        VIEW FUNCTION
    --------------------------*/

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    /* -------------------------
        INTEREST LOGIC
    --------------------------*/

    function _applyInterest(address user) internal {
        uint256 currentTime = block.timestamp;
        uint256 lastTime = lastInterestCalculationTime[user];

        if (balances[user] > 0 && lastTime > 0 && currentTime > lastTime) {
            uint256 principal = balances[user];

            uint256 interestAmount =
                (principal * INTEREST_RATE_BP) /
                BASE_RATE_FACTOR /
                365;

            balances[user] += interestAmount;

            emit InterestApplied(user, principal, interestAmount);
        }

        lastInterestCalculationTime[user] = currentTime;
    }

    /* -------------------------
        EMERGENCY FUNCTION
    --------------------------*/

    function rescueEther(uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Not enough ETH");

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Rescue failed");
    }

    /* -------------------------
        RECEIVE ETH
    --------------------------*/

    receive() external payable {
        deposit();
    }
}
