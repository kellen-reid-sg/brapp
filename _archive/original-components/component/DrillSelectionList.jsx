"use client";

import React from 'react';
import DrillCard from './DrillCard';

// Import the drill data
import drills from '../data/drills.json';

const DrillSelectionList = ({ componentName, onAddDrill }) => {
  // Filter drills by the selected component
  const filteredDrills = drills.filter(
    (drill) => drill.component.toLowerCase() === componentName.toLowerCase()
  );

  const handleSelectDrill = (drillId) => {
    const selectedDrill = drills.find((d) => d.id === drillId);
    if (selectedDrill) {
      onAddDrill(selectedDrill);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-2">
      {filteredDrills.length > 0 ? (
        filteredDrills.map((drill) => (
          <DrillCard 
            key={drill.id} 
            drill={drill} 
            onSelect={handleSelectDrill} 
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No drills found for '{componentName}'</p>
        </div>
      )}
    </div>
  );
};

export default DrillSelectionList;