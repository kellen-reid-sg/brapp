"use client";

import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div style={{marginBottom: '2.5rem', textAlign: 'center'}}>
        <h1 style={{position: 'relative', marginBottom: '0.5rem'}}>        
          <span style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '5rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '2px white',
            textStroke: '2px white',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            display: 'inline-block',
            textTransform: 'uppercase'
          }}>Boot Room</span>
        </h1>
        <p style={{
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: '1.5rem',
          fontWeight: '500',
          fontStyle: 'italic',
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          transform: 'skew(-5deg)',
          letterSpacing: '0.05em',
          marginTop: '0'
        }}>Take your coaching and training sessions to the <span style={{color: '#16a34a', fontWeight: 'bold'}}>next level</span></p>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '1000px'}}>
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'}}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '800',
            fontStyle: 'italic',
            color: 'black',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>Create Single Session</h2>
          <p style={{color: '#4b5563', marginBottom: '20px'}}>Design individual training sessions with drills, exercises, and games tailored to your team's needs</p>
          <a href="/sessions/create" style={{backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', textDecoration: 'none', fontStyle: 'italic'}}>
            Build Session
          </a>
        </div>
        
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'}}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '800',
            fontStyle: 'italic',
            color: 'black',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>Create Training Block</h2>
          <p style={{color: '#4b5563', marginBottom: '20px'}}>Build multi-session training blocks focused on specific skills development over multiple weeks</p>
          <a href="/blocks/create" style={{backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', textDecoration: 'none', fontStyle: 'italic'}}>
            Create Block
          </a>
        </div>
        
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'}}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '800',
            fontStyle: 'italic',
            color: 'black',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>Save & Organize</h2>
          <p style={{color: '#4b5563', marginBottom: '20px'}}>Build a library of sessions categorized by skills, age groups, and training objectives</p>
          <a href="/library" style={{backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', textDecoration: 'none', fontStyle: 'italic'}}>
            View Library
          </a>
        </div>
        
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'}}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '800',
            fontStyle: 'italic',
            color: 'black',
            letterSpacing: '-0.01em',
            transform: 'skew(-5deg)',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>Access Anywhere</h2>
          <p style={{color: '#4b5563', marginBottom: '20px'}}>View your sessions on the field from any mobile device when training your team</p>
          <a href="/sessions" style={{backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', textDecoration: 'none', fontStyle: 'italic'}}>
            My Sessions
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage