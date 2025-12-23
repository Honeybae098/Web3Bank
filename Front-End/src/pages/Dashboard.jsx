// src/pages/Dashboard.jsx - Web3 Authentication & Multi-User Dashboard
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/StatCard';
import TransactionHistory from '../components/TransactionHistory';
import AuthGuard from '../components/auth/AuthGuard';

const DashboardPage = ({ onNavigate }) => {
  const { 
    address, 
    balance, 
    isConnected, 
    isAuthenticated, 
    formattedAddress,
    canTransact,
    network,
    connectWallet,
    authenticateWithWeb3
  } = useWeb3();
  
  const { user } = useAuth();
  const [bankStats, setBankStats] = useState(null);
  const [userBalance, setUserBalance] = useState('0.0000');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load dashboard data when authenticated
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !address) return;

      try {
        setLoading(true);
        // TODO: Load bank stats and user balance from SmartBank contract
        // This will be implemented when we have the contract deployed
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, address]);

  // Handle wallet connection and authentication
  const handleConnectWallet = async () => {
    try {
      setAuthLoading(true);
      const result = await connectWallet();
      if (result.success && !isAuthenticated) {
        // Auto-authenticate after connection
        setTimeout(async () => {
          await authenticateWithWeb3();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  // Authentication required content
  const AuthenticatedDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">SmartBank Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {user?.username || formattedAddress}
        </p>
      </div>

      {/* Wallet Status */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Wallet Status</h3>
            <p className="text-gray-400">{formattedAddress}</p>
            <p className="text-sm text-gray-500">
              Network: {network?.name || 'Unknown'} • Balance: {balance} ETH
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              canTransact 
                ? 'bg-green-500 bg-opacity-20 text-green-300' 
                : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
            }`}>
              {canTransact ? 'Ready to Transact' : 'View Only'}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          label="SmartBank Balance" 
          value={`${userBalance} ETH`} 
          subtext="≈ $0.00 USD" 
          icon={Wallet} 
          iconColor="blue-400" 
        />
        <StatCard 
          label="Total Deposits" 
          value="0.000 ETH" 
          subtext="0 transactions" 
          icon={ArrowDownCircle} 
          iconColor="green-400" 
        />
        <StatCard 
          label="Total Withdrawals" 
          value="0.000 ETH" 
          subtext="0 transactions" 
          icon={ArrowUpCircle} 
          iconColor="orange-400" 
        />
      </div>

      {/* Transaction History - Event-Based */}
      <div className="mb-8">
        <TransactionHistory limit={10} showHeader={true} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => onNavigate('deposit')}
          disabled={!canTransact}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
            canTransact
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Make a Deposit
        </button>
        <button 
          onClick={() => onNavigate('withdraw')}
          disabled={!canTransact}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
            canTransact
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Withdraw Funds
        </button>
      </div>
    </div>
  );

  // Connection required content
  const ConnectionRequired = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">SmartBank Dashboard</h1>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-8 max-w-md mx-auto">
          <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your MetaMask wallet to access your SmartBank account and view your transaction history.
          </p>
          
          <button
            onClick={handleConnectWallet}
            disabled={authLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </button>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>🔒 Your wallet address becomes your identity</p>
            <p>🔐 Secure Web3 authentication</p>
            <p>👥 Multi-user support with data isolation</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mr-3" />
            <span className="text-white font-semibold">Loading Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {isAuthenticated && isConnected ? (
        <AuthenticatedDashboard />
      ) : (
        <ConnectionRequired />
      )}
    </div>
  );
};

export default DashboardPage;