// Unified Transaction Service - Consolidates smartBankService and blockchainEventsService
import { ethers } from 'ethers';
import smartBankService from './smartBankService';
import blockchainEventsService from './blockchainEventsService';

class TransactionService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isInitialized = false;
    this.subscriptions = [];
  }

  /**
   * Initialize the unified transaction service
   * @param {Object} provider - Web3 provider
   * @param {Object} signer - Web3 signer
   * @param {Object} contract - SmartBank contract instance
   * @param {Object} network - Network information
   */
  async initialize(provider, signer, contract, network) {
    try {
      this.provider = provider;
      this.signer = signer;
      this.contract = contract;
      
      // Initialize both underlying services
      await blockchainEventsService.initialize(provider, contract);
      smartBankService.initialize(provider, signer, network);
      
      this.isInitialized = true;
      console.log('Transaction service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize transaction service:', error);
      return false;
    }
  }

  /**
   * Get comprehensive transaction history for a user
   * Uses hybrid approach: stored history (primary) + events (fallback)
   * @param {string} userAddress - User's wallet address
   * @param {Object} options - Options for filtering and limiting
   * @returns {Promise<Object>} Transaction history result
   */
  async getUserTransactionHistory(userAddress, options = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('Transaction service not initialized');
      }

      const {
        limit = 100,
        includeEvents = true,
        includeStoredHistory = true,
        sortBy = 'timestamp',
        sortOrder = 'desc'
      } = options;

      let transactions = [];
      let dataSource = 'none';

      // Primary: Try to get stored history from contract
      if (includeStoredHistory) {
        try {
          const historyResult = await smartBankService.getTransactionHistory(userAddress);
          if (historyResult.success && historyResult.history) {
            // Convert stored history to unified format
            const storedTxs = historyResult.history.map((tx, index) => {
              const eventType = tx.eventType || this.normalizeTransactionType(tx.txType);
              
              return {
                id: `stored-${eventType}-${tx.timestamp}-${index}`,
                eventType: eventType,
                type: eventType,
                amount: parseFloat(tx.amount),
                rawAmount: tx.rawAmount,
                timestamp: tx.timestamp,
                formattedTimestamp: tx.date,
                transactionHash: '', // Stored history doesn't have transaction hash
                blockNumber: 0,
                logIndex: index,
                dataSource: 'contract_storage',
                isNew: false
              };
            });
            
            transactions = storedTxs;
            dataSource = 'contract_storage';
            console.log(`Loaded ${storedTxs.length} transactions from stored history`);
          }
        } catch (storedError) {
          console.warn('Failed to load stored history:', storedError);
        }
      }

      // Fallback: Get events if no stored history or as supplement
      if (includeEvents && (transactions.length === 0 || transactions.length < limit)) {
        try {
          const eventsData = await blockchainEventsService.getUserTransactionHistory(userAddress, {
            limit: limit - transactions.length,
            fromBlock: 0,
            toBlock: 'latest'
          });

          if (eventsData.length > 0) {
            // Add event transactions (avoiding duplicates)
            const existingTimestamps = new Set(transactions.map(tx => tx.timestamp));
            const newEvents = eventsData.filter(event => 
              !existingTimestamps.has(event.timestamp)
            ).map(event => ({
              id: `event-${event.transactionHash}-${event.logIndex}`,
              eventType: event.eventType,
              type: event.eventType,
              amount: parseFloat(event.amount),
              rawAmount: event.rawAmount,
              timestamp: event.timestamp,
              formattedTimestamp: event.formattedTimestamp,
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              logIndex: event.logIndex,
              dataSource: 'events',
              isNew: false
            }));

            transactions = [...transactions, ...newEvents];
            dataSource = transactions.length > 0 ? 'hybrid' : 'events';
            console.log(`Added ${newEvents.length} transactions from events`);
          }
        } catch (eventsError) {
          console.warn('Failed to load events:', eventsError);
        }
      }

      // Sort transactions
      transactions.sort((a, b) => {
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        if (sortBy === 'timestamp') {
          return multiplier * (a.timestamp - b.timestamp);
        }
        return multiplier * (a.amount - b.amount);
      });

      // Apply limit
      const limitedTransactions = transactions.slice(0, limit);

      return {
        success: true,
        transactions: limitedTransactions,
        dataSource,
        totalCount: limitedTransactions.length,
        hasMore: transactions.length > limit
      };

    } catch (error) {
      console.error('Failed to get user transaction history:', error);
      return {
        success: false,
        error: error.message,
        transactions: [],
        dataSource: 'error',
        totalCount: 0
      };
    }
  }

  /**
   * Get recent transactions for dashboard display
   * @param {string} userAddress - User's wallet address
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise<Object>} Recent transactions result
   */
  async getRecentTransactions(userAddress, limit = 10) {
    const result = await this.getUserTransactionHistory(userAddress, { limit });
    return {
      success: result.success,
      transactions: result.transactions,
      dataSource: result.dataSource,
      error: result.error
    };
  }

  /**
   * Get transaction statistics for a user
   * @param {string} userAddress - User's wallet address
   * @returns {Promise<Object>} Transaction statistics
   */
  async getUserTransactionStats(userAddress) {
    try {
      const historyResult = await this.getUserTransactionHistory(userAddress, { limit: 1000 });
      
      if (!historyResult.success) {
        throw new Error('Failed to get transaction history for stats');
      }

      const transactions = historyResult.transactions;
      
      const stats = {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInterestEarned: 0,
        totalTransactions: transactions.length,
        depositCount: 0,
        withdrawalCount: 0,
        interestCount: 0,
        dataSource: historyResult.dataSource
      };

      transactions.forEach(tx => {
        switch (tx.eventType) {
          case 'Deposit':
            stats.totalDeposits += tx.amount;
            stats.depositCount++;
            break;
          case 'Withdraw':
            stats.totalWithdrawals += tx.amount;
            stats.withdrawalCount++;
            break;
          case 'InterestPaid':
            stats.totalInterestEarned += tx.amount;
            stats.interestCount++;
            break;
        }
      });

      return {
        success: true,
        stats,
        lastUpdated: Date.now()
      };

    } catch (error) {
      console.error('Failed to get user transaction stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalInterestEarned: 0,
          totalTransactions: 0,
          depositCount: 0,
          withdrawalCount: 0,
          interestCount: 0,
          dataSource: 'error'
        }
      };
    }
  }

  /**
   * Subscribe to real-time transaction events
   * @param {string} userAddress - User's wallet address
   * @param {Function} callback - Callback for new events
   * @returns {Object} Subscription object
   */
  subscribeToUserEvents(userAddress, callback) {
    try {
      if (!this.isInitialized) {
        throw new Error('Transaction service not initialized');
      }

      // Subscribe to events through blockchainEventsService
      const subscription = blockchainEventsService.subscribeToUserEvents(userAddress, (newEvent) => {
        // Convert event to unified format
        const unifiedEvent = {
          id: `realtime-${newEvent.transactionHash}-${newEvent.logIndex}`,
          eventType: newEvent.eventType,
          type: newEvent.eventType,
          amount: parseFloat(newEvent.amount),
          rawAmount: newEvent.rawAmount,
          timestamp: newEvent.timestamp,
          formattedTimestamp: newEvent.formattedTimestamp,
          transactionHash: newEvent.transactionHash,
          blockNumber: newEvent.blockNumber,
          logIndex: newEvent.logIndex,
          dataSource: 'realtime',
          isNew: true
        };

        callback(unifiedEvent);
      });

      return {
        unsubscribe: () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        }
      };

    } catch (error) {
      console.error('Failed to subscribe to user events:', error);
      return null;
    }
  }

  /**
   * Subscribe to SmartBank contract events through smartBankService
   * @param {string} userAddress - User's wallet address
   * @param {Object} callbacks - Event callbacks
   * @returns {Function} Cleanup function
   */
  subscribeToContractEvents(userAddress, callbacks = {}) {
    try {
      if (!this.contract) {
        throw new Error('Contract not available');
      }

      const cleanup = smartBankService.setupEventListeners(userAddress, {
        onDeposit: (event) => callbacks.onDeposit?.(this.normalizeEventData(event, 'Deposit')),
        onWithdraw: (event) => callbacks.onWithdraw?.(this.normalizeEventData(event, 'Withdraw')),
        onInterest: (event) => callbacks.onInterest?.(this.normalizeEventData(event, 'InterestPaid'))
      });

      this.subscriptions.push(cleanup);
      return cleanup;

    } catch (error) {
      console.error('Failed to subscribe to contract events:', error);
      return () => {};
    }
  }

  /**
   * Normalize transaction type names
   * @param {string} txType - Raw transaction type
   * @returns {string} Normalized transaction type
   */
  normalizeTransactionType(txType) {
    const typeMap = {
      'Deposit': 'Deposit',
      'Withdraw': 'Withdraw',
      'Withdraw': 'Withdraw',
      'Interest Earned': 'InterestPaid',
      'InterestPaid': 'InterestPaid'
    };
    return typeMap[txType] || txType;
  }

  /**
   * Normalize event data to unified format
   * @param {Object} event - Raw event data
   * @param {string} eventType - Event type
   * @returns {Object} Normalized event data
   */
  normalizeEventData(event, eventType) {
    return {
      id: `normalized-${eventType}-${event.timestamp}-${event.amount}`,
      eventType: this.normalizeTransactionType(eventType),
      type: eventType,
      amount: parseFloat(event.amount),
      rawAmount: event.rawAmount || event.amount,
      timestamp: event.timestamp,
      formattedTimestamp: event.date || new Date(event.timestamp * 1000).toLocaleString(),
      transactionHash: event.transactionHash || '',
      blockNumber: event.blockNumber || 0,
      logIndex: event.logIndex || 0,
      dataSource: 'contract_event',
      isNew: true
    };
  }

  /**
   * Check if service is ready
   * @returns {boolean} Service readiness status
   */
  isServiceReady() {
    return this.isInitialized && this.provider && this.contract;
  }

  /**
   * Clean up all subscriptions and resources
   */
  cleanup() {
    this.subscriptions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
    this.subscriptions = [];
    
    blockchainEventsService.cleanup();
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
const transactionService = new TransactionService();
export default transactionService;

// Export class for custom instances
export { TransactionService };

