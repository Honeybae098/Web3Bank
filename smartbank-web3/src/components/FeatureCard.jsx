// src/components/FeatureCard.jsx
import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, iconColor }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200">
      <Icon className={`w-12 h-12 text-${iconColor} mb-4`} />
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;