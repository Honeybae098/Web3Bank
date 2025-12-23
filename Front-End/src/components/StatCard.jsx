// src/components/StatCard.jsx
import React from 'react';
import { getIconColorClass } from '../utils/designUtils';

const StatCard = ({ label, value, subtext, icon: Icon, iconColor, index = 0 }) => {
  // Get proper icon color class
  const iconColorClass = getIconColorClass(iconColor);
  
  return (
    <div 
      className="glass-card glass-card-hover p-6 rounded-xl border animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div className="p-2 rounded-lg bg-white bg-opacity-10">
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {subtext && (
          <p className="text-gray-500 text-sm font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
