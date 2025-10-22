import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '1.5px white',
            textStroke: '1.5px white',
            letterSpacing: '0.1em',
            transform: 'skew(-5deg)'
          }}>
            THE BOOT ROOM
          </h1>
          
          <nav style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
            <Link 
              href="/drills" 
              style={{ 
                color: 'white',
                fontStyle: 'italic',
                fontWeight: '500',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
              className="hover:text-green-500"
            >
              BROWSE DRILLS
            </Link>
            <Link 
              href="/sessions/new" 
              style={{ 
                color: 'white',
                fontStyle: 'italic',
                fontWeight: '500',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
              className="hover:text-green-500"
            >
              BUILD SESSION
            </Link>
            <Link 
              href="/profile" 
              style={{ 
                color: 'white',
                fontStyle: 'italic',
                fontWeight: '500',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
              className="hover:text-green-500"
            >
              MY SESSIONS
            </Link>
            <Link 
              href="/auth/login" 
              style={{ 
                color: 'white',
                fontStyle: 'italic',
                fontWeight: '500',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
              className="hover:text-green-500"
            >
              SIGN OUT
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Full Bleed with Background Image */}
      <main 
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-32 min-h-screen"
        style={{
          backgroundColor: '#0a0a0a'
        }}
      >
        {/* Blurred Background Layer */}
        <div 
          style={{
            position: 'absolute',
            inset: '-40px',
            backgroundImage: 'url(/images/hero-training-session.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(10px) grayscale(30%)',
            WebkitFilter: 'blur(10px) grayscale(30%)',
            opacity: 0.6,
            zIndex: 0,
            transform: 'scale(1.15)'
          }}
        />
        
        {/* Dark Overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,0.60) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.65) 100%)',
            zIndex: 1
          }}
        />

        {/* Content */}
        <div className="relative z-20 text-center max-w-5xl mx-auto">
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '2px white',
            textStroke: '2px white',
            lineHeight: '1',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            DEFINE YOUR
          </h2>
          
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            lineHeight: '1',
            textTransform: 'uppercase',
            marginBottom: '3rem',
            letterSpacing: '-0.02em'
          }}>
            <span style={{ color: '#16a34a' }}>SESSION</span>
          </h2>
          
          <p style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: '1.375rem',
            fontStyle: 'italic',
            color: 'white',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            Design training sessions, share drills, and connect with coaches worldwide through your unique coaching lens.
          </p>

          <div className="mb-6">
            <Link 
              href="/drills"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '18px 56px',
                borderRadius: '8px',
                display: 'inline-block',
                fontWeight: '700',
                fontSize: '1.25rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}
              className="hover:bg-green-700"
            >
              Start Building
            </Link>
          </div>

          {/* Stats Ticker */}
          <div 
            style={{
              marginTop: '4rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '500'
            }}
          >
            <span>1,247 Drills</span>
            <span>•</span>
            <span>523 Coaches</span>
            <span>•</span>
            <span>2,831 Sessions Created</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col gap-6 max-w-7xl w-full px-4">
          {/* Browse Drills Card */}
          <div style={{
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '1.75rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '16px',
              transform: 'skew(-5deg)',
              letterSpacing: '-0.02em'
            }}>
              BROWSE DRILLS
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '24px', lineHeight: '1.6' }}>
              Access a growing library of community-shared training drills. 
              Upvote favorites and discover new ideas from coaches worldwide.
            </p>
            <Link 
              href="/drills"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                display: 'inline-block',
                fontStyle: 'italic',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              className="hover:bg-green-700"
            >
              Explore Library
            </Link>
          </div>

          {/* Build Sessions Card */}
          <div style={{
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '1.75rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '16px',
              transform: 'skew(-5deg)',
              letterSpacing: '-0.02em'
            }}>
              BUILD SESSIONS
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '24px', lineHeight: '1.6' }}>
              Design complete training sessions in minutes by selecting drills 
              from the library. Save and share with your team.
            </p>
            <Link 
              href="/sessions/new"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                display: 'inline-block',
                fontStyle: 'italic',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              className="hover:bg-green-700"
            >
              Create Session
            </Link>
          </div>

          {/* Community Card */}
          <div style={{
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '1.75rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '16px',
              transform: 'skew(-5deg)',
              letterSpacing: '-0.02em'
            }}>
              JOIN COMMUNITY
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '24px', lineHeight: '1.6' }}>
              Connect with coaches worldwide. Share your own drills, 
              comment on sessions, and learn from the best.
            </p>
            <Link 
              href="/auth/signup"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                display: 'inline-block',
                fontStyle: 'italic',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              className="hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © 2025 The Boot Room. Built for coaches, by coaches.
      </footer>
    </div>
  );
}
