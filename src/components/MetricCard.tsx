import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-xl p-6 shadow-custom-lg hover:shadow-xl transition-all duration-300 dark-transition`}>
      <h3 className="text-sm font-medium opacity-90 mb-2 truncate" title={title}>
        {title}
      </h3>
      <p className="text-3xl font-bold truncate" title={value}>
        {value}
      </p>
    </div>
  );
};

export default MetricCard;