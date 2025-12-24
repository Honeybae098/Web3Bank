// Transaction History Component - Shows user's transaction events from blockchain
import React, { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import transactionService from '../services/transactionService';
import smartBankService from '../services/smartBankService';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Clock, ExternalLink, Loader2 } from 'lucide-react';

const TransactionHistory = ({ limit = 10, showHeader = true, className = '' }) => {
  const { provider, contract, address, isAuthenticated } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [interestDetails, setInterestDetails] = useState(null);

  // Initialize unified transaction service
  useEffect(() => {
    const initializeService = async () => {
      if (provider && contract && address && isAuthenticated) {
        try {
          // Get signer from provider
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          
          // Initialize unified transaction service
          await transactionService.initialize(provider, signer, contract, network);
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize transaction service:', error);
          setError('Failed to initialize transaction service');
        }
      }
    };

    initializeService();
  }, [provider, contract, address, isAuthenticated]);

  // Load transaction history and stats using unified service
  const loadTransactionData = useCallback(async (forceRefresh = false) => {
    if (!isInitialized || !address) return;

    try {
      if (!forceRefresh) {
        setLoading(true);
      }
      setError(null);

      console.log('Loading transaction data...', { forceRefresh, address });

      // Load recent transactions using unified service with persistent storage
      const transactionsResult = await transactionService.getUserTransactionHistory(address, { 
        limit,
        forceRefresh
      });
      
      if (transactionsResult.success) {
        setTransactions(transactionsResult.transactions || []);
        console.log(`Loaded ${transactionsResult.transactions?.length || 0} transactions from ${transactionsResult.dataSource}`);
        
        // If no transactions and not force refresh, show helpful message
        if (!forceRefresh && (!transactionsResult.transactions || transactionsResult.transactions.length === 0)) {
          setError('No transaction history found. Make your first deposit to get started!');
        }
      } else {
        console.warn('Failed to load transactions:', transactionsResult.error);
        setTransactions([]);
        setError(`Failed to load transactions: ${transactionsResult.error}`);
      }

      // Load transaction statistics using unified service
      const statsResult = await transactionService.getUserTransactionStats(address);
      
      if (statsResult.success) {
        setStats(statsResult.stats);
      } else {
        console.warn('Failed to load stats:', statsResult.error);
        setStats({
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalInterestEarned: 0,
          totalTransactions: 0,
          depositCount: 0,
          withdrawalCount: 0,
          interestCount: 0
        });
      }

      // Load detailed interest information
      try {
        const interestResult = await smartBankService.getInterestDetails(address);
        if (interestResult.success) {
          setInterestDetails(interestResult);
        }
      } catch (interestError) {
        console.warn('Failed to load interest details:', interestError);
      }

    } catch (error) {
      console.error('Failed to load transaction data:', error);
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isInitialized, address, limit]);

  // Load data when component mounts or dependencies change
  useEffect(() => {
    loadTransactionData();
  }, [isInitialized, address, limit, loadTransactionData]);

  // Manual refresh function
  const handleRefresh = () => {
    loadTransactionData(true);
  };

  // Set up real-time event subscription using unified service
  useEffect(() => {
    if (!isInitialized || !address) return;

    const subscription = transactionService.subscribeToUserEvents(address, (newEvent) => {
      setTransactions(prev => [newEvent, ...prev.slice(0, limit - 1)]);
      
      // Update stats optimistically
      setStats(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.totalTransactions += 1;
        
        switch (newEvent.eventType) {
          case 'Deposit':
            updated.totalDeposits += Number(newEvent.amount);
            updated.depositCount += 1;
            break;
          case 'Withdraw':
            updated.totalWithdrawals += Number(newEvent.amount);
            updated.withdrawalCount += 1;
            break;
          case 'InterestPaid':
            updated.totalInterestEarned += Number(newEvent.amount);
            updated.interestCount += 1;
            break;
        }
        
        return updated;
      });
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isInitialized, address, limit]);

  /**
   * Get transaction icon based on type
   */
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'Withdraw':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'InterestPaid':
      case 'Interest':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  /**
   * Get transaction color based on type
   */
  const getTransactionColor = (type) => {
    switch (type) {
      case 'Deposit':
        return 'text-green-400 bg-green-400 bg-opacity-10 border-green-400 border-opacity-20';
      case 'Withdraw':
        return 'text-red-400 bg-red-400 bg-opacity-10 border-red-400 border-opacity-20';
      case 'InterestPaid':
      case 'Interest':
        return 'text-blue-400 bg-blue-400 bg-opacity-10 border-blue-400 border-opacity-20';
      default:
        return 'text-gray-400 bg-gray-400 bg-opacity-10 border-gray-400 border-opacity-20';
    }
  };

  /**
   * Format transaction amount with sign
   */
  const formatTransactionAmount = (amount, type) => {
    const sign = (type === 'Withdraw') ? '-' : '+';
    return `${sign}${Number(amount).toFixed(4)} ETH`;
  };

  /**
   * Get display name for transaction type
   */
  const getDisplayTypeName = (type) => {
    switch (type) {
      case 'Deposit':
        return 'Deposit';
      case 'Withdraw':
        return 'Withdrawal';
      case 'InterestPaid':
        return 'Interest Payment';
      case 'Interest':
        return 'Interest';
      default:
        return type || 'Unknown';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`bg-white bg-opacity-5 backdrop-blur-md rounded-xl border border-white border-opacity-10 p-6 ${className}`}>
        <div className="text-center text-gray-400">
          <p>Please authenticate to view your transaction history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-white bg-opacity-5 backdrop-blur-md rounded-xl border border-white border-opacity-10 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="ml-2 text-gray-300">Loading transaction history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-500 bg-opacity-10 backdrop-blur-md rounded-xl border border-red-400 border-opacity-20 p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white bg-opacity-5 backdrop-blur-md rounded-xl border border-white border-opacity-10 ${className}`}>
      {showHeader && (
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {transactions.length} transactions
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors duration-200 flex items-center space-x-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <span>↻</span>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Statistics */}
      {stats && (
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Number(stats.totalDeposits).toFixed(4)}
              </div>
              <div className="text-sm text-gray-400">Total Deposits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {Number(stats.totalWithdrawals).toFixed(4)}
              </div>
              <div className="text-sm text-gray-400">Total Withdrawals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Number(stats.totalInterestEarned).toFixed(4)}
              </div>
              <div className="text-sm text-gray-400">Interest Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats.totalTransactions}
              </div>
              <div className="text-sm text-gray-400">Total Transactions</div>
            </div>
          </div>
        </div>
      )}

      {/* Interest Details */}
      {interestDetails && interestDetails.success && (
        <div className="p-6 border-b border-white border-opacity-10 bg-blue-500 bg-opacity-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Interest Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Current Balance</div>
              <div className="text-white font-semibold">{interestDetails.principal} ETH</div>
            </div>
            <div>
              <div className="text-gray-400">Time Passed</div>
              <div className="text-white font-semibold">{interestDetails.timePassedDays} days</div>
            </div>
            <div>
              <div className="text-gray-400">Raw Interest</div>
              <div className="text-white font-semibold">{interestDetails.rawInterest} ETH</div>
            </div>
            <div>
              <div className="text-gray-400">Performance Fee (10%)</div>
              <div className="text-red-400 font-semibold">-{interestDetails.performanceFee} ETH</div>
            </div>
            <div>
              <div className="text-gray-400">Net Interest</div>
              <div className="text-green-400 font-semibold">+{interestDetails.netInterest} ETH</div>
            </div>
            <div>
              <div className="text-gray-400">Projected Balance</div>
              <div className="text-blue-400 font-semibold">{interestDetails.projectedBalance} ETH</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-400 border-opacity-20">
            <div className="text-yellow-400 text-sm">
              <strong>Note:</strong> Interest is calculated and applied automatically every time you interact with the contract. 
              Next calculation in {Math.max(0, Math.ceil((interestDetails.nextCalculationTime - Date.now() / 1000) / 86400))} days.
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
            <p className="text-sm mt-1">Make your first deposit to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div 
                key={`${tx.transactionHash}-${tx.logIndex}-${index}`}
                className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getTransactionColor(tx.eventType)}`}>
                    {getTransactionIcon(tx.eventType)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {getDisplayTypeName(tx.eventType)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tx.formattedTimestamp}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.eventType === 'Deposit' || tx.eventType === 'InterestPaid' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {formatTransactionAmount(tx.amount, tx.eventType)}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <span>Block #{tx.blockNumber}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
