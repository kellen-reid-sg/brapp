"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DrillSelectionModal from '../component/DrillSelectionModal';
import DrillCardCompact from '../component/DrillCardCompact';

// Component metadata mapping
const componentMetadata = {
  warmup: { name: 'Warm-up', icon: '🔥', defaultPercentage: 0.15 }, // 15% of session time
  technical: { name: 'Technical Ball Work', icon: '⚽', defaultPercentage: 0.2 },
  passing: { name: 'Passing', icon: '↔️', defaultPercentage: 0.2 },
  possession: { name: 'Possession', icon: '🔄', defaultPercentage: 0.25 },
  'small-sided': { name: 'Small-Sided Games', icon: '👥', defaultPercentage: 0.25 },
  scrimmage: { name: 'Scrimmage', icon: '🏆', defaultPercentage: 0.3 },
  attacking: { name: 'Attacking Play', icon: '⚔️', defaultPercentage: 0.2 },
  defending: { name: 'Defending', icon: '🛡️', defaultPercentage: 0.2 },
  finishing: { name: 'Finishing', icon: '🥅', defaultPercentage: 0.2 },
  'pattern-play': { name: 'Pattern Play', icon: '📊', defaultPercentage: 0.2 },
  'set-pieces': { name: 'Set Pieces', icon: '🎯', defaultPercentage: 0.15 },
  fitness: { name: 'Fitness & Conditioning', icon: '💪', defaultPercentage: 0.25 },
};

