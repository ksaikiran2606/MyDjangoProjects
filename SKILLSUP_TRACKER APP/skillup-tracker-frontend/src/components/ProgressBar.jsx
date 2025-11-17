import React from 'react';

const ProgressBar = ({ percentage, label }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-gray-700 dark:text-gray-300">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;