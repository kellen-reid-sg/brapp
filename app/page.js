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
          
          <nav className="flex gap-8 items-center">
            <Link 
              href="/drills" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              BROWSE DRILLS
            </Link>
            <Link 
              href="/sessions/new" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              BUILD SESSION
            </Link>
            <Link 
              href="/profile" 
              className="text-white hover:text-green-500 transition font-medium italic"
              style={{ textDecoration: 'underline' }}
            >
              MY SESSIONS
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition font-medium"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            lineHeight: '1.1',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}>
            TAKE YOUR COACHING<br />
            TO THE <span style={{ 
              color: '#16a34a',
              WebkitTextStroke: '1px #16a34a',
              textStroke: '1px #16a34a'
            }}>NEXT LEVEL</span>
          </h2>
          
          <p style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'white',
            maxWidth: '800px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6'
          }}>
            Coach with confidence. Build better sessions, develop smarter players, 
            and run practices that make an impact — from first whistle to final drill.
          </p>

          <div className="mb-4">
            <Link 
              href="/auth/signup"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '16px 48px',
                borderRadius: '8px',
                display: 'inline-block',
                fontWeight: '600',
                fontSize: '1.125rem',
                transition: 'all 0.2s'
              }}
              className="hover:bg-green-700"
            >
              Start Your Free Trial
            </Link>
          </div>
          <p className="text-gray-400 text-sm italic">First week free. Cancel anytime.</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full px-4">
          {/* Browse Drills Card */}
          <div style={{
            backgroundColor: 'transparent',
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(8px)'
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
            backgroundColor: 'transparent',
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(8px)'
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
            backgroundColor: 'transparent',
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(8px)'
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
