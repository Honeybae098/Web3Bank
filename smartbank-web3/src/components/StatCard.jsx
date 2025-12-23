// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ label, value, subtext, icon: Icon, iconColor }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">{label}</span>
        <Icon className={`w-5 h-5 text-${iconColor}`} />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{subtext}</p>
    </div>
  );
};

export default StatCard;