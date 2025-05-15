"use client";

import { useState } from 'react';
import Link from 'next/link';

const MySessionsPage = () => {
  // Normally this would come from an API or localStorage
  const [sessions] = useState([
    {
      id: '1',
      name: 'U12 Passing Fundamentals',
      drillCount: 4,
      totalDuration: 60,
      createdAt: '2023-08-15'
    },
    {
      id: '2',
      name: 'Pre-Season Fitness Training',
      drillCount: 6,
      totalDuration: 90,
      createdAt: '2023-08-10'
    },
    {
      id: '3',
      name: 'Goal Scoring Drills',
      drillCount: 3,
      totalDuration: 45,
      createdAt: '2023-08-05'
    }
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-green-700">My Training Sessions</h1>
      
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">You haven't created any sessions yet</p>
          <Link href="/build" className="inline-block px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg text-green-700 mb-1">{session.name}</h3>
                <div className="flex text-sm text-gray-500">
                  <span>{session.drillCount} drills</span>
                  <span className="mx-2">•</span>
                  <span>{session.totalDuration} minutes</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-500">Created: {new Date(session.createdAt).toLocaleDateString()}</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    View
                  </button>
                  <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessionsPage;