"use client";

import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Soccer Coach App</p>
      </footer>
    </div>
  )
}

export default Layout