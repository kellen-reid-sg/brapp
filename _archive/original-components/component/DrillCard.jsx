"use client";

import React from 'react';

const DrillCard = ({ drill, onSelect }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{drill.name}</h3>
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {drill.difficulty}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{drill.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{drill.duration} min</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {drill.skillFocus.map(skill => (
            <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1">
          {drill.equipment.map(item => (
            <span key={item} className="text-xs px-1 py-0.5 bg-gray-100 rounded">
              {item}
            </span>
          ))}
        </div>
        <button 
          onClick={() => onSelect && onSelect(drill.id)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors min-h-[44px] min-w-[44px]"
        >
          Add to Session
        </button>
      </div>
    </div>
  );
};

export default DrillCard;