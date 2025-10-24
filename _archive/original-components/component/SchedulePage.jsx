"use client";

import { useState } from 'react';
import Navbar from './Navbar';

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [expandedSessions, setExpandedSessions] = useState({});
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

  // Calendar navigation functions
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      // Navigate by weeks
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      // Navigate by months
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToThisMonth = () => {
    setCurrentDate(new Date());
  };

  const toggleSessionExpansion = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Convert military time to 12-hour format
  const convertTo12HourFormat = (militaryTime) => {
    const [hours, minutes] = militaryTime.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    if (view === 'week') {
      // Week view: show Monday to Sunday of current week
      const days = [];
      const today = new Date(currentDate);
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Calculate Monday of the current week
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      
      // Generate 7 days starting from Monday
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        days.push(date);
      }
      return days;
    } else {
      // Month view: show full month grid
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
      
      const days = [];
      for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push(date);
      }
      return days;
    }
  };

  const getSessionsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduledSessions.filter(session => session.date === dateString);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  
  // Generate current week range for display
  const getCurrentWeekRange = () => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay();
    
    // Calculate Monday of the current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    
    // Calculate Sunday of the current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const mondayStr = `${monthNames[monday.getMonth()]} ${monday.getDate()}`;
    const sundayStr = `${monthNames[sunday.getMonth()]} ${sunday.getDate()}`;
    
    return `${mondayStr} - ${sundayStr}`;
  };
  
  const calendarDays = generateCalendarDays();

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Centered Title */}
        <div className="br-header-container" style={{marginBottom: '3rem', textAlign: 'center'}}>
          <h1 className="br-main-heading">Training Schedule</h1>
        </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        {/* Calendar Header */}
        <div className="bg-gray-50 px-6 py-4 border-b relative">
          <div className="flex justify-between items-center">
            {/* Left side - Calendar title */}
            <div className="flex items-center">
              <h2 className="nav-link" style={{color: '#374151', textShadow: 'none', padding: '0', fontSize: '1.25rem'}}>Calendar</h2>
            </div>
            
            {/* Right side - Controls */}
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setView('week')}
                  className={`br-button ${view === 'week' ? 'opacity-100' : 'opacity-70'}`}
                  style={{fontSize: '0.875rem', padding: '8px 16px'}}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`br-button ${view === 'month' ? 'opacity-100' : 'opacity-70'}`}
                  style={{fontSize: '0.875rem', padding: '8px 16px'}}
                >
                  Month
                </button>
              </div>
              
              {/* Navigation */}
              <button
                onClick={() => navigateMonth(-1)}
                className="px-2 py-1 text-black hover:text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 bg-white"
                style={{minWidth: '28px', minHeight: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#000'}}>‹</span>
              </button>
              
              <button
                onClick={goToThisMonth}
                className="br-button"
                style={{fontSize: '0.875rem', padding: '8px 16px'}}
              >
                {view === 'week' ? getCurrentWeekRange() : currentMonthYear}
              </button>
              
              <button
                onClick={() => navigateMonth(1)}
                className="px-2 py-1 text-black hover:text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 bg-white"
                style={{minWidth: '28px', minHeight: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#000'}}>›</span>
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Month/Year positioned above Wednesday column */}
        <div className="relative">
          <div className="grid grid-cols-7 gap-0">
            <div></div>
            <div></div>
            <div></div>
            <div className="text-center py-2">
              <h3 className="nav-link" style={{color: '#374151', textShadow: 'none', padding: '0'}}>{currentMonthYear}</h3>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 border-r border-b border-gray-200">
          {/* Day headers */}
          {(view === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(day => (
            <div key={day} className="bg-gray-50 border-l border-t border-gray-200 text-center py-3 text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const isCurrentMonth = view === 'week' ? true : date.getMonth() === currentDate.getMonth();
            const sessions = getSessionsForDate(date);
            const dayOfMonth = date.getDate();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index}
                className={`min-h-[120px] border-l border-t border-gray-200 p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Day number */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth 
                    ? isToday 
                      ? 'text-green-600 font-bold' 
                      : 'text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {dayOfMonth}
                </div>
                
                {/* Sessions */}
                <div className="space-y-1">
                  {sessions.length > 0 ? (
                    sessions.slice(0, 3).map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
                        title={`${convertTo12HourFormat(session.time)} - ${session.title}`}
                      >
                        {convertTo12HourFormat(session.time)} {session.title}
                      </div>
                    ))
                  ) : isCurrentMonth ? (
                    <div className="text-xs text-gray-400 italic">No training sessions</div>
                  ) : null}
                  
                  {sessions.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{sessions.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem'}}>
        <h2 className="nav-link" style={{color: '#374151', textShadow: 'none', padding: '0', fontSize: '2rem', fontWeight: 'bold'}}>Upcoming Sessions</h2>
        
        <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
          <span className="nav-link" style={{color: '#374151', textShadow: 'none', padding: '0', fontSize: '2rem', fontWeight: 'bold'}}>Team:</span>
          <select 
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="br-button"
            style={{fontSize: '0.875rem', padding: '8px 16px', transform: 'translateY(-8px)'}}
          >
            <option value="all">All Teams</option>
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
            <option value="team3">Team 3</option>
            <option value="team4">Team 4</option>
          </select>
        </div>
      </div>
      
      {sortedDates.length > 0 ? (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', alignItems: 'start'}}>
          {sortedDates.map(date => (
            sessionsByDate[date].map(session => {
              const thisSessionExpanded = !!expandedSessions[session.id];
              return (
                <div key={`${date}-${session.id}`} style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #d1d5db',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(4px)',
                  minHeight: thisSessionExpanded ? '300px' : '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'min-height 0.3s ease'
                }}>
                    {/* Date Header within session box */}
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
                      <span style={{
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        fontStyle: 'italic', 
                        fontFamily: '"Arial Black", "Helvetica Neue", sans-serif', 
                        color: '#000000'
                      }}>
                        {date}
                      </span>
                    </div>

                    {/* Team Name - Between date and practice name */}
                    <div style={{
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginBottom: '12px',
                      border: '2px solid #16a34a',
                      borderRadius: '50px',
                      padding: '12px 20px',
                      backgroundColor: '#16a34a'
                    }}>
                      <h5 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                        color: '#ffffff',
                        margin: '0'
                      }}>
                        {session.team}
                      </h5>
                    </div>

                    {/* Session Header with collapse toggle */}
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: thisSessionExpanded ? '20px' : '0px',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSessionExpansion(session.id)}
                    >
                      <span style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        marginRight: '8px',
                        transform: thisSessionExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
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
                        {session.title}
                      </h4>
                    </div>

                    {/* Session Content - Only show when expanded */}
                    {thisSessionExpanded && (
                      <div style={{padding: '20px 0', color: '#000000', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div style={{marginBottom: '20px'}}>
                          <div style={{marginBottom: '12px', color: '#000000', fontSize: '18px'}}>
                            <strong style={{color: '#000000'}}>Time:</strong> {convertTo12HourFormat(session.time)} ({session.duration} min)
                          </div>
                          <div style={{marginBottom: '12px', color: '#000000', fontSize: '18px'}}>
                            <strong style={{color: '#000000'}}>Location:</strong> {session.location}
                          </div>
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto'}}>
                          <button className="br-button" style={{fontSize: '0.875rem', padding: '8px 16px'}}>View Plan</button>
                          <button className="br-button" style={{fontSize: '0.875rem', padding: '8px 16px'}}>Edit</button>
                          <button className="br-button" style={{fontSize: '0.875rem', padding: '8px 16px'}}>Cancel</button>
                        </div>
                      </div>
                    )}


                </div>
              );
            })
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
    </>
  );
};

export default SchedulePage;