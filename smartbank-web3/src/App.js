// src/App.jsx
import React, { useState } from 'react';
import HomePage from './pages/Home';
import DepositPage from './pages/Deposit';
import WithdrawPage from './pages/Withdraw';
import DashboardPage from './pages/Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'deposit':
        return <DepositPage onNavigate={setCurrentPage} />;
      case 'withdraw':
        return <WithdrawPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}