"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateSessionPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    duration: 60, // Default 60 minutes
    playerCount: 16, // Default 16 players
    teamLevel: 'Recreational', // Default team level
    name: '',
    ageGroup: '',
    focus: ''
  });

  // Duration options in minutes with 15-minute increments
  const durationOptions = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
  
  // Handle direct input of custom duration
  const handleCustomDuration = (value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      handleChange('duration', numValue);
    }
  };
  
  // Adjust duration by 15-minute increments
  const adjustDuration = (increment) => {
    const newDuration = sessionData.duration + increment;
    if (newDuration > 0) {
      handleChange('duration', newDuration);
    }
  };
  
  const handleChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Store session data in localStorage for persistence across pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    
    // Navigate to the session structure page
    console.log('Step 1 data:', sessionData);
    router.push('/sessions/structure');
  };

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
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold" style={{fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', fontStyle: 'italic', transform: 'skew(-5deg)'}}>Step 1: Basic Info</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div className="p-8">
        {/* Session Duration Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold italic mb-6" style={{color: '#16a34a'}}>TOTAL SESSION DURATION</h2>
          <div className="relative">
            <div className="flex flex-col items-center justify-center py-6">
              {/* Duration input with pagination style - EXTRA LARGE VERSION */}
              <div className="mb-4">
                <div className="flex flex-row items-center justify-center">
                  <button 
                    onClick={() => {
                      const newDuration = Math.max(30, sessionData.duration - 15);
                      handleChange('duration', newDuration);
                    }}
                    className="bg-white border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center" 
                    disabled={sessionData.duration <= 30}
                    aria-label="Decrease duration"
                    style={{borderRadius: '8px 0 0 8px', margin: 0, height: '55px', width: '55px'}}
                  >
                    <span style={{fontSize: '30px', display: 'flex', alignItems: 'center'}}>«</span>
                  </button>
                  
                  <div className="bg-white border-y-2 border-gray-300 flex items-center justify-center" style={{width: '55px', height: '48px', margin: 0, padding: 0, overflow: 'hidden'}}>
                    <input
                      type="number"
                      value={sessionData.duration}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value)) {
                          // Clamp value between 30 and 120
                          const clampedValue = Math.min(120, Math.max(30, value));
                          handleChange('duration', clampedValue);
                        }
                      }}
                      min="30"
                      max="120"
                      step="15"
                      style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white', color: '#16a34a', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', appearance: 'textfield', padding: '0 0 0 12px', margin: 0}}
                      className="focus:outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={() => {
                      const newDuration = Math.min(120, sessionData.duration + 15);
                      handleChange('duration', newDuration);
                    }}
                    className="bg-white border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    disabled={sessionData.duration >= 120}
                    aria-label="Increase duration"
                    style={{borderRadius: '0 8px 8px 0', margin: 0, height: '55px', width: '55px'}}
                  >
                    <span style={{fontSize: '30px', display: 'flex', alignItems: 'center'}}>»</span>
                  </button>
                </div>
              </div>
              
              {/* Minutes label */}
              <div className="text-2xl text-gray-600 font-medium mt-3 mb-3">minutes</div>
              
              {/* Duration dots indicator */}
              <div className="flex justify-center space-x-3 mt-2">
                {[30, 45, 60, 75, 90, 105, 120].map(option => (
                  <button
                    key={option}
                    onClick={() => handleChange('duration', option)}
                    className={`w-6 h-6 rounded-full ${sessionData.duration === option ? 'bg-[#16a34a]' : 'bg-gray-400'}`}
                    aria-label={`Set duration to ${option} minutes`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Players Available Input */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold italic mb-4" style={{color: '#16a34a'}}>PLAYERS AVAILABLE</h2>
          <div>
            <div className="flex flex-col items-center">
              <div className="relative w-full">
                <input
                  type="number"
                  value={sessionData.playerCount === 0 ? '' : sessionData.playerCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleChange('playerCount', 0);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleChange('playerCount', numValue);
                      }
                    }
                  }}
                  min="1"
                  placeholder="Enter number of players"
                  className="w-full py-2 px-3 bg-white border border-gray-300 rounded text-center text-xl focus:outline-none"
                />

              </div>
              <p className="text-sm text-gray-700 mt-2 text-center">Enter the number of players available for the session</p>
            </div>
          </div>
        </div>

        {/* Team Level Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold italic mb-4" style={{color: '#16a34a'}}>TEAM LEVEL</h2>
          <div>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-1 w-full">
                {['Recreational', 'Intermediate', 'Advanced', 'Elite'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleChange('teamLevel', level)}
                    className={`py-2 px-3 ${sessionData.teamLevel === level ? 'bg-[#16a34a] text-white' : 'bg-white text-gray-700 border border-gray-300'} font-medium transition-colors`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-700 mt-2 text-center">Select the skill level of your team</p>
            </div>
          </div>
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="text-white py-2 px-4 rounded-md flex items-center transition-colors" style={{backgroundColor: '#16a34a', ':hover': {backgroundColor: '#15803d'}}}
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

export default CreateSessionPage;