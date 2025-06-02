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
  console.log('DrillSelectionModal render - isOpen:', isOpen, 'componentId:', componentId, 'componentName:', componentName);
  const [drills, setDrills] = useState([]);
  const [hoveredDrill, setHoveredDrill] = useState(null);
  
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-black';
      case 'advanced':
        return 'bg-orange-500 text-white';
      case 'elite':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  if (!isOpen) {
    console.log('DrillSelectionModal - not open, returning null');
    return null;
  }
  
  console.log('DrillSelectionModal - rendering modal with drills:', drills.length);
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      onClick={onClose}
    >
      <div 
        className="shadow-2xl max-w-5xl w-full max-h-[80vh] flex flex-col mx-4"
        style={{
          position: 'relative',
          maxWidth: '1000px',
          width: '90%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b sticky top-0 z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', position: 'relative', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
          <div className="flex justify-center items-center">
            <h2 
              className="text-xl font-semibold" 
              style={{ 
                color: '#000000',
                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                fontStyle: 'italic',
                fontWeight: '800',
                transform: 'skew(-5deg)',
                letterSpacing: '0.01em',
                textTransform: 'uppercase'
              }}
            >
              Select a {componentName} Drill
            </h2>
            <button 
              onClick={onClose}
              style={{ 
                position: 'absolute',
                top: '24px',
                right: '24px',
                color: '#6B7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '24px 36px' }}>
          {drills.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
              {drills.map(drill => (
                <div 
                  key={drill.id}
                  className="cursor-pointer transition-all duration-200"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '8px',
                    boxShadow: hoveredDrill === drill.id ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '220px'
                  }}
                  onMouseEnter={() => setHoveredDrill(drill.id)}
                  onMouseLeave={() => setHoveredDrill(null)}
                  onClick={() => onSelectDrill(drill)}
                >
                  <div className="flex justify-between mb-3" style={{ alignItems: 'flex-start' }}>
                    <h3 
                      className="text-lg font-semibold flex-1 pr-2" 
                      style={{ 
                        color: '#000000',
                        fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                        fontStyle: 'italic',
                        fontWeight: '800',
                        transform: 'skew(-5deg)',
                        letterSpacing: '0.01em',
                        textTransform: 'uppercase',
                        lineHeight: '1.2'
                      }}
                    >
                      {drill.name}
                    </h3>
                    <span 
                      style={{ 
                        display: 'inline-block',
                        padding: '6px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '20px',
                        backgroundColor: drill.difficulty?.toLowerCase() === 'beginner' ? '#10B981' : 
                                       drill.difficulty?.toLowerCase() === 'intermediate' ? '#F59E0B' :
                                       drill.difficulty?.toLowerCase() === 'advanced' ? '#F97316' :
                                       drill.difficulty?.toLowerCase() === 'elite' ? '#EF4444' : '#6B7280',
                        color: drill.difficulty?.toLowerCase() === 'intermediate' ? '#000000' : '#FFFFFF',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    >
                      {drill.difficulty}
                    </span>
                  </div>
                  
                  <div style={{ flex: '1', marginBottom: '16px' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>{drill.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                    <div>
                      <span className="text-sm font-medium" style={{ color: '#000000' }}>{drill.duration} min</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
                      {drill.skillFocus.map(skill => (
                        <span 
                          key={skill} 
                          style={{ 
                            backgroundColor: '#E5E7EB',
                            color: '#000000',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" style={{ backgroundColor: '#FFFFFF' }}>
              <p className="text-lg" style={{ color: '#000000' }}>No drills found for {componentName}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t sticky bottom-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            style={{ color: '#000000' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillSelectionModal;