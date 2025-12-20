# Security Scope of SmartBank

---

## 1. Smart Contract Security (Main Scope)

### What it is  
Smart contract security focuses on protecting Solidity code from vulnerabilities that could lead to loss of funds, incorrect behavior, or exploits.

### Tools Used  
- OpenZeppelin Security Libraries  
- Solidity security patterns  
- Hardhat testing framework  
- Slither static analysis tool  

### Why Used  
Smart contracts are immutable after deployment. Any vulnerability cannot be easily fixed and may result in permanent fund loss.

### Benefits  
- Prevents common blockchain attacks  
- Ensures correct logic before deployment  
- Increases trust and reliability  

### Limitations  
- Does not replace a professional audit  
- Focuses only on contract-level logic  

---

## 2. Reentrancy Protection

### What it is  
Reentrancy protection prevents attackers from repeatedly calling a function before the previous execution finishes.

### Tool Used  
**OpenZeppelin ReentrancyGuard**

### Why Used  
Reentrancy is a security attack in smart contracts where:
A contract is tricked into calling the same function again before it finishes the first time
This allows an attacker to withdraw money multiple times.

You go to a bank
You ask to withdraw $100
The bank gives you the money
BUT the bank updates your balance after
Before the balance updates, you quickly say: “Withdraw again!”
You get paid twice
That’s reentrancy

# Reentrancy: Unsafe vs Safe
##  Unsafe Contract
withdraw()
├─ check balance
├─ send ETH ❌
│ └─ attacker re-enters
└─ update balance (too late)


```solidity
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool sent, ) = msg.sender.call{value: amount}("");
    require(sent);
    balances[msg.sender] -= amount;
}
Issue: ETH sent before state update → multiple withdrawals possible.

```
##  Unsafe Contract
scss
Copy code
withdraw()
├─ check balance
├─ update balance ✅
├─ lock (nonReentrant) 🔒
└─ send ETH

````solidity
function withdraw(uint amount) external nonReentrant {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}
Fix: Update state first + reentrancy lock.
````

### How It Was Applied  
- The contract inherits `ReentrancyGuard`
- The `withdraw()` function is protected using `nonReentrant`

### Benefits  
- Prevents recursive withdrawal attacks  
- Protects user funds  

### Limitations  
- Only protects functions explicitly marked with `nonReentrant`  

---

## 3. Input Validation and Safe Logic Flow

### What it is  
Ensuring user inputs are valid and state changes are handled safely.

### Tools Used  
- `require()` statements  
- Checks–Effects–Interactions pattern  

### Why Used  
Prevents invalid operations such as zero-value withdrawals or over-withdrawing funds.

### Benefits  
- Prevents balance underflow  
- Ensures predictable contract behavior  

---

## 4. Automated Testing (Dynamic Security)

### What it is  
Testing the contract by simulating real blockchain usage.

### Tool Used  
**Hardhat + Chai**

### Why Used  
To verify correct behavior and prevent logic bugs before deployment.

### Tests Included  
- ETH deposit  
- ETH withdrawal  
- Over-withdraw prevention  
- Zero-withdraw prevention  

### Benefits  
- Detects bugs early  
- Reproducible and automated  
- Improves confidence before deployment  

### Limitations  
- Only covers tested scenarios  
- Cannot guarantee absence of all bugs  

---

## 5. Static Analysis

### What it is  
Analyzing smart contract code without executing it.

### Tool Used  
**Slither**

### Why Used  
To detect hidden vulnerabilities and unsafe patterns that testing might miss.

### How It Was Used  
- Scanned `SmartBank.sol`
- Reviewed all warnings
- Fixed relevant suggestions (e.g., immutable owner)
- Documented accepted risks

### Benefits  
- Industry-standard security tool  
- Improves code quality  
- Identifies potential vulnerabilities  

### Limitations  
- Can report false positives  
- Does not understand business logic  
- Some warnings are informational only  

---

## 6. Solidity Compiler Safety

### What it is  
Built-in safety checks provided by the Solidity compiler.

### Tool Used  
**Solidity version 0.8.x**

### Why Used  
Solidity 0.8+ includes automatic overflow and underflow protection.

### Benefits  
- Safer arithmetic operations  
- No need for SafeMath library  

### Limitations  
- Does not prevent logical design errors  

---

## Final Summary

The security scope of SmartBank focuses on smart contract–level protection using a combination of secure libraries, automated testing, and static analysis. While this approach does not replace a professional audit, it follows industry best practices and is suitable for educational and testnet deployment.
