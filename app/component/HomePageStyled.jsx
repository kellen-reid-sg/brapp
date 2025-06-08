"use client";

import Link from 'next/link';

const HomePageStyled = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="br-header-container" style={{marginBottom: '2rem'}}>
        <h1 className="br-main-heading" style={{fontSize: '3.5rem', marginBottom: '1rem'}}><span style={{color: 'white'}}>Take your coaching<br/>to the </span><span style={{color: '#16a34a', fontWeight: 'bold'}}>next level</span></h1>
        <p className="br-subheading" style={{fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', textAlign: 'center', margin: '1rem auto 0 auto', color: '#d1d5db'}}>Coach with confidence. Build better sessions, develop smarter players, and run practices that make an impact — from first whistle to final drill.</p>
        <div style={{marginTop: '1.5rem'}}>
          <Link href="/how-can-we-help" className="br-button" style={{fontSize: '1.1rem', padding: '12px 24px'}}>
            Start Your Free Trial
          </Link>
          <p style={{color: '#d1d5db', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center'}}>First week free. Cancel anytime.</p>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', maxWidth: '1200px', width: '100%'}}>
        <div className="br-card" style={{display: 'flex', flexDirection: 'column'}}>
          <h2 className="br-card-heading" style={{marginTop: '0', marginBottom: '12px', minHeight: '120px', display: 'flex', alignItems: 'flex-start'}}>Create Single Session</h2>
          <p style={{color: 'black', flexGrow: '1'}} className="br-card-text">Design individual training sessions with drills, exercises, and games tailored to your team's needs</p>
          <Link href="/sessions/create" className="br-button">Build Session</Link>
        </div>
        
        <div className="br-card" style={{display: 'flex', flexDirection: 'column'}}>
          <h2 className="br-card-heading" style={{marginTop: '0', marginBottom: '12px', minHeight: '120px', display: 'flex', alignItems: 'flex-start'}}>Create Training Block</h2>
          <p style={{color: 'black', flexGrow: '1'}} className="br-card-text">Build multi-session training blocks focused on specific skills development over multiple weeks</p>
          <Link href="/blocks/create" className="br-button">Create Block</Link>
        </div>
        
        <div className="br-card" style={{display: 'flex', flexDirection: 'column'}}>
          <h2 className="br-card-heading" style={{marginTop: '0', marginBottom: '12px', minHeight: '120px', display: 'flex', alignItems: 'flex-start'}}>Small Group Sessions</h2>
          <p style={{color: 'black', flexGrow: '1'}} className="br-card-text">Create specialized training for individual players or small groups focused on position-specific skills</p>
          <Link href="/individual/create" className="br-button">Group Session</Link>
        </div>
        
        <div className="br-card" style={{display: 'flex', flexDirection: 'column'}}>
          <h2 className="br-card-heading" style={{marginTop: '0', marginBottom: '12px', minHeight: '120px', display: 'flex', alignItems: 'flex-start'}}>Access Anywhere</h2>
          <p style={{color: 'black', flexGrow: '1'}} className="br-card-text">View your sessions on the field from any mobile device when training your team</p>
          <Link href="/sessions" className="br-button">My Sessions</Link>
        </div>
        
        <div className="br-card" style={{display: 'flex', flexDirection: 'column'}}>
          <h2 className="br-card-heading" style={{marginTop: '0', marginBottom: '12px', minHeight: '120px', display: 'flex', alignItems: 'flex-start'}}>Save & Organize</h2>
          <p style={{color: 'black', flexGrow: '1'}} className="br-card-text">Build a library of sessions categorized by skills, age groups, and training objectives</p>
          <Link href="/library" className="br-button">View Library</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePageStyled