// src/pages/Home.jsx
import React from 'react';
import { Shield, Lock, Globe, TrendingUp } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: Lock,
      iconColor: "blue-400",
      title: "Secure Storage",
      description: "Your ETH is protected by smart contract security. Only you can access and withdraw your funds."
    },
    {
      icon: Globe,
      iconColor: "purple-400",
      title: "Borderless Access",
      description: "Access your funds from anywhere in the world, anytime. No intermediaries, no restrictions."
    },
    {
      icon: TrendingUp,
      iconColor: "green-400",
      title: "Full Transparency",
      description: "Track every transaction on the blockchain. Immutable history and real-time balance updates."
    }
  ];

  const benefits = [
    "Enforced savings system with structured deposits",
    "Complete transaction history tracking",
    "Input validation and safety checks",
    "Protection against common user mistakes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <nav className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">SmartBank</span>
            </div>
            <button 
              onClick={() => onNavigate('deposit')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Decentralized Banking Solution
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Store, manage, and track your ETH securely with blockchain technology. 
            Transparent, borderless, and always in your control.
          </p>
          <button 
            onClick={() => onNavigate('deposit')}
            className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="mt-20 bg-white bg-opacity-5 backdrop-blur-md p-12 rounded-2xl border border-white border-opacity-10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why SmartBank?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;