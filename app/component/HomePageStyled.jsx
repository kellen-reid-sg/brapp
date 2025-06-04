"use client";

import Link from 'next/link';

const HomePageStyled = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="br-header-container" style={{marginBottom: '2rem'}}>
        <h1 className="br-main-heading" style={{marginBottom: '6px'}}>Boot Room</h1>
        <p className="br-subheading">Take your coaching and training sessions to the <span style={{color: '#16a34a', fontWeight: 'bold'}}>next level</span></p>
      </div>
      
      <div className="br-card-grid">
        <div className="br-card">
          <h2 className="br-card-heading">Create Single Session</h2>
          <p style={{color: 'black'}} className="br-card-text">Design individual training sessions with drills, exercises, and games tailored to your team's needs</p>
          <Link href="/sessions/create" className="br-button">Build Session</Link>
        </div>
        
        <div className="br-card">
          <h2 className="br-card-heading">Create Training Block</h2>
          <p style={{color: 'black'}} className="br-card-text">Build multi-session training blocks focused on specific skills development over multiple weeks</p>
          <Link href="/blocks/create" className="br-button">Create Block</Link>
        </div>
        
        <div className="br-card">
          <h2 className="br-card-heading">Small Group Sessions</h2>
          <p style={{color: 'black'}} className="br-card-text">Create specialized training for individual players or small groups focused on position-specific skills</p>
          <Link href="/individual/create" className="br-button">Create Individual Session</Link>
        </div>
        
        <div className="br-card">
          <h2 className="br-card-heading">Access Anywhere</h2>
          <p style={{color: 'black'}} className="br-card-text">View your sessions on the field from any mobile device when training your team</p>
          <Link href="/sessions" className="br-button">My Sessions</Link>
        </div>
      </div>
      
      {/* Fifth card - Save & Organize - Centered below */}
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '1.25rem', maxWidth: '64rem', width: '100%'}}>
        <div className="br-card" style={{maxWidth: '32rem'}}>
          <h2 className="br-card-heading">Save & Organize</h2>
          <p style={{color: 'black'}} className="br-card-text">Build a library of sessions categorized by skills, age groups, and training objectives</p>
          <Link href="/library" className="br-button">View Library</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePageStyled