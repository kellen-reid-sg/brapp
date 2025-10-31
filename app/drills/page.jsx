'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'
import DrillCard from '@/components/DrillCard'
import SortTabs from '@/components/SortTabs'
import Navigation from '@/components/Navigation'

export default function DrillsPage() {
  const supabase = createClientComponentClient()
  const [drills, setDrills] = useState([])
  const [sort, setSort] = useState('new')
  const [loading, setLoading] = useState(true)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAgeDropdown, setShowAgeDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  useEffect(() => {
    fetchDrills()
  }, [sort, selectedAgeGroups, selectedCategories])

  async function fetchDrills() {
    setLoading(true)
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: drillsData, error } = await supabase
        .from('drills')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25)
      
      if (error) {
        console.error('Error fetching drills:', error)
        setLoading(false)
        return
      }

    // Get stats for each drill
    const drillsWithStats = await Promise.all(
      drillsData.map(async (drill) => {
        const { data: statsData } = await supabase
          .from('drill_stats')
          .select('*')
          .eq('id', drill.id)
          .single()
        
        // Get user's vote if logged in
        let userVote = null
        if (user) {
          const { data: voteData, error: voteError } = await supabase
            .from('votes')
            .select('value')
            .eq('user_id', user.id)
            .eq('content_kind', 'drill')
            .eq('content_id', drill.id)
            .maybeSingle()
          
          if (!voteError && voteData) {
            userVote = voteData.value
          }
        }
        
        return {
          ...drill,
          drill_stats: statsData || { score: 0, comment_count: 0 },
          user_vote: userVote
        }
      })
    )

      // Filter by age group
      let filteredDrills = [...drillsWithStats]
      if (selectedAgeGroups.length > 0) {
        filteredDrills = filteredDrills.filter(drill => {
          const drillAge = drill.age_group || 'All Ages'
          return selectedAgeGroups.includes(drillAge)
        })
      }

      // Filter by category
      if (selectedCategories.length > 0) {
        filteredDrills = filteredDrills.filter(drill => {
          const category = drill.category || getCategoryFromTitle(drill.title)
          return selectedCategories.includes(category)
        })
      }

      // Sort based on selected option
      let sortedDrills = [...filteredDrills]
      if (sort === 'hot') {
        // Hot algorithm: score / time_decay
        sortedDrills.sort((a, b) => {
          const aHot = (a.drill_stats.score || 0) / (Math.max(1, (Date.now() - new Date(a.created_at)) / (1000 * 60 * 60)))
          const bHot = (b.drill_stats.score || 0) / (Math.max(1, (Date.now() - new Date(b.created_at)) / (1000 * 60 * 60)))
          return bHot - aHot
        })
      } else if (sort === 'top') {
        sortedDrills.sort((a, b) => (b.drill_stats.score || 0) - (a.drill_stats.score || 0))
      }
      
      setDrills(sortedDrills)
      setLoading(false)
    } catch (error) {
      console.error('Error in fetchDrills:', error)
      setLoading(false)
    }
  }

  function getCategoryFromTitle(title) {
    const lower = title.toLowerCase()
    if (lower.includes('warm') || lower.includes('stretch')) return 'Warm-up'
    if (lower.includes('pass')) return 'Passing'
    if (lower.includes('rondo') || lower.includes('possession')) return 'Possession'
    if (lower.includes('finish') || lower.includes('shoot') || lower.includes('1v1')) return 'Finishing'
    if (lower.includes('defend')) return 'Defending'
    if (lower.includes('dribbl')) return 'Dribbling'
    return 'Technical'
  }

  function toggleAgeGroup(age) {
    if (selectedAgeGroups.includes(age)) {
      setSelectedAgeGroups(selectedAgeGroups.filter(a => a !== age))
    } else {
      setSelectedAgeGroups([...selectedAgeGroups, age])
    }
  }

  function toggleCategory(category) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  function clearFilters() {
    setSelectedAgeGroups([])
    setSelectedCategories([])
  }

  const ageGroups = ['All Ages', 'U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18+']
  const categories = ['Warm-up', 'Passing', 'Possession', 'Finishing', 'Defending', 'Dribbling', 'Technical']

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <Navigation />
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/images/Gemini_Generated_Image_Ariel_Shot.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(5px) grayscale(30%)',
          WebkitFilter: 'blur(5px) grayscale(30%)',
          opacity: 0.6,
          zIndex: 0
        }}
      />
      
      {/* Fade to Black Gradient Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.60) 60%, rgba(10,10,10,0.50) 100%)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <main className="max-w-7xl mx-auto px-8 py-8">
        <h2 style={{
          fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
          fontSize: '3.5rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: 'white',
          textTransform: 'uppercase',
          transform: 'skew(-5deg)',
          marginBottom: '0.5rem'
        }}>
          DRILL LIBRARY
        </h2>
        <p className="text-gray-400 italic text-lg mb-8">Browse community-shared training drills</p>
        
        {/* Sort Tabs and Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <SortTabs active={sort} onChange={setSort} />
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Age Group Filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowAgeDropdown(!showAgeDropdown)
                  setShowCategoryDropdown(false)
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: selectedAgeGroups.length > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '8px',
                  color: selectedAgeGroups.length > 0 ? '#4ADE80' : 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)'
                  e.currentTarget.style.color = '#4ADE80'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAgeGroups.length > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = selectedAgeGroups.length > 0 ? '#4ADE80' : 'white'
                }}
              >
                Age Group {selectedAgeGroups.length > 0 && `(${selectedAgeGroups.length})`}
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showAgeDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '200px',
                  backgroundColor: 'rgba(26,26,26,0.98)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '8px',
                  padding: '8px',
                  zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  {ageGroups.map(age => (
                    <label
                      key={age}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAgeGroups.includes(age)}
                        onChange={() => toggleAgeGroup(age)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: 'white', fontSize: '14px' }}>{age}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown)
                  setShowAgeDropdown(false)
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: selectedCategories.length > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '8px',
                  color: selectedCategories.length > 0 ? '#4ADE80' : 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)'
                  e.currentTarget.style.color = '#4ADE80'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedCategories.length > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = selectedCategories.length > 0 ? '#4ADE80' : 'white'
                }}
              >
                Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showCategoryDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '200px',
                  backgroundColor: 'rgba(26,26,26,0.98)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '8px',
                  padding: '8px',
                  zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  {categories.map(category => (
                    <label
                      key={category}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: 'white', fontSize: '14px' }}>{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(selectedAgeGroups.length > 0 || selectedCategories.length > 0) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)'
                  e.currentTarget.style.color = '#4ADE80'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'white'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : drills.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No drills found</div>
          ) : (
            drills.map(drill => (
              <DrillCard key={drill.id} drill={drill} />
            ))
          )}
        </div>
      </main>
      </div>
    </div>
  )
}
