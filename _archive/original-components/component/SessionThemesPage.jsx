"use client";

import { useState } from 'react';
import Link from 'next/link';

// Session themes categories
const sessionThemes = [
  { id: 'attacking', name: 'Attacking', color: 'from-red-500 to-red-600' },
  { id: 'defending', name: 'Defending', color: 'from-blue-500 to-blue-600' },
  { id: 'possession', name: 'Possession', color: 'from-yellow-500 to-yellow-600' },
  { id: 'finishing', name: 'Finishing', color: 'from-purple-500 to-purple-600' },
  { id: 'pattern-play', name: 'Pattern Play', color: 'from-green-500 to-green-600' },
  { id: 'pressing', name: 'Pressing', color: 'from-orange-500 to-orange-600' },
];

// Position-specific categories
const positionThemes = [
  { id: 'goalkeeper', name: 'Goalkeeper', color: 'from-emerald-500 to-emerald-600' },
  { id: 'center-backs', name: 'Center Backs', color: 'from-indigo-500 to-indigo-600' },
  { id: 'fullbacks', name: 'Fullbacks', color: 'from-cyan-500 to-cyan-600' },
  { id: 'midfielders', name: 'Midfielders', color: 'from-amber-500 to-amber-600' },
  { id: 'wingers', name: 'Wingers', color: 'from-rose-500 to-rose-600' },
  { id: 'strikers', name: 'Strikers', color: 'from-pink-500 to-pink-600' },
];

// Sample drills for each theme
const themeDrills = {
  'attacking': [
    {
      id: 'a1',
      title: '3v2 to Goal',
      description: 'Practice attacking overloads with quick decision making',
      difficulty: 'intermediate',
      tags: ['overload', 'finishing', 'decision-making']
    },
    {
      id: 'a2',
      title: 'Wing Play & Crossing',
      description: 'Develop wide attacking and quality crossing into the box',
      difficulty: 'intermediate',
      tags: ['crossing', 'wing-play', 'movement']
    },
    {
      id: 'a3',
      title: 'Counter-Attack Transition',
      description: 'Quick transitions from defense to attack with numerical advantage',
      difficulty: 'advanced',
      tags: ['counter', 'transition', 'speed']
    }
  ],
  'defending': [
    {
      id: 'd1',
      title: 'Defensive Shape',
      description: 'Maintain defensive organization against different formations',
      difficulty: 'intermediate',
      tags: ['shape', 'organization', 'communication']
    },
    {
      id: 'd2',
      title: '1v1 Defending',
      description: 'Individual defending techniques and body positioning',
      difficulty: 'beginner',
      tags: ['1v1', 'technique', 'positioning']
    }
  ],
  'possession': [
    {
      id: 'p1',
      title: 'Rondo Variations',
      description: 'Various possession games focusing on ball retention under pressure',
      difficulty: 'beginner',
      tags: ['rondo', 'short-passing', 'movement']
    },
    {
      id: 'p2',
      title: 'Possession with Purpose',
      description: 'Maintaining possession while progressing up the field',
      difficulty: 'advanced',
      tags: ['progression', 'build-up', 'game-situation']
    }
  ],
  'finishing': [
    {
      id: 'f1',
      title: 'Shooting Circuit',
      description: 'Various shooting scenarios with realistic game situations',
      difficulty: 'intermediate',
      tags: ['shooting', 'technique', 'accuracy']
    },
    {
      id: 'f2',
      title: 'Striker Movement',
      description: 'Creating space and timing runs in the final third',
      difficulty: 'advanced',
      tags: ['movement', 'timing', 'awareness']
    }
  ],
  'pattern-play': [
    {
      id: 'pp1',
      title: 'Third-Man Running',
      description: 'Coordinated movements to break defensive lines',
      difficulty: 'advanced',
      tags: ['movement', 'timing', 'combination-play']
    },
    {
      id: 'pp2',
      title: 'Build Out Patterns',
      description: 'Structured patterns for building out from the back',
      difficulty: 'intermediate',
      tags: ['build-up', 'structure', 'positioning']
    }
  ],
  'pressing': [
    {
      id: 'pr1',
      title: 'Press Triggers',
      description: 'Recognizing and executing pressing moments as a team',
      difficulty: 'advanced',
      tags: ['high-press', 'triggers', 'coordination']
    },
    {
      id: 'pr2',
      title: 'Recovery Press',
      description: 'Immediate reaction to loss of possession to win the ball back',
      difficulty: 'intermediate',
      tags: ['counter-press', 'reaction', 'intensity']
    }
  ]
};

