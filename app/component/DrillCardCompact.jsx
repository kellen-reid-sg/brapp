"use client";

import React from 'react';

const DrillCardCompact = ({ drill, onRemove }) => {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{drill.name}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span className="mr-3">{drill.duration} min</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {drill.difficulty}
            </span>
          </div>
        </div>
        
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove drill"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DrillCardCompact;