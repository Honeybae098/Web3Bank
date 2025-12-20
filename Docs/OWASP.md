# OWASP Smart Contract Top 10 (2025) – SmartBank Coverage

This document maps the OWASP Smart Contract Top 10 (2025) risks against the SmartBank project, indicating which risks have been addressed, partially addressed, or are not applicable based on the project scope.

---

## SC01:2025 – Access Control Vulnerabilities  
**Status:** ✅ Applied  

**Implementation:**  
- Owner-restricted function using `onlyOwner` modifier  
- Users can only withdraw their own balances using `msg.sender`

**Reason:**  
Prevents unauthorized access to sensitive contract functions such as emergency ETH rescue.

---

## SC02:2025 – Price Oracle Manipulation  
**Status:** ❌ Not Applicable  

**Reason:**  
- SmartBank does not use price oracles  
- No dependency on external price feeds (ETH/USD)

---

## SC03:2025 – Logic Errors  
**Status:** ✅ Applied  

**Implementation:**  
- Business logic validated through Hardhat automated tests  
- Deposit, withdraw, and balance updates verified

**Reason:**  
Prevents incorrect balance calculations and unexpected fund behavior.

---

## SC04:2025 – Lack of Input Validation  
**Status:** ✅ Done  

**Implementation:**  
- `require(msg.value > 0)`  
- `require(amount > 0)`  
- `require(balances[msg.sender] >= amount)`

**Reason:**  
Ensures only valid deposits and withdrawals are allowed.

---

## SC05:2025 – Reentrancy Attacks  
**Status:** ✅ Done  

**Implementation:**  
- OpenZeppelin `ReentrancyGuard`  
- `nonReentrant` modifier on `withdraw()`

**Reason:**  
Prevents recursive calls that could drain contract funds.

---

## SC06:2025 – Unchecked External Calls  
**Status:** ⚠️ Partially Applied  

**Implementation:**  
- ETH transfers use low-level `call`  
- Transfer success is checked with `require(success)`

**Reason:**  
External calls are validated, but low-level calls still require careful handling.

---

## SC07:2025 – Flash Loan Attacks  
**Status:** ❌ Not Applicable  

**Reason:**  
- No lending or borrowing logic  
- No dependency on same-block price manipulation

---

## SC08:2025 – Integer Overflow and Underflow  
**Status:** ✅ Applied  

**Implementation:**  
- Solidity version `^0.8.x` with built-in overflow protection

**Reason:**  
Prevents arithmetic vulnerabilities without requiring SafeMath.

---

## SC09:2025 – Insecure Randomness  
**Status:** ❌ Not Applicable  

**Reason:**  
- No randomness used in SmartBank  
- No lotteries or random reward mechanisms

---

## SC10:2025 – Denial of Service (DoS) Attacks  
**Status:** ⚠️ Partially Applied  

**Implementation:**  
- Uses `call` instead of `transfer` to avoid gas limit issues

**Limitation:**  
- Large-scale usage could still introduce gas-related DoS risks  
- Acceptable for educational and testnet scope

---

## Summary Table

| ID | Risk Category | Status |
|----|--------------|--------|
| SC01 | Access Control | ✅ Applied |
| SC02 | Oracle Manipulation | ❌ Not Applicable |
| SC03 | Logic Errors | ✅ Applied |
| SC04 | Input Validation | ✅ Done |
| SC05 | Reentrancy | ✅ Done |
| SC06 | External Calls | ⚠️ Partial |
| SC07 | Flash Loans | ❌ Not Applicable |
| SC08 | Overflow / Underflow | ✅ Applied |
| SC09 | Randomness | ❌ Not Applicable |
| SC10 | DoS Attacks | ⚠️ Partial |

---
