// src/components/Navbar.jsx
import React from 'react';
import { Shield } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate, brandColor = "blue-400" }) => {
  return (
    <nav className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className={`w-8 h-8 text-${brandColor}`} />
            <span className="text-2xl font-bold text-white">SmartBank</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => onNavigate('home')} 
              className={`${currentPage === 'home' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'} transition`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('deposit')} 
              className={`${currentPage === 'deposit' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'} transition`}
            >
              Deposit
            </button>
            <button 
              onClick={() => onNavigate('withdraw')} 
              className={`${currentPage === 'withdraw' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'} transition`}
            >
              Withdraw
            </button>
            <button 
              onClick={() => onNavigate('dashboard')} 
              className={`${currentPage === 'dashboard' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'} transition`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;