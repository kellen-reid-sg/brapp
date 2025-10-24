'use client'

export default function SortTabs({ active, onChange }) {
  const tabs = [
    { 
      id: 'hot', 
      label: 'Hot',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    },
    { 
      id: 'new', 
      label: 'New',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      id: 'top', 
      label: 'Top',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ]
  
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            backgroundColor: active === tab.id ? '#16a34a' : 'rgba(255,255,255,0.08)',
            color: active === tab.id ? 'white' : 'rgba(255,255,255,0.7)',
            border: '1px solid ' + (active === tab.id ? '#16a34a' : 'rgba(255,255,255,0.20)'),
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="hover:bg-opacity-60"
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
