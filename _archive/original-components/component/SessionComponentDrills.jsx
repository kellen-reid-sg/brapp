"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DrillSelectionList from './DrillSelectionList';

const SessionComponentDrills = ({ onAdd, onDone }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const component = searchParams.get('component') || 'Unknown';
  const [addedDrills, setAddedDrills] = React.useState([]);
  
  const componentName = component;
  
  const handleAddDrill = (drill) => {
    setAddedDrills(prev => [...prev, drill]);
    onAdd(drill);
  };
  
  const handleDone = () => {
    onDone();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Select Drills for '{componentName}'
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
            {addedDrills.length} added
          </span>
        </h1>
        <button 
          onClick={handleDone}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          Done
        </button>
      </div>
      
      <DrillSelectionList 
        componentName={componentName} 
        onAddDrill={handleAddDrill} 
      />
      
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <button 
          onClick={handleDone}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          Done - Return to Session
        </button>
      </div>
    </div>
  );
};

export default SessionComponentDrills;