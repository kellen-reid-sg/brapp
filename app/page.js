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

      </main>

      {/* Section 2: Expanding Card Selection */}
      <section style={{ padding: '80px 0', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {/* Section Header */}
          <h2 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '40px',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'white',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '64px',
            letterSpacing: '0.05em'
          }}>
            SELECT YOUR PATH
          </h2>

          {/* Expanding Cards Container */}
          <div className="expanding-cards-container" style={{ 
            display: 'flex', 
            gap: '16px', 
            height: '440px',
            overflow: 'hidden'
          }}>
            {/* Card 1: Browse Drills */}
            <Link 
              href="/drills"
              className="expanding-card"
              style={{
                flex: '1 1 0',
                minWidth: '180px',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(0,217,255,0.3)'
              }}
            >
              {/* Background Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.60)',
                zIndex: 1,
                transition: 'background 0.3s ease'
              }} className="card-overlay" />
              
              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 className="card-title" style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}>
                  BROWSE DRILLS
                </h3>
                
                <div className="card-content" style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    THE DRILL LIBRARY
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    marginBottom: '32px'
                  }}>
                    Access 1,247+ community-shared drills. Filter by age, skill, duration.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                      }}>1247</div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.72)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>DRILLS</div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                      }}>12</div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.72)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>CATEGORIES</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: 'white'
                  }}>→</div>
                </div>
              </div>
            </Link>

            {/* Card 2: Build Session */}
            <Link 
              href="/sessions/new"
              className="expanding-card"
              style={{
                flex: '1 1 0',
                minWidth: '180px',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(22,163,74,0.3)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.60)',
                zIndex: 1,
                transition: 'background 0.3s ease'
              }} className="card-overlay" />
              
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 className="card-title" style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}>
                  BUILD SESSION
                </h3>
                
                <div className="card-content" style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    SESSION BUILDER
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    marginBottom: '32px'
                  }}>
                    Design complete training plans in minutes with drag-and-drop simplicity.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                      }}>2831</div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.72)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>SESSIONS</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: 'white'
                  }}>→</div>
                </div>
              </div>
            </Link>

            {/* Card 3: Join Community */}
            <Link 
              href="/drills"
              className="expanding-card"
              style={{
                flex: '1 1 0',
                minWidth: '180px',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(16,185,129,0.3)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.60)',
                zIndex: 1,
                transition: 'background 0.3s ease'
              }} className="card-overlay" />
              
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 className="card-title" style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}>
                  JOIN COMMUNITY
                </h3>
                
                <div className="card-content" style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    THE COMMUNITY
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    marginBottom: '32px'
                  }}>
                    Share drills, comment on sessions, upvote favorites from coaches worldwide.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                      }}>523</div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.72)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>COACHES</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: 'white'
                  }}>→</div>
                </div>
              </div>
            </Link>

            {/* Card 4: My Library */}
            <Link 
              href="/profile"
              className="expanding-card"
              style={{
                flex: '1 1 0',
                minWidth: '180px',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer',
                textDecoration: 'none',
                border: '1px solid rgba(245,158,11,0.3)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.60)',
                zIndex: 1,
                transition: 'background 0.3s ease'
              }} className="card-overlay" />
              
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 className="card-title" style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}>
                  MY LIBRARY
                </h3>
                
                <div className="card-content" style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    YOUR SAVED CONTENT
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    marginBottom: '32px'
                  }}>
                    Access your saved sessions, favorite drills, and personal library.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                      }}>∞</div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.72)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>UNLIMITED</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: 'white'
                  }}>→</div>
                </div>
              </div>
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
