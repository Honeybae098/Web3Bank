# ESLint Errors Fix Plan

## Issues Identified:

### Deposit.jsx Errors:
1. **Line 9**: `'provider'` and `'signer'` are assigned but never used
   - **Root Cause**: Variables destructured from useWeb3 but not used in component
   
2. **Line 20, 41**: React Hook useEffect has missing dependency: `'loadBalance'`
   - **Root Cause**: `loadBalance` function referenced in dependency array but not included

### Withdraw.jsx Errors:
1. **Line 9**: `'provider'`, `'signer'`, and `'network'` are assigned but never used
   - **Root Cause**: Variables destructured from useWeb3 but not used in component
   
2. **Line 20**: React Hook useEffect has missing dependency: `'loadBalance'`
   - **Root Cause**: `loadBalance` function referenced in dependency array but not included

## Fix Plan:

### Step 1: Fix Unused Variables
- Remove unused destructured variables (`provider`, `signer`, `network`) from useWeb3 calls
- Keep only the variables that are actually used in the components

### Step 2: Fix useEffect Dependencies
- Add `loadBalance` to the dependency arrays in useEffect hooks
- This ensures the useEffect re-runs when the function changes

### Step 3: Test and Verify
- Run ESLint to confirm all errors are resolved
- Verify the components still function correctly

## Files to Edit:
1. `/Users/macbook/smartbank/Front-End/src/pages/Deposit.jsx`
2. `/Users/macbook/smartbank/Front-End/src/pages/Withdraw.jsx`

