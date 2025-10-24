"use client";

import React from 'react';

const DrillCardCompact = ({ drill, onRemove }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return { backgroundColor: '#10B981', color: '#FFFFFF' };
      case 'intermediate':
        return { backgroundColor: '#F59E0B', color: '#000000' };
      case 'advanced':
        return { backgroundColor: '#F97316', color: '#FFFFFF' };
      case 'elite':
        return { backgroundColor: '#EF4444', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#6B7280', color: '#FFFFFF' };
    }
  };

  return (
    <div 
      className="rounded-lg p-4 transition-shadow"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #000000',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', minHeight: '60px' }}>
        <div>
          <h4 
            className="font-semibold text-lg mb-2" 
            style={{ 
              color: '#000000',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '800',
              transform: 'skew(-5deg)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              lineHeight: '1.2',
              paddingRight: '40px'
            }}
          >
            {drill?.name || 'No drill name'}
          </h4>
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium" style={{ color: '#000000' }}>
              {drill?.duration || 'No duration'} min
            </span>
            <span 
              style={{ 
                display: 'inline-block',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '20px',
                ...getDifficultyColor(drill?.difficulty || 'beginner')
              }}
            >
              {drill?.difficulty || 'No difficulty'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={onRemove}
          style={{ 
            position: 'absolute',
            top: '12px',
            right: '8px',
            color: '#6B7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            zIndex: 10,
            transform: 'translateY(-50%)'
          }}
          aria-label="Remove drill"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DrillCardCompact;