"use client";

import { useState } from 'react';
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

  // Duration options in minutes
  const durationOptions = [30, 45, 60, 75, 90, 105, 120];
  
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
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Create Single Session</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 border-t-2 border-green-500"></div>
          <div className="flex-shrink-0 mx-2 text-green-500 font-bold">Step 1: Basic Info</div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Session Duration Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Total Session Duration</h2>
          <div className="relative overflow-hidden">
            <div className="flex justify-center py-4 bg-gray-50 rounded-lg">
              {/* Previous button */}
              <button 
                onClick={() => {
                  const currentIndex = durationOptions.indexOf(sessionData.duration);
                  if (currentIndex > 0) {
                    handleChange('duration', durationOptions[currentIndex - 1]);
                  }
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Duration display */}
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600">{sessionData.duration}</span>
                <span className="text-xl text-gray-600 ml-2">minutes</span>
              </div>

              {/* Next button */}
              <button 
                onClick={() => {
                  const currentIndex = durationOptions.indexOf(sessionData.duration);
                  if (currentIndex < durationOptions.length - 1) {
                    handleChange('duration', durationOptions[currentIndex + 1]);
                  }
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Duration ticks */}
            <div className="flex justify-center mt-3 space-x-2">
              {durationOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleChange('duration', option)}
                  className={`w-2 h-2 rounded-full ${sessionData.duration === option ? 'bg-green-500' : 'bg-gray-300'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Players Available Input */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Players Available</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-xs">
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
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-xl text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Enter the number of players available for the session</p>
            </div>
          </div>
        </div>

        {/* Team Level Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Team Level</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-3 w-full max-w-md sm:grid-cols-4">
                {['Recreational', 'Intermediate', 'Advanced', 'Elite'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleChange('teamLevel', level)}
                    className={`py-3 px-4 rounded-lg flex items-center justify-center h-12 ${sessionData.teamLevel === level ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'} font-medium transition-colors`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Select the skill level of your team</p>
            </div>
          </div>
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 flex items-center"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 10 10.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4 10a1 1 0 011-1h9a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;