'use client';

import { useState } from 'react';
import Link from 'next/link';

// Temporary mock data - will connect to Supabase later
const MOCK_DRILLS = [
  {
    id: '1',
    name: '4v4 Possession',
    component: 'Possession',
    difficulty: 'Intermediate',
    duration: 20,
    description: 'Small-sided game focused on keeping possession under pressure',
    votes: 24,
    comments: 8,
    author: 'Coach Mike',
  },
  {
    id: '2',
    name: 'Dynamic Warm-up',
    component: 'Warm-up',
    difficulty: 'Beginner',
    duration: 10,
    description: 'Active stretching and movement preparation',
    votes: 42,
    comments: 12,
    author: 'Sarah P',
  },
  {
    id: '3',
    name: 'Finishing Circuit',
    component: 'Finishing',
    difficulty: 'Advanced',
    duration: 25,
    description: 'Station-based shooting and finishing practice',
    votes: 67,
    comments: 23,
    author: 'Coach Alex',
  },
];

export default function DrillsPage() {
  const [sortBy, setSortBy] = useState('hot');
  const [filterComponent, setFilterComponent] = useState('all');

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <header className="px-8 py-6 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '1.5rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: '1.5px white',
              textStroke: '1.5px white',
              letterSpacing: '0.1em',
              transform: 'skew(-5deg)',
              cursor: 'pointer'
            }}
            className="hover:opacity-80 transition">
              THE BOOT ROOM
            </h1>
          </Link>
          
          <nav className="flex gap-8 items-center">
            <Link 
              href="/drills" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              BROWSE DRILLS
            </Link>
            <Link 
              href="/sessions/new" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              BUILD SESSION
            </Link>
            <Link 
              href="/profile" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              MY SESSIONS
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '3.5rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            textTransform: 'uppercase',
            transform: 'skew(-5deg)',
            marginBottom: '0.5rem'
          }}>
            DRILL LIBRARY
          </h2>
          <p className="text-gray-400 italic text-lg">Browse community-shared training drills</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sort */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('hot')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'hot'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🔥 Hot
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'new'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🆕 New
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortBy === 'top'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              ⭐ Top
            </button>
          </div>

          {/* Component Filter */}
          <select
            value={filterComponent}
            onChange={(e) => setFilterComponent(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
          >
            <option value="all">All Components</option>
            <option value="Warm-up">Warm-up</option>
            <option value="Possession">Possession</option>
            <option value="Finishing">Finishing</option>
            <option value="Defending">Defending</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        {/* Drill Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_DRILLS.map((drill) => (
            <div
              key={drill.id}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition cursor-pointer"
            >
              {/* Drill Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-800 text-gray-300 mb-2">
                    {drill.component}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {drill.name}
                  </h3>
                  <p className="text-sm text-gray-500">by {drill.author}</p>
                </div>
                {/* Upvote */}
                <button className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                  <span className="text-green-500">▲</span>
                  <span className="text-white font-semibold text-sm">
                    {drill.votes}
                  </span>
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{drill.description}</p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>⏱️ {drill.duration} min</span>
                  <span className="px-2 py-1 bg-gray-800 rounded">
                    {drill.difficulty}
                  </span>
                </div>
                <span>💬 {drill.comments}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Drill Button (Fixed Bottom Right) */}
        <button className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </button>
      </main>
    </div>
  );
}
