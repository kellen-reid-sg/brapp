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
              href="/profile" 
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

      {/* Hero Section - Full Bleed with Background Image */}
      <main 
        className="relative flex-1 flex items-center px-8 py-20 min-h-screen"
        style={{
          backgroundColor: '#0a0a0a'
        }}
      >
        {/* Blurred Background Layer - Anchored at Bottom */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/hero-training-session.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
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
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.60) 60%, rgba(10,10,10,0.50) 100%)',
            zIndex: 1
          }}
        />

        {/* Content Container - Split Layout */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center gap-12" style={{ minHeight: '70vh' }}>
          
          {/* Left Side: Hero Text */}
          <div style={{ flex: '0 0 50%', maxWidth: '50%', paddingLeft: '3rem' }}>
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              lineHeight: '0.9',
              textTransform: 'uppercase',
              marginBottom: '0',
              letterSpacing: '-0.02em'
            }}>
              CRAFT YOUR
            </h2>
            
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              lineHeight: '0.9',
              textTransform: 'uppercase',
              marginTop: '0',
              marginBottom: '2rem',
              letterSpacing: '-0.02em'
            }}>
              SESSION
            </h2>
            
            <p style={{
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: '1.125rem',
              fontStyle: 'italic',
              color: 'white',
              maxWidth: '520px',
              lineHeight: '1.6',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              Design training sessions, share drills, and connect with coaches worldwide through your unique coaching lens.
            </p>
          </div>

          {/* Right Side: Card Grid */}
          <div style={{ 
            flex: '0 0 45%', 
            maxWidth: '45%',
            paddingRight: '2rem'
          }}>
            <h3 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '1.25rem',
              fontWeight: '700',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em'
            }}>
              SELECT YOUR PATH
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
            {/* Card 1: Browse Drills */}
            <Link 
              href="/drills"
              style={{
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(22,163,74,0.5)',
                padding: '20px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-opacity-60 hover:border-green-500"
            >
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  BROWSE DRILLS
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>
                  Access 1,247+ drills
                </p>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </Link>

            {/* Card 2: Build Session */}
            <Link 
              href="/sessions/new"
              style={{
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(22,163,74,0.5)',
                padding: '20px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-opacity-60 hover:border-green-500"
            >
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  BUILD SESSION
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>
                  Design training plans
                </p>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </Link>

            {/* Card 3: Join Community */}
            <Link 
              href="/drills"
              style={{
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(22,163,74,0.5)',
                padding: '20px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-opacity-60 hover:border-green-500"
            >
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  JOIN COMMUNITY
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>
                  Connect with coaches
                </p>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </Link>

            {/* Card 4: My Library */}
            <Link 
              href="/profile"
              style={{
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(22,163,74,0.5)',
                padding: '20px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              className="hover:bg-opacity-60 hover:border-green-500"
            >
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  MY LIBRARY
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>
                  Your saved content
                </p>
              </div>
              <div style={{ fontSize: '20px', color: 'white' }}>→</div>
            </Link>
            </div>
          </div>
        </div>

      </main>

      {/* Section 3: Feature Highlights */}
      <section style={{ 
        backgroundColor: '#0a0a0a', 
        padding: '120px 24px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {/* Feature 1: Community-Driven Library */}
            <div style={{
              border: '2px solid #16a34a',
              borderRadius: '12px',
              padding: '40px 32px',
              backgroundColor: 'transparent',
              transition: 'transform 0.3s ease',
            }}
            className="hover:-translate-y-1"
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚽</div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>1,247</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>DRILLS</div>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                fontStyle: 'italic'
              }}>
                Community-Driven Library
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6'
              }}>
                Browse, upvote, and share training drills from coaches worldwide
              </p>
            </div>

            {/* Feature 2: Session Builder */}
            <div style={{
              border: '2px solid #16a34a',
              borderRadius: '12px',
              padding: '40px 32px',
              backgroundColor: 'transparent',
              transition: 'transform 0.3s ease',
            }}
            className="hover:-translate-y-1"
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>📋</div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>2,831</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>SESSIONS</div>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                fontStyle: 'italic'
              }}>
                Session Builder
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6'
              }}>
                Design complete training plans in minutes with drag-and-drop simplicity
              </p>
            </div>

            {/* Feature 3: Instant Sharing */}
            <div style={{
              border: '2px solid #16a34a',
              borderRadius: '12px',
              padding: '40px 32px',
              backgroundColor: 'transparent',
              transition: 'transform 0.3s ease',
            }}
            className="hover:-translate-y-1"
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔗</div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>523</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>COACHES</div>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                fontStyle: 'italic'
              }}>
                Instant Sharing
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6'
              }}>
                Generate shareable links and export to PDF for your team
              </p>
            </div>

            {/* Feature 4: Drill Builder */}
            <div style={{
              border: '2px solid #16a34a',
              borderRadius: '12px',
              padding: '40px 32px',
              backgroundColor: 'transparent',
              transition: 'transform 0.3s ease',
            }}
            className="hover:-translate-y-1"
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>🎨</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                fontStyle: 'italic'
              }}>
                Drill Builder
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6'
              }}>
                Coming Soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section style={{ 
        backgroundColor: '#0a0a0a',
        padding: '120px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Title */}
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '56px',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '80px',
            letterSpacing: '0.05em'
          }}>
            HOW IT WORKS
          </h2>

          {/* Timeline Steps */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {/* Step 1: Browse */}
            <div style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '12px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Colored accent bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: '#06b6d4'
              }} />
              
              {/* Numbered badge */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '20px',
                marginBottom: '24px'
              }}>
                1
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                textTransform: 'uppercase',
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                BROWSE
              </h3>

              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.6'
              }}>
                Search and filter 1,247 drills by category, age group, skill level, and duration
              </p>
            </div>

            {/* Step 2: Build */}
            <div style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '12px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Colored accent bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: '#3b82f6'
              }} />
              
              {/* Numbered badge */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '20px',
                marginBottom: '24px'
              }}>
                2
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                textTransform: 'uppercase',
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                BUILD
              </h3>

              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.6'
              }}>
                Drag drills into your session timeline and organize your perfect training plan
              </p>
            </div>

            {/* Step 3: Share */}
            <div style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '12px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Colored accent bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: '#16a34a'
              }} />
              
              {/* Numbered badge */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '20px',
                marginBottom: '24px'
              }}>
                3
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                textTransform: 'uppercase',
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                SHARE
              </h3>

              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.6'
              }}>
                Export to PDF or share a link with your team for instant access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Live Stats/Social Proof */}
      <section style={{ 
        backgroundColor: '#0a0a0a',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '64px',
            textAlign: 'center'
          }}>
            {/* Stat 1: Drills */}
            <div>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                1,247
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                DRILLS
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '16px'
              }}>
                Shared
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '75%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            {/* Stat 2: Coaches */}
            <div>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                523
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                COACHES
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '16px'
              }}>
                Active
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            {/* Stat 3: Sessions */}
            <div>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                2,831
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                SESSIONS
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '16px'
              }}>
                Created
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '85%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(10,10,10,1) 100%)',
        backgroundColor: '#0a0a0a',
        padding: '160px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '48px',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            textTransform: 'uppercase',
            marginBottom: '24px',
            letterSpacing: '0.02em',
            lineHeight: '1.2'
          }}>
            READY TO ELEVATE YOUR COACHING?
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '48px',
            lineHeight: '1.6'
          }}>
            Join 500+ coaches using The Boot Room to build better sessions
          </p>

          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/auth/signup"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block',
                fontStyle: 'italic'
              }}
              className="hover:bg-green-600"
            >
              Start Free Trial
            </Link>

            <Link
              href="/demo"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '8px',
                border: '2px solid white',
                fontWeight: '700',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block',
                fontStyle: 'italic'
              }}
              className="hover:bg-white hover:text-black"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © 2025 The Boot Room. Built for coaches, by coaches.
      </footer>
    </div>
  );
}
