"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/Navbar';
import drillsData from '../data/drills.json';

const FinalizeSessionPage = () => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState({});
  const [uniqueEquipment, setUniqueEquipment] = useState([]);
  const [expandedDrills, setExpandedDrills] = useState({});

  // Load session data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      setSessionData(savedSessionData);

      // Extract unique equipment from selected drills
      if (savedSessionData.allocations) {
        const equipment = new Set();
        
        savedSessionData.allocations.forEach(allocation => {
          if (allocation.drills) {
            allocation.drills.forEach(drill => {
              // Find the full drill data from drills.json
              const fullDrill = drillsData.find(d => d.id === drill.id || d.name === drill.name);
              if (fullDrill && fullDrill.equipment) {
                fullDrill.equipment.forEach(item => equipment.add(item));
              }
            });
          }
        });
        
        setUniqueEquipment(Array.from(equipment));
      }
    }
  }, []);

  const handleComplete = () => {
    // Navigate to sessions overview or save confirmation
    alert('Session created successfully!');
    router.push('/sessions');
  };

  const toggleDrillExpansion = (drillKey) => {
    setExpandedDrills(prev => ({
      ...prev,
      [drillKey]: !prev[drillKey]
    }));
  };

  const getTotalDrills = () => {
    if (!sessionData.allocations) return 0;
    return sessionData.allocations.reduce((total, allocation) => {
      return total + (allocation.drills ? allocation.drills.length : 0);
    }, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'June 3rd, 2025';
    
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${month} ${getOrdinalSuffix(day)}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
            <div className="flex-shrink-0 mx-2 text-green-500 font-bold" style={{fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', fontStyle: 'italic', transform: 'skew(-5deg)'}}>Step 4: Finalize Session</div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
        </div>

        {/* Session Summary - Reduced width Bento Box Layout */}
        <div style={{backgroundColor: '#f9fafb', borderRadius: '12px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', maxWidth: '900px', margin: '0 auto 16px auto'}}>
          <div className="grid grid-cols-12 gap-2">
            {/* Session Name & Date - Large section */}
            <div className="col-span-8" style={{backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #000000', padding: '12px', textAlign: 'center'}}>
              <h2 style={{color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', marginBottom: '0.125rem'}}>
                {sessionData.name || 'Test'}
              </h2>
              <p style={{color: '#000000', fontSize: '0.75rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', marginBottom: '0.5rem'}}>
                {formatDate(sessionData.date)}
              </p>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <textarea 
                  placeholder="Session Description - Add a couple of sentences about this session..."
                  style={{
                    width: '85%',
                    color: '#000000',
                    fontSize: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '8px',
                    resize: 'vertical',
                    minHeight: '40px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Team Selection - Top right section */}
            <div className="col-span-4" style={{backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #000000', padding: '14px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <p style={{color: '#000000', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif'}}>Team</p>
              <select 
                style={{
                  width: '100%',
                  color: '#000000',
                  fontSize: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '5px 8px',
                  fontFamily: 'inherit',
                  backgroundColor: 'white'
                }}
                defaultValue=""
              >
                <option value="" disabled>Select Team</option>
                <option value="team1">Team 1</option>
                <option value="team2">Team 2</option>
                <option value="team3">Team 3</option>
                <option value="team4">Team 4</option>
              </select>
            </div>

            {/* Equipment Section - Full width */}
            <div className="col-span-12" style={{backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #000000', padding: '12px', textAlign: 'center'}}>
              <h3 style={{color: '#000000', fontSize: '0.875rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', marginBottom: '0.5rem'}}>Equipment Needed:</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px'}}>
                {uniqueEquipment.length > 0 ? (
                  uniqueEquipment.map((item, idx) => (
                    <span 
                      key={idx} 
                      style={{backgroundColor: '#fef3c7', color: '#000000', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <>
                    <span style={{backgroundColor: '#fef3c7', color: '#000000', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>Cones</span>
                    <span style={{backgroundColor: '#fef3c7', color: '#000000', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>Balls</span>
                    <span style={{backgroundColor: '#fef3c7', color: '#000000', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>Bibs</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Separate stat boxes matching BuildSessionPage */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px'}}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '180px',
            height: '100px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', color: '#000000', marginBottom: '8px' }}>Total Duration</div>
            <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>
              {sessionData.duration || 60} min
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '180px',
            height: '100px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', color: '#000000', marginBottom: '8px' }}>Total Drills</div>
            <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>{getTotalDrills()}</div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '180px',
            height: '100px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', color: '#000000', marginBottom: '8px' }}>Team Level</div>
            <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>
              {sessionData.teamLevel || 'Rec'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '180px',
            height: '100px',
            padding: '16px 8px',
            borderRadius: '20px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', fontStyle: 'italic', fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', color: '#000000', marginBottom: '8px' }}>Players</div>
            <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>
              {sessionData.playerCount || '16'}
            </div>
          </div>
        </div>

        {/* Session Flow */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>SESSION FLOW</h2>
          
          {/* Session Components and Drills */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center'}}>
            {sessionData.allocations && sessionData.allocations.map((allocation, index) => (
              <div key={index} style={{width: '100%', maxWidth: '1000px'}}>
                {/* Drills for this component */}
                {allocation.drills && allocation.drills.map((drill, drillIndex) => {
                  // Find the full drill data from drills.json
                  const fullDrill = drillsData.find(d => d.id === drill.id || d.name === drill.name);
                  
                  if (!fullDrill) return null;

                  const drillKey = `${allocation.id}-${drillIndex}`;
                  const isExpanded = expandedDrills[drillKey] !== false; // Default to expanded

                  return (
                    <div key={drillIndex} style={{
                      padding: '24px',
                      borderRadius: '20px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      marginBottom: '16px'
                    }}>
                      {/* Component Header within drill box */}
                      <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '12px',
                        border: '2px solid #000000',
                        borderRadius: '50px',
                        padding: '12px 20px',
                        backgroundColor: 'transparent'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{fontSize: '20px', marginRight: '8px'}}>
                            {allocation.id === 'warmup' && '🔥'}
                            {allocation.id === 'technical' && '⚽'}
                            {allocation.id === 'passing' && '↔️'}
                            {allocation.id === 'possession' && '🔄'}
                            {allocation.id === 'small-sided' && '👥'}
                            {allocation.id === 'scrimmage' && '🏆'}
                            {allocation.id === 'attacking' && '⚔️'}
                            {allocation.id === 'defending' && '🛡️'}
                            {allocation.id === 'finishing' && '🥅'}
                            {allocation.id === 'pattern-play' && '📊'}
                            {allocation.id === 'set-pieces' && '🎯'}
                            {allocation.id === 'fitness' && '💪'}
                          </span>
                          <span style={{
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            fontStyle: 'italic', 
                            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', 
                            color: '#000000'
                          }}>
                            {allocation.id === 'warmup' && 'Warm-up'}
                            {allocation.id === 'technical' && 'Technical Ball Work'}
                            {allocation.id === 'passing' && 'Passing'}
                            {allocation.id === 'possession' && 'Possession'}
                            {allocation.id === 'small-sided' && 'Small-Sided Games'}
                            {allocation.id === 'scrimmage' && 'Scrimmage'}
                            {allocation.id === 'attacking' && 'Attacking Play'}
                            {allocation.id === 'defending' && 'Defending'}
                            {allocation.id === 'finishing' && 'Finishing'}
                            {allocation.id === 'pattern-play' && 'Pattern Play'}
                            {allocation.id === 'set-pieces' && 'Set Pieces'}
                            {allocation.id === 'fitness' && 'Fitness & Conditioning'}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: '#16a34a'
                        }}>
                          {allocation.duration} min
                        </span>
                      </div>

                      {/* Drill Header with collapse toggle */}
                      <div style={{display: 'flex', alignItems: 'center', marginBottom: isExpanded ? '20px' : '0px', cursor: 'pointer'}} onClick={() => toggleDrillExpansion(drillKey)}>
                        <span style={{
                          fontSize: '16px',
                          color: '#6b7280',
                          marginRight: '8px',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}>
                          ▶
                        </span>
                        <h4 style={{
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          fontStyle: 'italic', 
                          fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', 
                          color: '#000000',
                          margin: '0'
                        }}>
                          {fullDrill.name}
                        </h4>
                      </div>

                      {/* Drill Content - Only show when expanded */}
                      {isExpanded && (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                          {/* Left Side - Drill Diagram */}
                          <div>
                            <div style={{
                              backgroundColor: '#f3f4f6',
                              border: '2px dashed #d1d5db',
                              borderRadius: '12px',
                              padding: '48px 24px',
                              textAlign: 'center',
                              minHeight: '300px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <div style={{fontSize: '48px', marginBottom: '8px', color: '#9ca3af'}}>🖼️</div>
                              <span style={{color: '#6b7280', fontWeight: '500', fontSize: '16px'}}>Drill Diagram</span>
                              <span style={{color: '#9ca3af', fontSize: '14px', marginTop: '4px'}}>Coming Soon</span>
                            </div>
                          </div>

                          {/* Right Side - Drill Details */}
                          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            {/* Setup Instructions */}
                            <div>
                              <h5 style={{
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontStyle: 'italic', 
                                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                                fontSize: '16px'
                              }}>
                                Setup Instructions
                              </h5>
                              <ul style={{listStyleType: 'disc', paddingLeft: '20px', color: '#374151'}}>
                                {fullDrill.setupInstructions && fullDrill.setupInstructions.map((instruction, idx) => (
                                  <li key={idx} style={{fontSize: '14px', marginBottom: '4px'}}>{instruction}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Player Organization */}
                            <div>
                              <h5 style={{
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontStyle: 'italic', 
                                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                                fontSize: '16px'
                              }}>
                                Player Organization
                              </h5>
                              <p style={{color: '#374151', fontSize: '14px'}}>
                                {fullDrill.playerOrganization || "Players work in groups of 4-5 with one ball per group."}
                              </p>
                            </div>

                            {/* Key Coaching Points */}
                            <div>
                              <h5 style={{
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontStyle: 'italic', 
                                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                                fontSize: '16px'
                              }}>
                                Key Coaching Points
                              </h5>
                              <ul style={{listStyleType: 'disc', paddingLeft: '20px', color: '#374151'}}>
                                {fullDrill.coachingPoints && fullDrill.coachingPoints.map((point, idx) => (
                                  <li key={idx} style={{fontSize: '14px', marginBottom: '4px'}}>{point}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Progressions */}
                            <div>
                              <h5 style={{
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontStyle: 'italic', 
                                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                                fontSize: '16px'
                              }}>
                                Progressions
                              </h5>
                              <ul style={{listStyleType: 'disc', paddingLeft: '20px', color: '#374151'}}>
                                {fullDrill.progressions && fullDrill.progressions.map((progression, idx) => (
                                  <li key={idx} style={{fontSize: '14px', marginBottom: '4px'}}>{progression}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Equipment Needed */}
                            <div>
                              <h5 style={{
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontStyle: 'italic', 
                                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                                fontSize: '16px'
                              }}>
                                Equipment Needed
                              </h5>
                              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                {fullDrill.equipment && fullDrill.equipment.map((item, idx) => (
                                  <span key={idx} style={{
                                    backgroundColor: '#fef3c7', 
                                    color: '#000000', 
                                    padding: '4px 12px', 
                                    borderRadius: '8px', 
                                    fontSize: '14px', 
                                    fontWeight: '500'
                                  }}>
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="relative flex justify-between items-center mt-16">
          {/* Left - Back Button */}
          <button
            onClick={() => router.back()}
            className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
            style={{minWidth: '130px', height: '45px'}}
          >
            <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginRight: '8px'}}>«</span>
            <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>BACK</span>
          </button>
          
          {/* Center - Share and Generate PDF Buttons - Positioned to align with drill boxes above */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={() => alert('Share functionality coming soon!')}
              className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
              style={{minWidth: '130px', height: '45px'}}
            >
              <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>SHARE</span>
              <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginLeft: '8px'}}>↗</span>
            </button>
            
            <button
              onClick={() => alert('PDF generation coming soon!')}
              className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
              style={{minWidth: '160px', height: '45px'}}
            >
              <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>GENERATE PDF</span>
              <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginLeft: '8px'}}>📄</span>
            </button>
          </div>
          
          {/* Right - Save & Complete Button */}
          <button
            onClick={handleComplete}
            className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
            style={{minWidth: '220px', height: '45px'}}
          >
            <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>SAVE & COMPLETE SESSION</span>
            <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginLeft: '8px'}}>✓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizeSessionPage;