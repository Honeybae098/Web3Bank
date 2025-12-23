// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const DashboardPage = ({ onNavigate }) => {
  const [transactions] = useState([
    { id: 1, type: 'Deposit', amount: '0.5', date: '2024-12-01', hash: '0x1234...5678' },
    { id: 2, type: 'Withdraw', amount: '0.2', date: '2024-12-02', hash: '0xabcd...efgh' },
    { id: 3, type: 'Deposit', amount: '1.0', date: '2024-12-03', hash: '0x9876...5432' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Navbar currentPage="dashboard" onNavigate={onNavigate} brandColor="purple-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Total Balance" 
            value="0.000 ETH" 
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

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
          <div className="p-6 border-b border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
            <p className="text-gray-400 text-sm mt-1">View all your deposits and withdrawals</p>
          </div>

          <div className="p-6">
            <div className="bg-blue-900 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-200 text-center">
                Connect your wallet to view transaction history
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition">
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          tx.type === 'Deposit' 
                            ? 'bg-green-500 bg-opacity-20 text-green-300' 
                            : 'bg-orange-500 bg-opacity-20 text-orange-300'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">{tx.amount} ETH</td>
                      <td className="py-4 px-4 text-gray-400">{tx.date}</td>
                      <td className="py-4 px-4">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          {tx.hash}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => onNavigate('deposit')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Make a Deposit
          </button>
          <button 
            onClick={() => onNavigate('withdraw')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;