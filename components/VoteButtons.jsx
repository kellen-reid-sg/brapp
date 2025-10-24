'use client'
import { useState } from 'react'

export default function VoteButtons({ score = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minWidth: '80px',
      alignSelf: 'center'
    }}>
      <button 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setHasVoted(!hasVoted)}
        style={{
          padding: '4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width="32" 
          height="32" 
          fill="none" 
          stroke="white" 
          viewBox="0 0 24 24" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span style={{
        fontSize: '20px',
        fontWeight: '700',
        color: hasVoted ? '#16a34a' : 'rgba(255,255,255,0.8)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: '1'
      }}>
        {score + (hasVoted ? 1 : 0)}
      </span>
    </div>
  )
}
