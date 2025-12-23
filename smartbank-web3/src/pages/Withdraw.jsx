// src/pages/Withdraw.jsx
import React, { useState } from 'react';
import { ArrowUpCircle, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';

const WithdrawPage = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setIsLoading(true);
    
    // TODO: Web3 Integration - Phase 3
    setTimeout(() => {
      setIsLoading(false);
      alert(`Withdrawal of ${amount} ETH initiated`);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      <Navbar currentPage="withdraw" onNavigate={onNavigate} brandColor="orange-400" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-2xl border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <ArrowUpCircle className="w-16 h-16 text-orange-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white text-center mb-3">Withdraw ETH</h1>
          <p className="text-gray-300 text-center mb-8">
            Withdraw your ETH from the SmartBank vault to your wallet
          </p>

          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Available Balance</span>
                <Wallet className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-white">0.000 ETH</p>
              <p className="text-gray-500 text-sm mt-1">Connect wallet to view balance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-400 border-opacity-30 rounded-lg p-4">
              <p className="text-sm text-yellow-200">
                <strong>Important:</strong> You can only withdraw funds that you have deposited. Make sure you have sufficient balance.
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Processing...' : 'Withdraw ETH'}
            </button>

            <div className="text-center text-sm text-gray-400">
              Transaction will require MetaMask confirmation
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <InfoCard 
            title="Your Control" 
            description="Only you can withdraw your deposited funds" 
          />
          <InfoCard 
            title="Fast Processing" 
            description="Withdrawals are processed immediately on-chain" 
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;