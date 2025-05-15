"use client";

import React, { useState, useEffect } from 'react';
import drillsData from '../data/drills.json';

const DrillSelectionModal = ({
  isOpen,
  componentId,
  componentName,
  onClose,
  onSelectDrill
}) => {
  const [drills, setDrills] = useState([]);
  
  // Filter drills by component when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Map from componentId to a string we can match against component names in drills.json
      const componentMap = {
        warmup: 'Warm-up',
        technical: 'Technical Ball Work',
        passing: 'Passing',
        possession: 'Possession',
        'small-sided': 'Small-Sided Games',
        scrimmage: 'Scrimmage',
        attacking: 'Attacking Play',
        defending: 'Defending',
        finishing: 'Finishing',
        'pattern-play': 'Pattern Play',
        'set-pieces': 'Set Pieces',
        fitness: 'Fitness & Conditioning',
      };
      
      const searchTerm = componentMap[componentId] || componentName;
      
      // Filter drills based on component name
      const filteredDrills = drillsData.filter(
        drill => drill.component.toLowerCase() === searchTerm.toLowerCase()
      );
      
      setDrills(filteredDrills);
    }
  }, [isOpen, componentId, componentName]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} onClick={onClose}>
      <div className="bg-white/95 rounded-lg border border-gray-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col ring-1 ring-green-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b sticky top-0 bg-white/95 z-10 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">Select a {componentName} Drill</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          {drills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drills.map(drill => (
                <div 
                  key={drill.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectDrill(drill)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{drill.name}</h3>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {drill.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{drill.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{drill.duration} min</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {drill.skillFocus.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No drills found for {componentName}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t sticky bottom-0 bg-white/95 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillSelectionModal;