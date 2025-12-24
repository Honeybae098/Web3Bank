// Enhanced Web3 Context - Fixed version with proper service integration
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useAuth } from './AuthContext';
import { AUTH_ERRORS } from '../config/authConfig';
import authUtils from '../utils/authUtils';
import addressUtils from '../utils/addressUtils';
import { SmartBankABI, CONTRACT_ADDRESSES } from '../config/SmartBankConfig';
import smartBankService from '../services/smartBankService';
import transactionService from '../services/transactionService';
import sessionService from '../services/sessionService';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  // State management
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [authStatus, setAuthStatus] = useState('disconnected'); // disconnected, connecting, connected, authenticating
  const [contract, setContract] = useState(null);
  const [isContractInitialized, setIsContractInitialized] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [canTransact, setCanTransact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use authentication context
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading,
    isInitializing,
    login,
    register,
    requestAuthSignature,
    extendSession,
    checkRole,
    hasRole
  } = useAuth();

  // Clear errors when component mounts
  useEffect(() => {
    setError(null);
  }, []);

  // Initialize Web3 provider when available
  useEffect(() => {
    if (window.ethereum) {
      initializeProvider();
      setupEventListeners();
    }

    return () => {
      cleanupEventListeners();
    };
  }, []);

  // Handle authentication state changes (simplified)
  useEffect(() => {
    if (isAuthenticated && user?.address) {
      // Update Web3 address when user authenticates
      setAddress(user.address);
    }
    // Removed verifyWalletConnection and disconnectWallet to prevent circular dependencies
  }, [isAuthenticated, user]);

  // Auto-initialize contract when wallet is connected (simplified - no auth required)
  useEffect(() => {
    if (provider && signer && network && address) {
      console.log('Initializing SmartBank contract...');
      // Use a timeout to prevent blocking
      const initTimeout = setTimeout(() => {
        initializeContract();
      }, 100);
      
      return () => clearTimeout(initTimeout);
    }
  }, [provider, signer, network, address]);

  /**
   * Initialize Web3 provider
   */
  const initializeProvider = useCallback(async () => {
    try {
      if (!window.ethereum) {
        console.warn('No Ethereum provider found - running in development mode');
        setError('MetaMask not detected - some features may be limited');
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      // Check if already connected
      try {
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (accountError) {
        console.warn('No accounts available or user not connected');
        // This is normal when MetaMask is installed but not connected
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      setError('Failed to initialize Web3 provider - some features may be limited');
    }
  }, []);

  /**
   * Setup event listeners for wallet events
   */
  const setupEventListeners = useCallback(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (!addressUtils.compareAddresses(accounts[0], address)) {
        setAddress(accounts[0]);
        updateBalance();
        
        // If user is authenticated, check if address matches
        if (isAuthenticated && user?.address && !addressUtils.compareAddresses(user.address, accounts[0])) {
          console.warn('Wallet address changed - may require re-authentication');
          setError('Wallet address changed - re-authentication required');
        }
      }
    };

    const handleChainChanged = (chainId) => {
      // Reload on chain change
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    // Store cleanup function
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, [address, isAuthenticated, user]);

  /**
   * Cleanup event listeners
   */
  const cleanupEventListeners = useCallback(() => {
    if (!window.ethereum) return;
    
    window.ethereum.removeListener('accountsChanged', () => {});
    window.ethereum.removeListener('chainChanged', () => {});
    window.ethereum.removeListener('disconnect', () => {});
  }, []);

  /**
   * Connect wallet to the application
   */
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not detected. Please install MetaMask to use wallet features.');
        setAuthStatus('disconnected');
        return {
          success: false,
          error: 'MetaMask not detected. Please install MetaMask to use wallet features.'
        };
      }

      setIsConnecting(true);
      setError(null);
      setAuthStatus('connecting');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const currentAddress = await web3Signer.getAddress();
      const currentNetwork = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(currentAddress);
      setNetwork({
        chainId: Number(currentNetwork.chainId),
        name: currentNetwork.name
      });
      setIsConnected(true);
      setAuthStatus('connected');

      // Update balance
      await updateBalance();

      // If user is authenticated, verify address matches
      if (isAuthenticated && user?.address && !addressUtils.compareAddresses(user.address, currentAddress)) {
        console.warn('Authenticated user address does not match connected wallet');
        setError('Wallet address does not match authenticated user');
      }

      return {
        success: true,
        address: currentAddress,
        network: currentNetwork
      };

    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to connect wallet';
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setAuthStatus('disconnected');
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setNetwork(null);
    setBalance('0');
    setIsConnected(false);
    setAuthStatus('disconnected');
    setError(null);
    setContract(null);
    setIsContractInitialized(false);
    setCanTransact(false);
    setTransactionHistory([]);
  }, []);

  /**
   * Verify wallet connection matches authenticated user
   */
  const verifyWalletConnection = useCallback(async (expectedAddress) => {
    try {
      if (!provider || !address) {
        return false;
      }

      const currentAddress = await provider.getSigner().getAddress();
      return addressUtils.compareAddresses(currentAddress, expectedAddress);
    } catch (error) {
      console.error('Wallet verification failed:', error);
      return false;
    }
  }, [provider, address]);

  /**
   * Update wallet balance
   */
  const updateBalance = useCallback(async () => {
    try {
      if (!provider || !address) return;

      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }, [provider, address]);

  /**
   * Initialize SmartBank contract
   */
  const initializeContract = useCallback(async () => {
    try {
      // Graceful handling when dependencies are missing
      if (!provider || !signer || !network) {
        console.warn('Cannot initialize contract: missing provider, signer, or network');
        console.log('This is normal in development mode without MetaMask');
        return false;
      }

      const chainId = network.chainId;
      const networkKey = chainId === 31337 ? 'localhost' : chainId === 11155111 ? 'sepolia' : 'mainnet';
      const contractAddress = CONTRACT_ADDRESSES[networkKey];

      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`SmartBank contract not deployed on ${networkKey}`);
        return false;
      }

      try {
        const smartBankContract = new ethers.Contract(contractAddress, SmartBankABI, signer);
        setContract(smartBankContract);
      } catch (contractError) {
        console.error('Failed to create contract instance:', contractError);
        return false;
      }

      // Initialize services with error handling
      try {
        const smartBankResult = smartBankService.initialize(provider, signer, network);
        if (!smartBankResult.success) {
          console.warn('Failed to initialize smartBankService:', smartBankResult.error);
          // Don't return false, just continue without service
        }
      } catch (smartBankError) {
        console.warn('SmartBank service initialization error:', smartBankError);
      }

      try {
        const transactionResult = await transactionService.initialize(provider, signer, contract, network);
        if (!transactionResult) {
          console.warn('Failed to initialize transactionService');
          // Don't return false, just continue without service
        }
      } catch (transactionError) {
        console.warn('Transaction service initialization error:', transactionError);
      }

      setIsContractInitialized(true);
      setCanTransact(true);

      // Load transaction history if user is authenticated
      if (isAuthenticated && address && contract) {
        try {
          const history = await contract.getHistory(address);
          setTransactionHistory(history.map(tx => ({
            type: tx.txType,
            amount: ethers.formatEther(tx.amount),
            timestamp: new Date(tx.timestamp * 1000).toLocaleString()
          })));
        } catch (historyError) {
          console.warn('Failed to load transaction history:', historyError);
        }
      }

      console.log('SmartBank contract and services initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      setError(`Contract initialization failed: ${error.message}`);
      return false;
    }
  }, [provider, signer, network, isAuthenticated, address]);

  /**
   * Authenticate with Web3 signature
   */
  const authenticateWithWeb3 = useCallback(async () => {
    try {
      if (!address) {
        throw new Error('No wallet connected');
      }

      setAuthStatus('authenticating');
      setError(null);

      // Request signature from user
      const signatureResult = await requestAuthSignature(address);
      
      if (!signatureResult.success) {
        throw new Error(signatureResult.error);
      }

      // Attempt to authenticate
      const authResult = await login({
        address: address,
        signature: signatureResult.signature,
        message: signatureResult.message,
        nonce: signatureResult.nonce
      });

      if (authResult.success) {
        setAuthStatus('connected');
        return {
          success: true,
          user: authResult.user,
          isNewUser: authResult.isNewUser
        };
      } else {
        throw new Error(authResult.error);
      }

    } catch (error) {
      console.error('Web3 authentication failed:', error);
      setError(error.message || 'Authentication failed');
      setAuthStatus('connected');
      return {
        success: false,
        error: error.message
      };
    }
  }, [address, requestAuthSignature, login]);

  /**
   * Register new user with Web3
   */
  const registerWithWeb3 = useCallback(async (userInfo = {}) => {
    try {
      if (!address) {
        throw new Error('No wallet connected');
      }

      setAuthStatus('authenticating');
      setError(null);

      // Request signature from user
      const signatureResult = await requestAuthSignature(address);
      
      if (!signatureResult.success) {
        throw new Error(signatureResult.error);
      }

      // Attempt to register
      const registerResult = await register({
        address: address,
        signature: signatureResult.signature,
        message: signatureResult.message,
        nonce: signatureResult.nonce
      }, userInfo);

      if (registerResult.success) {
        setAuthStatus('connected');
        return {
          success: true,
          user: registerResult.user
        };
      } else {
        throw new Error(registerResult.error);
      }

    } catch (error) {
      console.error('Web3 registration failed:', error);
      setError(error.message || 'Registration failed');
      setAuthStatus('connected');
      return {
        success: false,
        error: error.message
      };
    }
  }, [address, requestAuthSignature, register]);

  /**
   * Send transaction
   */
  const sendTransaction = useCallback(async (to, amount, options = {}) => {
    try {
      if (!signer || !address) {
        throw new Error('Wallet not connected');
      }

      // Check if user is authenticated for sensitive operations
      if (!isAuthenticated) {
        throw new Error('Authentication required for transactions');
      }

      const value = ethers.parseEther(amount.toString());
      
      const tx = await signer.sendTransaction({
        to,
        value,
        ...options
      });

      return {
        success: true,
        transaction: tx,
        hash: tx.hash
      };

    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        success: false,
        error: error.message || 'Transaction failed'
      };
    }
  }, [signer, address, isAuthenticated]);

  /**
   * Sign message
   */
  const signMessage = useCallback(async (message) => {
    try {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      const signature = await signer.signMessage(message);
      return {
        success: true,
        signature,
        message
      };

    } catch (error) {
      console.error('Message signing failed:', error);
      return {
        success: false,
        error: error.message || 'Message signing failed'
      };
    }
  }, [signer]);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(async (chainId) => {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet provider found');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      return { success: true };

    } catch (error) {
      console.error('Network switch failed:', error);
      return {
        success: false,
        error: error.message || 'Network switch failed'
      };
    }
  }, []);

  /**
   * Check if network is supported
   */
  const isNetworkSupported = useCallback((chainId = network?.chainId) => {
    if (!chainId) return false;
    return Object.values(CONTRACT_ADDRESSES).some(addr => addr !== '0x0000000000000000000000000000000000000000');
  }, [network]);

  /**
   * Get formatted address
   */
  const getFormattedAddress = useCallback(() => {
    return address ? addressUtils.formatAddress(address) : '';
  }, [address]);

  /**
   * Get user permissions based on role and authentication
   */
  const getUserPermissions = useCallback(() => {
    if (!isAuthenticated || !user) {
      return [];
    }

    const basePermissions = ['view_public_info'];
    
    if (user.role === 'USER') {
      return [
        ...basePermissions,
        'view_dashboard',
        'make_transactions',
        'view_profile'
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        ...basePermissions,
        'view_dashboard',
        'make_transactions',
        'view_profile',
        'admin_access',
        'manage_users',
        'system_settings'
      ];
    }

    return basePermissions;
  }, [isAuthenticated, user]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((permission) => {
    const permissions = getUserPermissions();
    return permissions.includes(permission);
  }, [getUserPermissions]);

  /**
   * Session management utilities (from sessionService)
   */
  const getStoredSession = useCallback(() => {
    return sessionService.getSessionData();
  }, []);

  const updateSession = useCallback(() => {
    return sessionService.extendSession();
  }, []);

  const clearStoredSession = useCallback(() => {
    sessionService.clearSession();
  }, []);

  // Auto-update balance when address changes
  useEffect(() => {
    if (address && isConnected) {
      updateBalance();
      
      // Set up balance update interval
      const interval = setInterval(updateBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [address, isConnected, updateBalance]);

  // Context value
  const contextValue = useMemo(() => ({
    // State
    provider,
    signer,
    address,
    network,
    balance,
    isConnecting,
    isConnected,
    error,
    authStatus,
    contract,
    isContractInitialized,
    transactionHistory,
    canTransact,
    isLoading,

    // Derived state
    isAuthenticated: isAuthenticated && isConnected,
    isReady: !authLoading && !isInitializing,
    isAdmin: isAuthenticated && checkRole('ADMIN'),
    permissions: getUserPermissions(),
    formattedAddress: getFormattedAddress(),

    // Methods
    connectWallet,
    disconnectWallet,
    authenticateWithWeb3,
    registerWithWeb3,
    sendTransaction,
    signMessage,
    switchNetwork,
    updateBalance,
    verifyWalletConnection,
    hasPermission,
    isNetworkSupported,
    initializeContract,

    // Session management (for compatibility with provided code)
    getStoredSession,
    updateSession,
    clearStoredSession,

    // Services
    smartBankService,
    transactionService,

    // Utilities
    utils: {
      formatAddress: addressUtils.formatAddress,
      isValidAddress: addressUtils.isValidAddress,
      normalizeAddress: addressUtils.normalizeAddress,
      compareAddresses: addressUtils.compareAddresses
    }
  }), [
    provider,
    signer,
    address,
    network,
    balance,
    isConnecting,
    isConnected,
    error,
    authStatus,
    contract,
    isContractInitialized,
    transactionHistory,
    canTransact,
    isLoading,
    isAuthenticated,
    authLoading,
    isInitializing,
    user,
    getUserPermissions,
    getFormattedAddress,
    connectWallet,
    disconnectWallet,
    authenticateWithWeb3,
    registerWithWeb3,
    sendTransaction,
    signMessage,
    switchNetwork,
    updateBalance,
    verifyWalletConnection,
    hasPermission,
    isNetworkSupported,
    initializeContract,
    getStoredSession,
    updateSession,
    clearStoredSession,
    smartBankService,
    transactionService
  ]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Higher-order component for Web3-protected components
export const withWeb3 = (Component) => {
  return function Web3ConnectedComponent(props) {
    const web3 = useWeb3();

    if (!web3.isReady) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <Component {...props} web3={web3} />;
  };
};

// Export the context for advanced usage
export { Web3Context };

export default Web3Provider;
