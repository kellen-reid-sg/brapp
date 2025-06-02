"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/Navbar';
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
    // Validate required fields
    if (!sessionData.name || !sessionData.date) {
      alert('Please fill in both Session Name and Session Date before proceeding.');
      return;
    }
    
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
    console.log('Opening drill modal for component:', component);
    console.log('Setting showDrillModal to true');
    setSelectedComponent(component);
    setShowDrillModal(true);
  };

  // Function to add a drill to a component
  const addDrillToComponent = (drill) => {
    console.log('addDrillToComponent called with drill:', drill);
    console.log('selectedComponent:', selectedComponent);
    console.log('current allocations:', allocations);
    
    if (!selectedComponent) {
      console.log('No selected component, returning');
      return;
    }
    
    setAllocations(prevAllocations => {
      const newAllocations = prevAllocations.map(component => {
        if (component.id === selectedComponent.id) {
          const updated = {
            ...component,
            drills: [...component.drills, drill]
          };
          console.log('Updated component:', updated);
          return updated;
        }
        return component;
      });
      console.log('New allocations:', newAllocations);
      return newAllocations;
    });
    
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
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="br-header-container">
        <h1 className="br-main-heading">Create Single Session</h1>
        <p className="br-subheading">Design a training session for your team</p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold" style={{fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', fontStyle: 'italic', transform: 'skew(-5deg)'}}>Step 3: Build Session</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>
  
  {/* Session Name and Date Inputs */}
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>
          SESSION NAME
        </h2>
        <div className="flex justify-center">
          <input
            type="text"
            id="sessionName"
            placeholder="Enter a name for your session *"
            value={sessionData.name || ''}
            onChange={(e) => setSessionData({...sessionData, name: e.target.value})}
            className="bg-white border-2 border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
            style={{width: '450px', height: '50px'}}
            required
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>
          SESSION DATE
        </h2>
        <div className="flex justify-center">
          <input
            type="date"
            id="sessionDate"
            placeholder="mm/dd/yyyy *"
            value={sessionData.date || ''}
            onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
            className="bg-white border-2 border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
            style={{width: '450px', height: '50px'}}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>
    </div>
  </div>

      {/* Session Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>SESSION OVERVIEW</h2>
        
        <div style={{
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '24px',
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '120px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', color: '#000', marginBottom: '8px' }}>Total Duration</div>
            <div style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', color: '#16a34a' }}>{totalDuration} min</div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '120px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', color: '#000', marginBottom: '8px' }}>Components</div>
            <div style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', color: '#16a34a' }}>{selectedComponents.length}</div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '120px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', color: '#000', marginBottom: '8px' }}>Players Available</div>
            <div style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', color: '#16a34a' }}>{sessionData.playerCount || '16'}</div>
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

      {/* Component Cards - Updated styling */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', maxWidth: '800px', margin: '0 auto'}}>
        {allocations.map((component, index) => (
          <div key={component.id} style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            {/* Move up/down arrows - positioned to the left */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              <button 
                onClick={() => moveComponentUp(index)}
                disabled={index === 0}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                  opacity: index === 0 ? 0.3 : 1,
                  fontSize: '18px',
                  color: '#6b7280'
                }}
              >
                ▲
              </button>
              <button 
                onClick={() => moveComponentDown(index)}
                disabled={index === allocations.length - 1}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: index === allocations.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: index === allocations.length - 1 ? 0.3 : 1,
                  fontSize: '18px',
                  color: '#6b7280'
                }}
              >
                ▼
              </button>
            </div>

            {/* Component card */}
            <div style={{backgroundColor: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                {/* Component name and icon */}
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '12px', fontSize: '20px'}}>{component.icon}</span>
                  <span style={{fontWeight: 'bold', fontSize: '20px', color: '#1f2937'}}>{component.name}</span>
                </div>
              
                {/* Duration controls */}
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <button 
                    onClick={() => updateDuration(component.id, component.duration - 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      color: '#374151',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    −
                  </button>
                  
                  <span style={{fontSize: '20px', fontWeight: 'bold', margin: '0 8px', minWidth: '24px', textAlign: 'center', color: 'black'}}>{component.duration}</span>
                  
                  <button 
                    onClick={() => updateDuration(component.id, component.duration + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      color: '#374151',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    +
                  </button>
                  
                  <span style={{fontSize: '14px', color: '#6b7280', marginLeft: '4px'}}>min</span>
                </div>
              </div>
              
              {/* Drill section */}
              <div className="mt-4">
                {/* Display selected drills */}
                {component.drills.length > 0 && (
                  <div className="mb-3 space-y-2">
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
                  className="w-full border-2 border-dashed rounded-lg px-4 py-8 text-center transition-colors flex flex-col items-center justify-center hover:bg-green-50"
                  style={{borderColor: '#ef4444'}}
                  onClick={() => openDrillModal(component)}
                >
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#16a34a'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium text-base text-black">Add Drill (Required) *</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-16">
        <button
          onClick={handleBack}
          className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
          style={{minWidth: '130px', height: '45px'}}
        >
          <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginRight: '8px'}}>«</span>
          <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>BACK</span>
        </button>
        <button
          onClick={handleNext}
          className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
          style={{minWidth: '130px', height: '45px'}}
        >
          <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>NEXT</span>
          <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginLeft: '8px'}}>»</span>
        </button>
      </div>
      
      {/* Drill Selection Modal */}
      {console.log('Modal state - showDrillModal:', showDrillModal, 'selectedComponent:', selectedComponent)}
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
    </>
  );
};

export default BuildSessionPage;