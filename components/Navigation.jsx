import Link from 'next/link'

export default function Navigation() {
  return (
    <header className="px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
        
        <nav style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          <Link 
            href="/about" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap'
            }}
            className="hover:text-green-500"
          >
            ABOUT
          </Link>
          <Link 
            href="/drills" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.1em',
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
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap'
            }}
            className="hover:text-green-500"
          >
            BUILD SESSION
          </Link>
          <Link 
            href="/sessions" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.1em',
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
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap'
            }}
            className="hover:text-green-500"
          >
            SIGN OUT
          </Link>
        </nav>
      </div>
    </header>
  )
}
