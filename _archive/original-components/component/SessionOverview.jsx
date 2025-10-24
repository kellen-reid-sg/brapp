"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionOverview = ({
  sessionDuration,
  playerCount,
  selectedComponents,
  sessionPlan,
  onAddDrill
}) => {
  const navigate = useNavigate();
  // Using passed-in sessionPlan instead of local state
  const [componentDurations, setComponentDurations] = useState(() => {
    // Distribute time equally among components initially
    const baseTime = Math.floor(sessionDuration / selectedComponents.length);
    return selectedComponents.reduce((acc, component) => {
      acc[component] = baseTime;
      return acc;
    }, {});
  });

  // Use the passed-in onAddDrill function
  const navigateToDrillSelection = (component) => {
    onAddDrill(component);
  };

  const adjustDuration = (component, change) => {
    if (componentDurations[component] + change < 5) return; // Minimum 5 minutes
    
    setComponentDurations(prev => ({
      ...prev,
      [component]: prev[component] + change
    }));
  };

  const getTotalPlannedDuration = () => {
    return Object.values(componentDurations).reduce((sum, duration) => sum + duration, 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Build Your Session</h1>
        <div className="flex gap-4 text-sm mt-2">
          <div className="flex items-center">
            <span className="font-medium">Players:</span>
            <span className="ml-1">{playerCount}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Total Duration:</span>
            <span className="ml-1">{sessionDuration} min</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Planned:</span>
            <span className="ml-1">{getTotalPlannedDuration()} min</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedComponents.map(component => {
          const componentDrills = sessionPlan[component] || [];
          const totalDrillTime = componentDrills.reduce((sum, drill) => sum + drill.duration, 0);
          
          return (
            <div key={component} className="border rounded-lg overflow-hidden">
              {/* Component Header */}
              <div className="bg-gray-100 p-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg">{component}</h2>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <button 
                      onClick={() => adjustDuration(component, -5)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      aria-label="Decrease duration"
                    >
                      -
                    </button>
                    <span className="mx-2 min-w-[40px] text-center">{componentDurations[component]} min</span>
                    <button 
                      onClick={() => adjustDuration(component, 5)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      aria-label="Increase duration"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Drills in this component */}
              <div className="p-4">
                {componentDrills.length > 0 ? (
                  <div className="space-y-3">
                    {componentDrills.map(drill => (
                      <div key={drill.id} className="flex justify-between items-center p-2 bg-white border rounded">
                        <div>
                          <h3 className="font-medium">{drill.name}</h3>
                          <p className="text-sm text-gray-500">{drill.duration} min</p>
                        </div>
                      </div>
                    ))}
                    <div className="text-right text-sm text-gray-500">
                      Drills: {totalDrillTime} of {componentDurations[component]} min planned
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No drills added yet</p>
                )}
                
                <button 
                  onClick={() => navigateToDrillSelection(component)}
                  className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Drill
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionOverview;