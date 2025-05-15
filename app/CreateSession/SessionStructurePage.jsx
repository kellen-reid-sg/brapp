"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SessionStructurePage = () => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState({});
  
  // List of available session components
  const [components, setComponents] = useState([
    { id: 'warmup', name: 'Warm-up', icon: '🔥', selected: false },
    { id: 'technical', name: 'Technical Ball Work', icon: '⚽', selected: false },
    { id: 'passing', name: 'Passing', icon: '↔️', selected: false },
    { id: 'possession', name: 'Possession', icon: '🔄', selected: false },
    { id: 'small-sided', name: 'Small-Sided Games', icon: '👥', selected: false },
    { id: 'scrimmage', name: 'Scrimmage', icon: '🏆', selected: false },
    { id: 'attacking', name: 'Attacking Play', icon: '⚔️', selected: false },
    { id: 'defending', name: 'Defending', icon: '🛡️', selected: false },
    { id: 'finishing', name: 'Finishing', icon: '🥅', selected: false },
    { id: 'pattern-play', name: 'Pattern Play', icon: '📊', selected: false },
    { id: 'set-pieces', name: 'Set Pieces', icon: '🎯', selected: false },
    { id: 'fitness', name: 'Fitness & Conditioning', icon: '💪', selected: false },
  ]);

  // Load session data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      setSessionData(savedSessionData);
    }
  }, []);

  // Save selected components to session data when they change
  useEffect(() => {
    const selectedComponents = components.filter(c => c.selected).map(c => c.id);
    setSessionData(prev => ({
      ...prev,
      components: selectedComponents
    }));
  }, [components]);

  // Toggle component selection
  const toggleComponent = (id) => {
    setComponents(components.map(component => 
      component.id === id 
        ? { ...component, selected: !component.selected } 
        : component
    ));
  };

  // Go back to previous step
  const handleBack = () => {
    router.push('/sessions/create');
  };

  // Move to next step
  const handleNext = () => {
    // Save session data to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    
    // Navigate to the build session page
    router.push('/sessions/build');
  };

  // Count selected components
  const selectedCount = components.filter(c => c.selected).length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Create Single Session</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold">Step 2: Session Structure</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-2">Select Session Components</h2>
        <p className="text-gray-600 mb-6">Choose the components you want to include in your training session.</p>

        {/* Components Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {components.map(component => (
            <button
              key={component.id}
              onClick={() => toggleComponent(component.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${component.selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="text-3xl mb-2">{component.icon}</div>
              <div className="text-center font-medium text-sm">{component.name}</div>
              
              {/* Selection indicator */}
              {component.selected && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected components count */}
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-gray-600">
            {selectedCount === 0 
              ? 'No components selected' 
              : `${selectedCount} component${selectedCount !== 1 ? 's' : ''} selected`}
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          <button
            onClick={handleNext}
            className={`px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 flex items-center ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedCount === 0}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 10 10.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionStructurePage;