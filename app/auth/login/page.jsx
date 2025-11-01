'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '../../lib/supabase';
import styles from './Login.module.css';

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
    <div className={styles.pageContainer}>
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
      <nav className={styles.navigation}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Link href="/" className={styles.logo}>
            THE BOOT ROOM
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Large Title */}
        <h1 className={styles.pageTitle}>
          THE BOOT ROOM
        </h1>

        {/* Login Card */}
        <div className={styles.loginCard}>
          {/* Card Title */}
          <h2 className={styles.cardTitle}>
            WELCOME BACK
          </h2>
          <p className={styles.cardSubtitle}>
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
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
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
                  className={styles.input}
                />
              </div>

              {/* Password Input */}
              <div className={styles.passwordGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
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
                  className={styles.input}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.email.trim() || !formData.password.trim()}
                className={styles.submitButton}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className={styles.linksSection}>
              <p className={styles.linkText}>
                Don't have an account?{' '}
                <Link href="/auth/signup" className={styles.link}>
                  Sign up
                </Link>
              </p>
              
              {/* Forgot Password Link */}
              <Link href="/auth/forgot-password" className={styles.forgotLink}>
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