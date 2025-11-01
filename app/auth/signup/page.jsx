'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '../../lib/supabase'
import styles from './Signup.module.css'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      alert('Check your email for the confirmation link!')
      router.push('/auth/login')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

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

        {/* Signup Card */}
        <div className={styles.signupCard}>
          {/* Card Title */}
          <h2 className={styles.cardTitle}>
            JOIN THE BOOT ROOM
          </h2>
          <p className={styles.cardSubtitle}>
            Create your account and start building sessions
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

            <form onSubmit={handleSignup}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {/* Password Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {/* Confirm Password Input */}
              <div className={styles.confirmPasswordGroup}>
                <label htmlFor="confirm-password" className={styles.inputLabel}>
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim() || !confirmPassword.trim()}
                className={styles.submitButton}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className={styles.linksSection}>
              <p className={styles.linkText}>
                Already have an account?{' '}
                <Link href="/auth/login" className={styles.link}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
