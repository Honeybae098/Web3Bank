// src/pages/Deposit.jsx
import React, { useState } from 'react';
import { ArrowDownCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';

const DepositPage = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setIsLoading(true);
    
    // TODO: Web3 Integration - Phase 3
    setTimeout(() => {
      setIsLoading(false);
      alert(`Deposit of ${amount} ETH initiated`);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <Navbar currentPage="deposit" onNavigate={onNavigate} brandColor="green-400" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-2xl border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <ArrowDownCircle className="w-16 h-16 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white text-center mb-3">Deposit ETH</h1>
          <p className="text-gray-300 text-center mb-8">
            Securely deposit your ETH into the SmartBank vault
          </p>

          <div className="space-y-6">
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
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 rounded-lg p-4">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> Make sure you have sufficient ETH in your MetaMask wallet and are connected to the Sepolia testnet.
              </p>
            </div>

            <button
              onClick={handleDeposit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Processing...' : 'Deposit ETH'}
            </button>

            <div className="text-center text-sm text-gray-400">
              Transaction will require MetaMask confirmation
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <InfoCard 
            title="Safe & Secure" 
            description="Your funds are protected by audited smart contract code" 
          />
          <InfoCard 
            title="Instant Updates" 
            description="Your balance updates in real-time after confirmation" 
          />
        </div>
      </div>
    </div>
  );
};

export default DepositPage;