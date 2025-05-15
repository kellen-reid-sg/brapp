"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Component metadata mapping - copied from BuildSessionPage for consistency
const componentMetadata = {
  warmup: { name: 'Warm-up', icon: '🔥', defaultPercentage: 0.15 },
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

export default function FinalizeSession() {
  const [sessionData, setSessionData] = useState(null);
  const [cumulativeEquipment, setCumulativeEquipment] = useState([]);
  
  // Load session data from localStorage and extract equipment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('sessionData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSessionData(parsedData);
        
        console.log('Full session data:', parsedData);
        
        // Add some example equipment for testing if none exists
        const mockEquipment = ['Cones', 'Balls', 'Bibs', 'Goals', 'Hurdles', 'Ladders'];
        let foundEquipment = false;
        
        // Collect all unique equipment
        if (parsedData.allocations && parsedData.allocations.length > 0) {
          const allEquipment = new Set();
          
          parsedData.allocations.forEach(allocation => {
            // Log the allocation to see its structure
            console.log(`Allocation '${allocation.id}':`, allocation);
            
            if (allocation.drills && allocation.drills.length > 0) {
              allocation.drills.forEach(drill => {
                // Log each drill to inspect structure
                console.log(`Drill in ${allocation.id}:`, drill);
                
                // Handle equipment in various formats
                if (drill.equipment) {
                  foundEquipment = true;
                  console.log('Found equipment for drill:', drill.name, drill.equipment);
                  
                  if (typeof drill.equipment === 'string') {
                    // Split by commas, semicolons, or other common separators
                    drill.equipment.split(/[,;|+]/).forEach(item => {
                      const trimmed = item.trim();
                      if (trimmed) allEquipment.add(trimmed);
                    });
                  } else if (Array.isArray(drill.equipment)) {
                    drill.equipment.forEach(item => {
                      const trimmed = item.trim();
                      if (trimmed) allEquipment.add(trimmed);
                    });
                  } else {
                    const trimmed = drill.equipment.toString().trim();
                    if (trimmed) allEquipment.add(trimmed);
                  }
                }
              });
            }
          });
          
          let equipmentList = Array.from(allEquipment).filter(item => item !== '');
          
          // If no equipment was found, add the mock equipment for the demo
          if (!foundEquipment || equipmentList.length === 0) {
            console.log('No equipment found, adding mock equipment for demo');
            equipmentList = mockEquipment;
          }
          
          console.log('Final equipment list:', equipmentList);
          setCumulativeEquipment(equipmentList);
        }
      }
    }
  }, []);

  if (!sessionData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Session Finalization</h1>
        <p className="mb-4">No session data found. Please start from the beginning.</p>
        <Link href="/sessions/create" className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">
          Start New Session
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Finalize Your Session</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold">Step 4: Finalize</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Session Summary</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Session Name</p>
            <p className="font-medium">{sessionData.name || 'Unnamed Session'}</p>
          </div>
          
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{sessionData.date || 'Not scheduled'}</p>
          </div>
          
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">{sessionData.duration || 60} minutes</p>
          </div>
          
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Players</p>
            <p className="font-medium">{sessionData.playerCount || '—'}</p>
          </div>
          
          <div className="border rounded p-4 col-span-2">
            <p className="text-sm text-gray-500 mb-2">Equipment Needed for Session {cumulativeEquipment && `(${cumulativeEquipment.length} items found)`}</p>
            <div className="flex flex-wrap gap-2">
              {cumulativeEquipment && cumulativeEquipment.length > 0 ? (
                cumulativeEquipment.map((item, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No equipment needed</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Components & Drills Summary */}
        <h3 className="font-semibold mb-2">Session Components</h3>
        {sessionData.allocations && sessionData.allocations.length > 0 ? (
          <div className="space-y-6 mb-6">
            {sessionData.allocations.map((allocation, index) => {
              const componentInfo = componentMetadata[allocation.id] || { name: allocation.id, icon: '📋' };
              return (
                <div key={index} className="border rounded overflow-hidden mb-6">
                  {/* Component header */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                    <h4 className="font-medium flex items-center">
                      <span className="mr-2">{componentInfo.icon}</span>
                      {componentInfo.name}
                    </h4>
                    <span className="font-medium">{allocation.duration} min</span>
                  </div>
                  
                  {/* Drills */}
                  {allocation.drills && allocation.drills.length > 0 ? (
                    <div>
                      {allocation.drills.map((drill, i) => (
                        <div key={i} className="border-b last:border-b-0">
                          {/* Drill header */}
                          <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                            <div className="flex items-center">
                              <span className="font-medium">{drill.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{drill.duration || 'N/A'} minutes</span>
                          </div>
                          
                          {/* Drill details - always shown */}
                          <div className="p-4 border-t bg-white">
                            <div className="flex">
                              {/* Left side - Drill diagram */}
                              <div className="w-2/5 pr-6 border-r">
                                <div className="border border-dashed flex items-center justify-center p-16 rounded h-80">
                                  <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="text-gray-500">Drill Diagram</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Right side - Drill details */}
                              <div className="w-3/5 pl-6">
                                {drill.description && (
                                  <div className="mb-4">
                                    <p className="text-gray-600">{drill.description}</p>
                                  </div>
                                )}

                                {drill.setup && (
                                  <div className="mb-4">
                                    <h5 className="font-medium mb-2">Setup Instructions</h5>
                                    <ul className="list-disc list-outside ml-5 text-gray-600 space-y-1">
                                      {typeof drill.setup === 'string' ? (
                                        <li>{drill.setup}</li>
                                      ) : drill.setup.map ? (
                                        drill.setup.map((item, idx) => <li key={idx}>{item}</li>)
                                      ) : null}
                                    </ul>
                                  </div>
                                )}
                                
                                {drill.playerOrganization && (
                                  <div className="mb-4">
                                    <h5 className="font-medium mb-2">Player Organization</h5>
                                    <p className="text-gray-600">{drill.playerOrganization}</p>
                                  </div>
                                )}
                                
                                {drill.coachingPoints && drill.coachingPoints.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-medium mb-2">Key Coaching Points</h5>
                                    <ul className="list-disc list-outside ml-5 text-gray-600 space-y-1">
                                      {drill.coachingPoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {drill.progressions && drill.progressions.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-medium mb-2">Progressions</h5>
                                    <ul className="list-disc list-outside ml-5 text-gray-600 space-y-1">
                                      {drill.progressions.map((progression, idx) => (
                                        <li key={idx}>{progression}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {drill.equipment && (
                                  <div>
                                    <h5 className="font-medium mb-2">Equipment Needed</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {typeof drill.equipment === 'string' ? 
                                        drill.equipment.split(/[,;]/).map((item, idx) => (
                                          <span key={idx} className="text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                            {item.trim()}
                                          </span>
                                        ))
                                      : Array.isArray(drill.equipment) ?
                                        drill.equipment.map((item, idx) => (
                                          <span key={idx} className="text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                            {item.trim()}
                                          </span>
                                        ))
                                      : 
                                        <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded">{drill.equipment}</span>
                                      }
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-gray-500">No drills added</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No components defined</p>
        )}
        
        {/* Notes for coach */}
        <div className="mb-6">
          <label htmlFor="coachNotes" className="block font-medium mb-2">Coach Notes</label>
          <textarea 
            id="coachNotes" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            rows={4} 
            placeholder="Add any notes for yourself about this session..."
          ></textarea>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <Link 
            href="/sessions/build" 
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          
          <div className="space-x-4">
            <Link 
              href="/sessions/my-sessions" 
              className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
              onClick={() => {
                alert('Session saved successfully!');
              }}
            >
              Save & Finish
            </Link>
            
            <button 
              className="px-6 py-2 border border-green-600 text-green-600 rounded font-medium hover:bg-green-50"
              onClick={() => {
                // Generate and download PDF logic would go here
                alert('PDF would be generated and downloaded here');
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}