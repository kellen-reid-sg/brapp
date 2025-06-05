"use client";

import { useState } from 'react';
import Link from 'next/link';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-green-800 text-white shadow-md border-b-2 border-green-600">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center border-0 outline-none no-underline">
              <span className="br-main-heading text-2xl br-logo">The Boot Room</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-10 px-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Boot Room Title */}
        <div style={{marginBottom: '3rem', textAlign: 'center'}}>
          <h1 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '3rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '2px white',
            textStroke: '2px white',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            display: 'inline-block',
            textTransform: 'uppercase',
            marginBottom: '0'
          }}>The Boot Room</h1>
        </div>

        {/* Sign Up Form Container */}
        <div style={{
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: '2rem',
            marginTop: '0'
          }}>Join The Boot Room</h2>

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div style={{marginBottom: '1rem'}}>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'rgba(60, 60, 60, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Email Input */}
            <div style={{marginBottom: '1rem'}}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'rgba(60, 60, 60, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{marginBottom: '2rem'}}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'rgba(60, 60, 60, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontStyle: 'italic'
              }}
            >
              Create Account
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
