'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'
import DrillModal from './DrillModal'
import styles from './DrillListSidebar.module.css'

export default function DrillListSidebar({ onAddDrill, onRemoveDrill, selectedDrillIds = [] }) {
  const supabase = createClientComponentClient()
  const [drills, setDrills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAgeDropdown, setShowAgeDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favoritedDrillIds, setFavoritedDrillIds] = useState([])
  const [previewDrill, setPreviewDrill] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tooltipDrillId, setTooltipDrillId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(15) // Mobile pagination

  // Custom scrollbar styles
  const scrollbarStyles = `
    .drill-list-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .drill-list-scroll::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
    }
    .drill-list-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .drill-list-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.3);
    }
  `

  useEffect(() => {
    fetchDrills()
    fetchFavorites()
  }, [])

  // Reset pagination when filters/search change
  useEffect(() => {
    setVisibleCount(15)
  }, [searchQuery, selectedAgeGroups, selectedCategories, showFavoritesOnly])

  async function fetchDrills() {
    setLoading(true)
    
    const { data: drillsData, error } = await supabase
      .from('drills')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      console.error('Error fetching drills:', error)
      setLoading(false)
      return
    }

    setDrills(drillsData || [])
    setLoading(false)
  }

  async function fetchFavorites() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('favorites')
      .select('content_id')
      .eq('user_id', user.id)
      .eq('content_kind', 'drill')

    if (!error && data) {
      setFavoritedDrillIds(data.map(fav => fav.content_id))
    }
  }

  const ageGroups = ['All Ages', 'U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18+']
  const categories = ['Warm-up', 'Passing', 'Possession', 'Finishing', 'Defending', 'Dribbling', 'Technical']

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

  function getCategoryColor(category) {
    const colors = {
      'Warm-up': { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', text: '#FCD34D' },
      'Passing': { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' },
      'Possession': { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' },
      'Finishing': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#F87171' },
      'Defending': { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ADE80' },
      'Dribbling': { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6' },
      'Technical': { bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.3)', text: '#22D3EE' },
      'Small Sided Games': { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)', text: '#FB923C' },
      'Small-Sided Games': { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)', text: '#FB923C' },
      'Attacking Play': { bg: 'rgba(251, 113, 133, 0.15)', border: 'rgba(251, 113, 133, 0.3)', text: '#FB7185' },
      'Set Pieces': { bg: 'rgba(163, 230, 53, 0.15)', border: 'rgba(163, 230, 53, 0.3)', text: '#A3E635' }
    }
    return colors[category] || colors['Technical']
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
    setShowFavoritesOnly(false)
    setVisibleCount(15) // Reset pagination
  }

  const filteredDrills = drills.filter(drill => {
    const matchesSearch = drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const drillAge = drill.age_group || 'All Ages'
    const matchesAge = selectedAgeGroups.length === 0 || selectedAgeGroups.includes(drillAge)
    
    const category = drill.category || getCategoryFromTitle(drill.title)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category)
    
    const matchesFavorites = !showFavoritesOnly || favoritedDrillIds.includes(drill.id)
    
    return matchesSearch && matchesAge && matchesCategory && matchesFavorites
  })

  // For mobile: slice to visible count; for desktop: show all
  const displayedDrills = filteredDrills
  const hasMore = filteredDrills.length > visibleCount

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: 'white',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Drill Library
        </h3>
        <p style={{
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.4'
        }}>
          Select drills from the library by simply clicking on a drill card
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search drills..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          marginBottom: '12px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Age Group Filter */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowAgeDropdown(!showAgeDropdown)
              setShowCategoryDropdown(false)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
          >
            Age {selectedAgeGroups.length > 0 && `(${selectedAgeGroups.length})`}
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {showAgeDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: '160px',
              backgroundColor: 'rgba(26,26,26,0.98)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '8px',
              padding: '6px',
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
                    padding: '6px 10px',
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
                  <span style={{ color: 'white', fontSize: '12px' }}>{age}</span>
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
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
          >
            Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {showCategoryDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: '160px',
              backgroundColor: 'rgba(26,26,26,0.98)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '8px',
              padding: '6px',
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
                    padding: '6px 10px',
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
                  <span style={{ color: 'white', fontSize: '12px' }}>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Favorites Filter */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{
            padding: '6px 12px',
            backgroundColor: showFavoritesOnly ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.08)',
            border: showFavoritesOnly ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(255,255,255,0.20)',
            borderRadius: '6px',
            color: showFavoritesOnly ? '#EAB308' : 'white',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            if (!showFavoritesOnly) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (!showFavoritesOnly) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }
          }}
        >
          <svg width="12" height="12" fill={showFavoritesOnly ? '#EAB308' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Favorites
        </button>

        {/* Clear Filters */}
        {(selectedAgeGroups.length > 0 || selectedCategories.length > 0 || showFavoritesOnly) && (
          <button
            onClick={clearFilters}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Drill List */}
      <div className="drill-list-scroll" style={{
        flex: 1,
        overflowY: 'auto',
        marginRight: '-8px',
        paddingRight: '8px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '32px 0' }}>
            Loading drills...
          </div>
        ) : filteredDrills.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '32px 0' }}>
            No drills found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedDrills.slice(0, visibleCount).map(drill => {
              const category = drill.category || getCategoryFromTitle(drill.title)
              const categoryColor = getCategoryColor(category)
              const isSelected = selectedDrillIds.includes(drill.id)

              return (
                <div
                  key={drill.id}
                  style={{
                    backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.10)' : 'rgba(255,255,255,0.04)',
                    border: isSelected 
                      ? '1px solid rgba(34, 197, 94, 0.4)' 
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => isSelected ? onRemoveDrill(drill.id) : onAddDrill(drill)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = categoryColor.text
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                    gap: '8px'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontStyle: 'italic',
                      color: 'white',
                      lineHeight: '1.3',
                      flex: 1
                    }}>
                      {drill.title}
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      {/* Preview Button */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setTooltipDrillId(null) // Clear tooltip when opening modal
                            setPreviewDrill(drill)
                            setIsModalOpen(true)
                          }}
                          className={styles.previewButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
                            e.currentTarget.style.color = 'white'
                            setTooltipDrillId(drill.id)
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                            setTooltipDrillId(null)
                          }}
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        {/* Tooltip */}
                        {tooltipDrillId === drill.id && (
                          <div className={styles.tooltip}>
                            Preview
                          </div>
                        )}
                      </div>

                      {/* Checkmark if selected */}
                      {isSelected && (
                        <svg width="16" height="16" fill="none" stroke="#4ADE80" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {drill.duration || 15}m
                    </span>

                    <span style={{ 
                      padding: '2px 8px',
                      backgroundColor: categoryColor.bg,
                      border: `1px solid ${categoryColor.border}`,
                      borderRadius: '3px',
                      color: categoryColor.text,
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More Button (Mobile Only) */}
        {!loading && filteredDrills.length > 0 && hasMore && (
          <div className={styles.loadMoreContainer}>
            <button
              onClick={() => setVisibleCount(prev => prev + 15)}
              className={styles.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Drill Preview Modal */}
      {previewDrill && (
        <DrillModal 
          drill={previewDrill}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setPreviewDrill(null)
          }}
          onAddToSession={() => {
            if (!selectedDrillIds.includes(previewDrill.id)) {
              onAddDrill(previewDrill)
            }
            setIsModalOpen(false)
            setPreviewDrill(null)
          }}
          isInSession={selectedDrillIds.includes(previewDrill?.id)}
        />
      )}
    </>
  )
}
