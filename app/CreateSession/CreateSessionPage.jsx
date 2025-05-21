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
          <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>TOTAL SESSION DURATION</h2>
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
          <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>PLAYERS AVAILABLE</h2>
          <div className="relative">
            <div className="flex flex-col items-center justify-center py-6">
              {/* Player count input with pagination style */}
              <div className="mb-4">
                <div className="flex flex-row items-center justify-center">
                  <button 
                    onClick={() => {
                      const newCount = Math.max(1, sessionData.playerCount - 1);
                      handleChange('playerCount', newCount);
                    }}
                    className="bg-white border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center" 
                    disabled={sessionData.playerCount <= 1}
                    aria-label="Decrease player count"
                    style={{borderRadius: '8px 0 0 8px', margin: 0, height: '55px', width: '55px'}}
                  >
                    <span style={{fontSize: '30px', display: 'flex', alignItems: 'center'}}>«</span>
                  </button>
                  
                  <div className="bg-white border-y-2 border-gray-300 flex items-center justify-center" style={{width: '55px', height: '48px', margin: 0, padding: 0, overflow: 'hidden'}}>
                    <input
                      type="number"
                      value={sessionData.playerCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value)) {
                          // Clamp value between 1 and 30
                          const clampedValue = Math.min(30, Math.max(1, value));
                          handleChange('playerCount', clampedValue);
                        }
                      }}
                      min="1"
                      max="30"
                      style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white', color: '#16a34a', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', appearance: 'textfield', padding: '0 0 0 12px', margin: 0}}
                      className="focus:outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={() => {
                      const newCount = Math.min(30, sessionData.playerCount + 1);
                      handleChange('playerCount', newCount);
                    }}
                    className="bg-white border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                    disabled={sessionData.playerCount >= 30}
                    aria-label="Increase player count"
                    style={{borderRadius: '0 8px 8px 0', margin: 0, height: '55px', width: '55px'}}
                  >
                    <span style={{fontSize: '30px', display: 'flex', alignItems: 'center'}}>»</span>
                  </button>
                </div>
              </div>
              
              {/* Players label */}
              <div className="text-2xl text-gray-600 font-medium mt-3 mb-3">players</div>
            </div>
          </div>
        </div>

        {/* Team Level Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold italic mb-6 text-center border-2 border-white py-2 rounded-full" style={{color: '#16a34a'}}>TEAM LEVEL</h2>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-4 w-full max-w-xl">
              {['Recreational', 'Intermediate', 'Advanced', 'Elite'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleChange('teamLevel', level)}
                  className={`py-3 px-5 rounded-full text-lg transition-colors ${sessionData.teamLevel === level 
                    ? 'bg-[#16a34a] border-2 border-[#16a34a]' 
                    : 'bg-white text-[#16a34a] border-2 border-gray-300 hover:border-gray-400'}`}
                  style={{
                    minWidth: '120px', 
                    height: '50px', 
                    fontWeight: 800,
                    color: sessionData.teamLevel === level ? 'white' : '#16a34a'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-700 mt-4 text-center">Select the skill level of your team</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-16">
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black py-2 px-6 rounded-full flex items-center justify-center transition-colors border-2 border-gray-300 hover:border-gray-400"
            style={{minWidth: '130px', height: '45px'}}
          >
            <span style={{fontSize: '22px', display: 'flex', alignItems: 'center', marginRight: '8px'}}>«</span>
            <span style={{fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '16px'}}>HOME</span>
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
      </div>
    </div>
  );
};

export default CreateSessionPage;