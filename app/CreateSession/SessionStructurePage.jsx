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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="br-header-container">
        <h1 className="br-main-heading">Create Single Session</h1>
        <p className="br-subheading">Design a training session for your team</p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold" style={{fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', fontStyle: 'italic', transform: 'skew(-5deg)'}}>Step 2: Session Structure</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>SELECT SESSION COMPONENTS</h2>
        <p className="text-gray-600 mb-6 text-center italic">Choose the components you want to include in your training session.</p>

        {/* Components Grid */}
        <div style={{
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {components.map(component => (
            <div key={component.id} style={{ width: 'calc(25% - 18px)' }}>
              <button
                onClick={() => toggleComponent(component.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '120px',
                  padding: '16px 8px',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  border: component.selected ? '4px solid #16a34a' : '1px solid #d1d5db',
                  transition: 'all 0.3s',
                  position: 'relative',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{component.icon}</div>
                <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '700' }}>{component.name}</div>
                
                {/* Selection indicator */}
                {component.selected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Selected components count */}
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-gray-600 italic">
            {selectedCount === 0 
              ? 'No components selected' 
              : `${selectedCount} component${selectedCount !== 1 ? 's' : ''} selected`}
          </span>
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
            disabled={selectedCount === 0}
          >
            <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>NEXT</span>
            <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginLeft: '8px'}}>»</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionStructurePage;