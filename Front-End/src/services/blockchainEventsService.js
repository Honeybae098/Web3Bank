// Blockchain Events Service - Read and filter SmartBank contract events
import { ethers } from 'ethers';
import { SmartBankABI } from '../config/SmartBankConfig';

class BlockchainEventsService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the service with Web3 provider and contract
   * @param {Object} provider - Web3 provider
   * @param {Object} contract - SmartBank contract instance
   * @returns {Promise<boolean>} Success status
   */
  async initialize(provider, contract) {
    try {
      if (!provider || !contract) {
        throw new Error('Provider and contract are required');
      }

      this.provider = provider;
      this.contract = contract;
      this.isInitialized = true;
      
      console.log('Blockchain events service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain events service:', error);
      return false;
    }
  }

  /**
   * Get contract instance
   * @returns {Object} Contract instance
   */
  getContract() {
    return this.contract;
  }

  /**
   * Get transaction history for a specific user by filtering events
   * @param {string} userAddress - User's wallet address
   * @param {Object} options - Filtering options
   * @returns {Promise<Array>} Array of transaction events
   */
  async getUserTransactionHistory(userAddress, options = {}) {
    try {
      if (!this.isInitialized || !this.contract) {
        throw new Error('Service not initialized');
      }

      if (!userAddress) {
        throw new Error('User address is required');
      }

      const {
        fromBlock = 0,
        toBlock = 'latest',
        eventTypes = ['Deposit', 'Withdraw', 'InterestPaid'],
        limit = 100
      } = options;

      const allEvents = [];

      // Fetch events for each type using ethers v6 syntax
      for (const eventType of eventTypes) {
        try {
          const filter = this.contract.filters[eventType](userAddress);
          const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
          
          // Parse events and add metadata
          const parsedEvents = events.slice(-limit).map(event => {
            const parsedEvent = this.parseEvent(event);
            return {
              ...parsedEvent,
              eventType: eventType, // Use the eventType from the filter
              type: eventType,
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              logIndex: event.logIndex,
              dataSource: 'blockchain_event'
            };
          });

          allEvents.push(...parsedEvents);
        } catch (eventError) {
          console.warn(`Failed to fetch ${eventType} events:`, eventError);
        }
      }

      // Sort by timestamp (most recent first)
      allEvents.sort((a, b) => b.timestamp - a.timestamp);

      return allEvents.slice(0, limit);
    } catch (error) {
      console.error('Failed to get user transaction history:', error);
      return [];
    }
  }

  /**
   * Get recent transactions for dashboard display
   * @param {string} userAddress - User's wallet address
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise<Array>} Recent transaction events
   */
  async getRecentTransactions(userAddress, limit = 10) {
    try {
      return await this.getUserTransactionHistory(userAddress, {
        limit,
        eventTypes: ['Deposit', 'Withdraw', 'InterestPaid']
      });
    } catch (error) {
      console.error('Failed to get recent transactions:', error);
      return [];
    }
  }

  /**
   * Get transaction statistics for a user
   * @param {string} userAddress - User's wallet address
   * @returns {Promise<Object>} Transaction statistics
   */
  async getUserTransactionStats(userAddress) {
    try {
      const transactions = await this.getUserTransactionHistory(userAddress, {
        limit: 1000 // Get more data for stats
      });

      const stats = {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInterestEarned: 0,
        totalTransactions: transactions.length,
        depositCount: 0,
        withdrawalCount: 0,
        interestCount: 0
      };

      transactions.forEach(tx => {
        switch (tx.eventType) {
          case 'Deposit':
            stats.totalDeposits += Number(tx.amount);
            stats.depositCount++;
            break;
          case 'Withdraw':
            stats.totalWithdrawals += Number(tx.amount);
            stats.withdrawalCount++;
            break;
          case 'InterestPaid':
            stats.totalInterestEarned += Number(tx.amount);
            stats.interestCount++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Failed to get user transaction stats:', error);
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInterestEarned: 0,
        totalTransactions: 0,
        depositCount: 0,
        withdrawalCount: 0,
        interestCount: 0
      };
    }
  }

  /**
   * Subscribe to new events for real-time updates
   * @param {string} userAddress - User's wallet address
   * @param {Function} callback - Callback function for new events
   * @returns {Object} Subscription object
   */
  subscribeToUserEvents(userAddress, callback) {
    try {
      if (!this.isInitialized || !this.contract) {
        throw new Error('Service not initialized');
      }

      const subscriptions = [];

      // Subscribe to Deposit events
      const depositFilter = this.contract.filters.Deposit(userAddress);
      const depositSubscription = this.contract.on(depositFilter, (user, amount, timestamp, event) => {
        const parsedEvent = this.parseEvent({ args: { user, amount, timestamp }, ...event });
        callback({
          ...parsedEvent,
          eventType: 'Deposit',
          type: 'Deposit',
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
          dataSource: 'realtime_event',
          isNew: true
        });
      });
      subscriptions.push(depositSubscription);

      // Subscribe to Withdraw events
      const withdrawFilter = this.contract.filters.Withdraw(userAddress);
      const withdrawSubscription = this.contract.on(withdrawFilter, (user, amount, timestamp, event) => {
        const parsedEvent = this.parseEvent({ args: { user, amount, timestamp }, ...event });
        callback({
          ...parsedEvent,
          eventType: 'Withdraw',
          type: 'Withdraw',
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
          dataSource: 'realtime_event',
          isNew: true
        });
      });
      subscriptions.push(withdrawSubscription);

      // Subscribe to InterestPaid events
      const interestFilter = this.contract.filters.InterestPaid(userAddress);
      const interestSubscription = this.contract.on(interestFilter, (user, amount, timestamp, event) => {
        const parsedEvent = this.parseEvent({ args: { user, amount, timestamp }, ...event });
        callback({
          ...parsedEvent,
          eventType: 'InterestPaid',
          type: 'InterestPaid',
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
          dataSource: 'realtime_event',
          isNew: true
        });
      });
      subscriptions.push(interestSubscription);

      // Return unsubscribe function
      return {
        unsubscribe: () => {
          subscriptions.forEach(sub => sub.removeAllListeners());
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to user events:', error);
      return null;
    }
  }

  /**
   * Parse event data into standardized format
   * @param {Object} event - Raw event object
   * @returns {Object} Parsed event data
   */
  parseEvent(event) {
    try {
      const { args } = event;
      
      // Ensure we have valid args
      if (!args || args.length < 3) {
        console.warn('Invalid event args:', args);
        return null;
      }
      
      const user = args.user || args[0];
      const amount = args.amount || args[1];
      const timestamp = args.timestamp || args[2];
      
      // Validate critical fields
      if (!user || amount === undefined || timestamp === undefined) {
        console.warn('Missing critical event fields:', { user, amount, timestamp });
        return null;
      }
      
      const formattedTimestamp = new Date(Number(timestamp) * 1000).toLocaleString();
      
      return {
        user: user.toString(),
        amount: ethers.formatEther(amount),
        rawAmount: amount.toString(),
        timestamp: Number(timestamp),
        formattedAmount: this.formatAmount(amount),
        formattedTimestamp: formattedTimestamp,
        eventType: this.getEventTypeFromContext(event), // Determine type from event context
        type: this.getEventTypeFromContext(event),
        blockNumber: event.blockNumber || 0,
        transactionHash: event.transactionHash || '',
        logIndex: event.logIndex || 0,
        dataSource: 'blockchain_event'
      };
    } catch (error) {
      console.error('Failed to parse event:', error);
      return null;
    }
  }

  /**
   * Get event type from event context (filters used)
   * @param {Object} event - Raw event object
   * @returns {string} Event type
   */
  getEventTypeFromContext(event) {
    // Try to determine from event name or args structure
    try {
      // Check if we can determine type from event log
      if (event.fragment && event.fragment.name) {
        return event.fragment.name;
      }
      
      // Fallback: use transaction type inference
      return 'Unknown';
    } catch (error) {
      console.warn('Failed to determine event type:', error);
      return 'Unknown';
    }
  }

  /**
   * Get event type from event args
   * @param {Object} args - Event arguments
   * @returns {string} Event type
   */
  getEventType(args) {
    if (args.user !== undefined && args.amount !== undefined && args.timestamp !== undefined) {
      // We need to determine the type based on context
      // This is a fallback - in practice, the calling code should specify the type
      return 'Unknown';
    }
    return 'Unknown';
  }

  /**
   * Format amount for display
   * @param {bigint} amount - Amount in wei
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    try {
      const ethAmount = ethers.formatEther(amount);
      return `${Number(ethAmount).toFixed(4)} ETH`;
    } catch (error) {
      return '0 ETH';
    }
  }

  /**
   * Check if service is properly initialized
   * @returns {boolean} Initialization status
   */
  isServiceReady() {
    return this.isInitialized && this.provider && this.contract;
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.provider = null;
    this.contract = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export default new BlockchainEventsService();
