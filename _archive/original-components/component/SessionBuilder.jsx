"use client";

import { useState } from 'react';

const SessionBuilder = () => {
  const [sessionName, setSessionName] = useState('');
  const [drills, setDrills] = useState([]);
  
  const addNewDrill = () => {
    const newDrill = {
      id: Date.now().toString(),
      title: '',
      duration: 10,
      description: '',
      setup: ''
    };
    
    setDrills([...drills, newDrill]);
  };
  
  const removeDrill = (id) => {
    setDrills(drills.filter(drill => drill.id !== id));
  };
  
  const updateDrill = (id, field, value) => {
    setDrills(drills.map(drill => 
      drill.id === id ? { ...drill, [field]: value } : drill
    ));
  };
  
  const handleSaveSession = () => {
    // Save session functionality will go here
    console.log({ sessionName, drills });
    alert('Session saved! (Not actually saved yet - just a demo)');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Create Training Session</h1>
      
      <div className="mb-6">
        <label htmlFor="sessionName" className="block mb-2 font-medium">Session Name</label>
        <input
          type="text"
          id="sessionName"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., U14 Passing and Movement Training"
        />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Drills & Activities</h2>
        
        {drills.map((drill) => (
          <div key={drill.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={drill.title}
                onChange={(e) => updateDrill(drill.id, 'title', e.target.value)}
                className="font-medium text-lg w-2/3 border-b border-dashed border-gray-300 focus:outline-none focus:border-green-500"
                placeholder="Drill Title"
              />
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Duration (min):</span>
                  <input
                    type="number"
                    value={drill.duration}
                    onChange={(e) => updateDrill(drill.id, 'duration', parseInt(e.target.value) || 0)}
                    className="w-16 p-1 border rounded text-center"
                    min="1"
                  />
                </div>
                <button
                  onClick={() => removeDrill(drill.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                  value={drill.description}
                  onChange={(e) => updateDrill(drill.id, 'description', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  rows={2}
                  placeholder="What is this drill about? What skills does it develop?"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Setup & Instructions</label>
                <textarea
                  value={drill.setup}
                  onChange={(e) => updateDrill(drill.id, 'setup', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  rows={3}
                  placeholder="How to set up the drill? What do players do?"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addNewDrill}
          className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-green-500 hover:text-green-500 transition-colors"
        >
          + Add Drill
        </button>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSession}
          disabled={!sessionName || drills.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save Session
        </button>
      </div>
    </div>
  );
};

export default SessionBuilder;