const SessionThemesPage = () => {
  const [activeTheme, setActiveTheme] = useState('attacking');
  const [activeCategory, setActiveCategory] = useState('themes');

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar Navigation */}
      <div className="md:w-64 bg-gray-50 border-r border-gray-200 md:min-h-[calc(100vh-64px)]">
        <nav className="sticky top-0 p-4 space-y-6">
          {/* Session Themes Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 px-3">Session Themes</h2>
            
            <div className="space-y-1">
              {sessionThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme.id)
                    setActiveCategory('themes')
                  }}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeTheme === theme.id && activeCategory === 'themes' 
                      ? `bg-gradient-to-r ${theme.color} text-white` 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className={`flex-grow ${activeTheme !== theme.id || activeCategory !== 'themes' ? 'text-gray-700' : ''}`}>
                    {theme.name}
                  </span>
                  {activeTheme === theme.id && activeCategory === 'themes' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Positions Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 px-3">By Position</h2>
            
            <div className="space-y-1">
              {positionThemes.map((position) => (
                <button
                  key={position.id}
                  onClick={() => {
                    setActiveTheme(position.id)
                    setActiveCategory('positions')
                  }}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeTheme === position.id && activeCategory === 'positions' 
                      ? `bg-gradient-to-r ${position.color} text-white` 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className={`flex-grow ${activeTheme !== position.id || activeCategory !== 'positions' ? 'text-gray-700' : ''}`}>
                    {position.name}
                  </span>
                  {activeTheme === position.id && activeCategory === 'positions' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Theme Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {activeCategory === 'themes' 
                ? sessionThemes.find(t => t.id === activeTheme)?.name 
                : positionThemes.find(p => p.id === activeTheme)?.name}
            </h1>
            <p className="text-gray-600">
              {/* Theme descriptions */}
              {activeTheme === 'attacking' && 'Develop effective attacking strategies to break down defenses and create scoring opportunities.'}
              {activeTheme === 'defending' && 'Build solid defensive principles and organization to prevent goals and win back possession.'}
              {activeTheme === 'possession' && 'Master ball retention techniques and create meaningful possession to control the game.'}
              {activeTheme === 'finishing' && 'Improve goal scoring ability through various finishing techniques and scenarios.'}
              {activeTheme === 'pattern-play' && 'Establish coordinated movement patterns to break down organized defenses.'}
              {activeTheme === 'pressing' && 'Develop team pressing strategies to win the ball back quickly and in advantageous positions.'}
              
              {/* Position descriptions */}
              {activeTheme === 'goalkeeper' && 'Specialized training for goalkeepers including handling, positioning, distribution, and shot-stopping techniques.'}
              {activeTheme === 'center-backs' && 'Focus on defensive positioning, heading, tackling, and building from the back for central defenders.'}
              {activeTheme === 'fullbacks' && 'Develop both defensive skills and attacking overlaps for modern fullbacks and wingbacks.'}
              {activeTheme === 'midfielders' && 'Training for the engine of the team - passing, receiving, vision, and transitions in midfield play.'}
              {activeTheme === 'wingers' && 'Improve 1v1 skills, crossing, cutting inside, and explosive movements for wide attacking players.'}
              {activeTheme === 'strikers' && 'Sharpen finishing abilities, movement in the box, hold-up play and creating scoring opportunities.'}
            </p>
          </div>

          {/* Drills Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Training Drills</h2>
              <Link 
                href="/build"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Custom Drill
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {themeDrills[activeTheme] ? themeDrills[activeTheme]?.map((drill) => (
                <div key={drill.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">{drill.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${drill.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : drill.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {drill.difficulty.charAt(0).toUpperCase() + drill.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-3">{drill.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {drill.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-8 text-center">
                  <p className="text-gray-500">No drills available for this category yet.</p>
                  <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create First Drill
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button className="text-green-600 hover:text-green-800 font-medium flex items-center mx-auto">
                Show More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </section>

          {/* Sample Completed Sessions */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Sample Training Sessions</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1).replace('-', ' ')} {activeCategory === 'positions' ? 'Training' : 'Development'} (U14+)
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Complete 90-minute session focusing on {activeTheme.replace('-', ' ')} {activeCategory === 'positions' ? 'players' : 'skills'} for teenage players
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">6 drills • 90 minutes</span>
                    <button className="px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-50 text-sm">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Intro to {activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1).replace('-', ' ')} {activeCategory === 'positions' ? 'Roles' : ''} (U10-U12)
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Age-appropriate {activeTheme.replace('-', ' ')} {activeCategory === 'positions' ? 'position-specific' : ''} session for younger players with fun activities
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">5 drills • 60 minutes</span>
                    <button className="px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-50 text-sm">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SessionThemesPage;