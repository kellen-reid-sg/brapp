'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '../../lib/supabase';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClientComponentClient();
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (signInError) throw signInError;
      
      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/images/gemini-soccer-stadium-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px) grayscale(30%)',
          WebkitFilter: 'blur(10px) grayscale(30%)',
          opacity: 0.6,
          zIndex: 0
        }}
      />
      
      {/* Fade to Black Gradient Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.60) 60%, rgba(10,10,10,0.50) 100%)',
          zIndex: 1
        }}
      />

      {/* Navigation */}
      <nav className="px-8 py-6 relative z-30">
        <div className="max-w-7xl mx-auto">
          <Link href="/" style={{ textDecoration: 'none' }}>
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
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className="flex-1 flex flex-col items-center justify-center px-4 relative z-20"
        style={{
          paddingTop: '60px',
          paddingBottom: '60px'
        }}
      >
        {/* Large Title */}
        <h1 
          style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '2px white',
            textStroke: '2px white',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          THE BOOT ROOM
        </h1>

        {/* Login Card */}
        <div 
        style={{
        width: '100%',
        maxWidth: '600px',
        borderRadius: '24px',
        backgroundColor: 'rgba(26,26,26,0.8)',
        border: '1px solid white',
        padding: '48px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
        >
          {/* Card Title */}
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.75rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            textAlign: 'center',
            marginBottom: '12px',
            letterSpacing: '0.05em'
          }}>
            WELCOME BACK
          </h2>
          <p style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Sign in to continue your coaching journey
          </p>

          <div>
            {error && (
              <div 
                className="rounded-lg p-3 mb-5 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  color: '#FCA5A5'
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="email" style={{ 
                  display: 'block',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="coach@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    color: 'white',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(22,163,74,0.5)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }}
                />
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '32px' }}>
                <label htmlFor="password" style={{ 
                  display: 'block',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    color: 'white',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(22,163,74,0.5)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.email.trim() || !formData.password.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: (loading || !formData.email.trim() || !formData.password.trim())
                    ? 'rgba(255,255,255,0.10)' 
                    : 'rgba(34,197,94,0.20)',
                  border: (loading || !formData.email.trim() || !formData.password.trim())
                    ? '1px solid rgba(255,255,255,0.10)'
                    : '2px solid #4ADE80',
                  color: (loading || !formData.email.trim() || !formData.password.trim())
                    ? 'rgba(255,255,255,0.4)'
                    : '#4ADE80',
                  fontSize: '16px',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  cursor: (loading || !formData.email.trim() || !formData.password.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px' }}>
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  style={{
                    color: '#16a34a',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22C55E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#16a34a'}
                >
                  Sign up
                </Link>
              </p>
              
              {/* Forgot Password Link */}
              <Link 
                href="/auth/forgot-password" 
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;