const BuildSessionPage = () => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState({});
  
  // States for drill selection
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  // Extract data from previous steps
  const totalDuration = sessionData.duration || 60; // Default 60 minutes if not set
  const selectedComponents = sessionData.components || []; // Component IDs selected in previous step
  
  // Allocations for each component
  const [allocations, setAllocations] = useState([]);
  
  // Calculated total time allocated
  const [totalAllocated, setTotalAllocated] = useState(0);
  
  // Initialize session data from query params or local storage
  useEffect(() => {
    // In Next.js, we'd typically get this from router.query, localStorage, or a context
    // For this example, we'll just use localStorage or default values
    const savedSessionData = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem('sessionData') || '{}') : {};
    
    setSessionData(savedSessionData);
  }, []);
  
  // Initialize allocations based on selected components
  useEffect(() => {
    if (selectedComponents.length > 0) {
      // Calculate default allocations based on percentage of total time
      // Ensure minimum time per component (5 minutes) and adjust to fit total duration
      
      let tempAllocations = selectedComponents.map(id => {
        const metadata = componentMetadata[id] || { name: 'Unknown', icon: '❓', defaultPercentage: 0.2 };
        
        // Calculate initial duration based on percentage of total time
        let duration = Math.round(totalDuration * metadata.defaultPercentage);
        
        // Ensure minimum duration
        duration = Math.max(duration, 5);
        
        return {
          id,
          name: metadata.name,
          icon: metadata.icon,
          duration,
          originalDuration: duration,
          drills: []
        };
      });
      
      // Adjust allocations to match total time
      const initialTotalAllocated = tempAllocations.reduce((sum, item) => sum + item.duration, 0);
      
      if (initialTotalAllocated !== totalDuration) {
        // Calculate adjustment factor
        const adjustmentFactor = totalDuration / initialTotalAllocated;
        
        // Apply adjustment to each component
        tempAllocations = tempAllocations.map(item => ({
          ...item,
          duration: Math.max(5, Math.round(item.duration * adjustmentFactor)),
          originalDuration: Math.max(5, Math.round(item.duration * adjustmentFactor)),
          drills: []
        }));
        
        // Final adjustment to exactly match total duration
        const adjustedTotal = tempAllocations.reduce((sum, item) => sum + item.duration, 0);
        const diff = totalDuration - adjustedTotal;
        
        if (diff !== 0 && tempAllocations.length > 0) {
          // Add or subtract the difference from the last component
          const lastIndex = tempAllocations.length - 1;
          tempAllocations[lastIndex].duration += diff;
          tempAllocations[lastIndex].originalDuration += diff;
        }
      }
      
      setAllocations(tempAllocations);
    }
  }, [selectedComponents, totalDuration]);
  
  // Update total allocated time when allocations change
  useEffect(() => {
    const newTotal = allocations.reduce((sum, item) => sum + item.duration, 0);
    setTotalAllocated(newTotal);
  }, [allocations]);
  
  // Update component duration
  const updateDuration = (id, newDuration) => {
    if (newDuration < 5) newDuration = 5; // Minimum 5 minutes
    
    setAllocations(allocations.map(item => 
      item.id === id ? { ...item, duration: newDuration } : item
    ));
  };
  
  // Reset all durations to original values
  const resetDurations = () => {
    setAllocations(allocations.map(item => ({
      ...item,
      duration: item.originalDuration
    })));
  };
  
  // Move component up in the order
  const moveComponentUp = (index) => {
    if (index <= 0) return; // Can't move up if it's the first item
    
    const newAllocations = [...allocations];
    const temp = newAllocations[index];
    newAllocations[index] = newAllocations[index - 1];
    newAllocations[index - 1] = temp;
    
    setAllocations(newAllocations);
  };
  
  // Move component down in the order
  const moveComponentDown = (index) => {
    if (index >= allocations.length - 1) return; // Can't move down if it's the last item
    
    const newAllocations = [...allocations];
    const temp = newAllocations[index];
    newAllocations[index] = newAllocations[index + 1];
    newAllocations[index + 1] = temp;
    
    setAllocations(newAllocations);
  };
  
  // Handle back button
  const handleBack = () => {
    router.push('/sessions/structure');
  };
  
  // Handle next button
  const handleNext = () => {
    // Update session data with the time allocations, preserving their order
    const updatedSessionData = {
      ...sessionData,
      allocations: allocations.map(({ id, duration, drills }, index) => ({ 
        id, 
        duration, 
        order: index, 
        drills 
      }))
    };
    
    // Save to localStorage for persistence across pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
    }
    
    // Log the data for now (in a real app, navigate to the next page)
    console.log('Session structure:', updatedSessionData);
    router.push('/sessions/finalize');
  };
  
  // Function to open drill selection modal
  const openDrillModal = (component) => {
    setSelectedComponent(component);
    setShowDrillModal(true);
  };

  // Function to add a drill to a component
  const addDrillToComponent = (drill) => {
    if (!selectedComponent) return;
    
    setAllocations(allocations.map(component => {
      if (component.id === selectedComponent.id) {
        return {
          ...component,
          drills: [...component.drills, drill]
        };
      }
      return component;
    }));
    
    setShowDrillModal(false);
  };

  // Function to remove a drill from a component
  const removeDrillFromComponent = (componentId, drillIndex) => {
    setAllocations(allocations.map(component => {
      if (component.id === componentId) {
        const newDrills = [...component.drills];
        newDrills.splice(drillIndex, 1);
        return {
          ...component,
          drills: newDrills
        };
      }
      return component;
    }));
  };

  // Calculate time status
  const timeRemaining = totalDuration - totalAllocated;
  const timeStatus = timeRemaining === 0 
    ? 'Perfect time allocation' 
    : timeRemaining > 0 
      ? `${timeRemaining} minutes remaining` 
      : `${Math.abs(timeRemaining)} minutes over`;
  
  const timeStatusColor = timeRemaining === 0 
    ? 'text-green-600' 
    : timeRemaining > 0 
      ? 'text-blue-600' 
      : 'text-red-600';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Create Single Session</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold">Step 3: Build Session</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>
      
      {/* Session Name and Date Inputs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="sessionName" className="block text-lg font-semibold mb-2">Session Name</label>
            <input
              type="text"
              id="sessionName"
              placeholder="Enter a name for your session"
              value={sessionData.name || ''}
              onChange={(e) => setSessionData({...sessionData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="sessionDate" className="block text-lg font-semibold mb-2">Session Date</label>
            <input
              type="date"
              id="sessionDate"
              value={sessionData.date || ''}
              onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]} // Set min date to today
            />
          </div>
        </div>
      </div>

      {/* Session Overview Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Session Overview</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Total Duration</p>
            <p className="text-2xl font-bold text-green-700">{totalDuration} min</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Components</p>
            <p className="text-2xl font-bold text-green-700">{selectedComponents.length}</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Players Available</p>
            <p className="text-2xl font-bold text-green-700">{sessionData.playerCount || '–'}</p>
          </div>
        </div>
        
        {timeRemaining !== 0 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={resetDurations}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset to Balanced Durations
            </button>
          </div>
        )}
      </div>

      {/* Component Cards */}
      <div className="space-y-4 mb-8">
        {allocations.map((component, index) => (
          <div key={component.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            {/* Reorder buttons on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-50 border-r flex flex-col items-center justify-center">
              <button 
                onClick={() => moveComponentUp(index)}
                disabled={index === 0}
                data-testid="move-up-button"
                className={`w-8 h-8 flex items-center justify-center text-gray-500 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => moveComponentDown(index)}
                disabled={index === allocations.length - 1}
                data-testid="move-down-button"
                className={`w-8 h-8 flex items-center justify-center text-gray-500 ${index === allocations.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="ml-8">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-medium flex items-center" data-testid="component-name">
                  <span className="mr-2">{component.icon}</span>
                  {component.name}
                </h3>
                <div className="flex items-center space-x-4">
                  {/* Duration Editor */}
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => updateDuration(component.id, component.duration - 5)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <input 
                      type="number" 
                      value={component.duration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          updateDuration(component.id, val);
                        }
                      }}
                      min="5"
                      className="w-12 text-center border rounded py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    
                    <button 
                      onClick={() => updateDuration(component.id, component.duration + 5)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <span className="text-sm text-gray-500 ml-1">min</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {/* Display selected drills */}
                {component.drills.length > 0 && (
                  <div className="mb-4">
                    {component.drills.map((drill, drillIndex) => (
                      <DrillCardCompact
                        key={`${drill.id}-${drillIndex}`}
                        drill={drill}
                        onRemove={() => removeDrillFromComponent(component.id, drillIndex)}
                      />
                    ))}
                  </div>
                )}
                
                {/* Add drill button */}
                <button 
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 hover:text-green-600 transition-colors"
                  onClick={() => openDrillModal(component)}
                >
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Add Drill</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {/* Save Session Template Button */}
        <button
          onClick={() => {
            // Check if session has a name
            if (!sessionData.name) {
              alert('Please name your session before saving as a template.');
              return;
            }
            
            // In a real app, would save to database/localStorage here
            console.log('Saving session template:', sessionData);
            alert(`Session template "${sessionData.name}" saved! Find it in My Sessions.`);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
          Save as Template
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 flex items-center"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 10 10.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Drill Selection Modal */}
      {showDrillModal && selectedComponent && (
        <DrillSelectionModal
          isOpen={showDrillModal}
          componentId={selectedComponent.id}
          componentName={selectedComponent.name}
          onClose={() => setShowDrillModal(false)}
          onSelectDrill={addDrillToComponent}
        />
      )}
    </div>
  );
};

export default BuildSessionPage;