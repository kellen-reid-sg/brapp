'use client'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      position: 'relative'
    }}>
      {/* Background Image */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url("/images/anfield-background-image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          zIndex: 0
        }}
      />
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.70)',
        zIndex: 0
      }} />

      {/* Navigation */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navigation />
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Page Title */}
        <h1 style={{
          fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          color: 'white',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '64px',
          lineHeight: 1.1,
          transform: 'skew(-2deg)'
        }}>
          ABOUT THE BOOT ROOM
        </h1>

        {/* 3-Column Panel Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Panel 1: Mission */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(22,163,74,0.5)',
            borderRadius: '8px',
            padding: '32px 24px',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          className="about-panel">
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '20px',
              letterSpacing: '0.02em'
            }}>
              Our Mission
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: '1.7',
              marginBottom: '16px'
            }}>
              The Boot Room takes its name from Liverpool FC's small storage room at Anfield where coaches like Bill Shankly and Bob Paisley met after matches to share ideas and pass down knowledge—the quiet space behind one of football's greatest dynasties.
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: '1.7'
            }}>
              We're building the digital version of that room. A place where coaches at every level can share what works, learn from each other, and get better together. No gatekeeping. No ego. Just coaches helping coaches.
            </p>
          </div>

          {/* Panel 2: Ambition */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(22,163,74,0.5)',
            borderRadius: '8px',
            padding: '32px 24px',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          className="about-panel">
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '20px',
              letterSpacing: '0.02em'
            }}>
              Our Ambition
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: '1.7',
              marginBottom: '16px'
            }}>
              We're building a global community where coaches at every level—grassroots volunteers to academy professionals—share knowledge that elevates the game.
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: '1.7',
              marginBottom: '16px'
            }}>
              Better player development. Sharper game instincts. Deeper tactical understanding. These outcomes emerge when coaches collaborate openly.
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: '1.7'
            }}>
              For too long, great coaching went unrecognized. Now, your unique methods and insights can reach coaches worldwide, rewarded through community recognition and shared impact.
            </p>
          </div>

          {/* Panel 3: What We Offer */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(22,163,74,0.5)',
            borderRadius: '8px',
            padding: '32px 24px',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          className="about-panel">
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '20px',
              letterSpacing: '0.02em'
            }}>
              What We Offer
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'white',
                  marginBottom: '6px'
                }}>
                  Drill Library
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Browse an ever-expanding collection of drills and sessions. Filter by age group, category, and skill level.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'white',
                  marginBottom: '6px'
                }}>
                  Session Builder
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Build complete training sessions in minutes. Add drills, set durations, and share.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'white',
                  marginBottom: '6px'
                }}>
                  Community
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Vote, comment, and learn from coaches around the world. The best content rises to the top.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(21, 128, 61, 0.15) 100%)',
          border: '1px solid rgba(22, 163, 74, 0.30)',
          borderRadius: '12px',
          padding: '48px 32px',
          textAlign: 'center',
          marginTop: '48px'
        }}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            fontStyle: 'italic',
            color: 'white',
            textTransform: 'uppercase',
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Join the Community
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '32px',
            maxWidth: '700px',
            margin: '0 auto 32px'
          }}>
            Whether you're coaching U8s or professionals, there's a place for you in Boot Room. 
            Share your knowledge, discover new drills, and connect with coaches worldwide.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/drills" 
              style={{
                padding: '12px 24px',
                background: '#16a34a',
                color: 'white',
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.20)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#15803D'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#16a34a'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Browse Drills
            </a>
            <a 
              href="/sessions/new" 
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.10)',
                color: 'white',
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.20)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.borderColor = '#4ADE80'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Build a Session
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '64px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.50)',
          fontSize: '13px'
        }}>
          <p style={{ marginBottom: '8px' }}>Built by coaches who understand the grind.</p>
          <p>
            Questions? Reach out at{' '}
            <a 
              href="mailto:thebootroomapp@gmail.com" 
              style={{ 
                color: '#16a34a',
                textDecoration: 'underline',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4ADE80'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#16a34a'}
            >
              thebootroomapp@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Panel Hover Styles */}
      <style jsx>{`
        .about-panel:hover {
          background-color: rgba(0,0,0,0.6) !important;
          border-color: #22c55e !important;
          transform: scale(1.02) !important;
        }

        @media (max-width: 768px) {
          .about-panel {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
