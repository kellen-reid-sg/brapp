'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '../../lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const supabase = createClientComponentClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setMessage('Check your email for the password reset link');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

        {/* Forgot Password Form Container */}
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
          }}>Reset Password</h2>
          
          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <p style={{ margin: 0 }}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{marginBottom: '2rem'}}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#6aa18c' : '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontStyle: 'italic',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
        
        {/* Back to Login */}
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'white' }}>
          <p>
            <Link href="/auth/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 'bold' }}>
              Back to Login
            </Link>
          </p>
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;