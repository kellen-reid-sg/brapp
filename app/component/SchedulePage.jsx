"use client";

import { useState } from 'react';

const SchedulePage = () => {
  const [scheduledSessions, setScheduledSessions] = useState([
    {
      id: '1',
      title: 'Passing Practice',
      date: '2025-05-05',
      time: '16:00',
      duration: 90,
      team: 'U12 Blue Dragons',
      location: 'Field A'
    },
    {
      id: '2',
      title: 'Shooting Drills',
      date: '2025-05-07',
      time: '16:00',
      duration: 90,
      team: 'U12 Blue Dragons',
      location: 'Field B'
    },
    {
      id: '3',
      title: 'Pre-Season Fitness',
      date: '2025-05-08',
      time: '17:30',
      duration: 60,
      team: 'U14 Strikers',
      location: 'Main Field'
    }
  ]);

  // Group sessions by date for display
  const sessionsByDate = scheduledSessions.reduce((acc, session) => {
    // Format date for display
    const dateObj = new Date(session.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    
    acc[formattedDate].push(session);
    return acc;
  }, {});

  // Sort dates for display
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Training Schedule</h1>
        
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 flex items-center"
          onClick={() => alert('Schedule new session form would open here')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Schedule Session
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
          <button className="p-1 hover:bg-green-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-semibold text-lg">May 2025</h2>
          <button className="p-1 hover:bg-green-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Calendar grid (simplified) */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-100 text-center py-2 text-sm font-medium">{day}</div>
          ))}
          
          {/* Placeholder for calendar days - would be dynamically generated in real app */}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 3; // Offset to start May on Thursday (4th column)
            const isCurrentMonth = day >= 1 && day <= 31;
            const hasSession = [5, 7, 8].includes(day); // Match our sample data dates
            
            return (
              <div 
                key={i}
                className={`min-h-[60px] p-1 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${hasSession ? 'relative' : ''}`}
              >
                <div className={`text-right ${hasSession ? 'font-medium' : ''}`}>
                  {isCurrentMonth ? day : ''}
                </div>
                
                {hasSession && isCurrentMonth && (
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
      
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">{date}</h3>
              </div>
              
              <div className="divide-y">
                {sessionsByDate[date].map(session => (
                  <div key={session.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div>
                        <h4 className="font-semibold text-lg text-green-700">{session.title}</h4>
                        <p className="text-gray-600">{session.team}</p>
                      </div>
                      
                      <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                        <div className="flex items-center text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{session.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">View Plan</button>
                      <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Edit</button>
                      <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-lg text-gray-600 mb-4">No sessions scheduled yet</p>
          <button className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">
            Schedule Your First Session
          </button>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;