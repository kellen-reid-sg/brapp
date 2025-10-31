'use client'
import { useState } from 'react'
import DrillListSidebar from '@/components/DrillListSidebar'
import SessionBuilder from '@/components/SessionBuilder'
import Navigation from '@/components/Navigation'
import styles from './SessionBuilder.module.css'

export default function NewSessionPage() {
  const [selectedDrills, setSelectedDrills] = useState([])
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionDescription, setSessionDescription] = useState('')
  const [sessionDate, setSessionDate] = useState('')

  function addDrill(drill) {
    setSelectedDrills([...selectedDrills, {
      drill,
      order_index: selectedDrills.length,
      custom_duration: drill.duration || 15,
      notes: ''
    }])
  }

  function removeDrill(index) {
    const newDrills = selectedDrills.filter((_, i) => i !== index)
    // Update order_index for remaining drills
    setSelectedDrills(newDrills.map((d, i) => ({ ...d, order_index: i })))
  }

  function removeDrillById(drillId) {
    const newDrills = selectedDrills.filter(item => item.drill.id !== drillId)
    // Update order_index for remaining drills
    setSelectedDrills(newDrills.map((d, i) => ({ ...d, order_index: i })))
  }

  function moveDrill(index, direction) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= selectedDrills.length) return

    const newDrills = [...selectedDrills]
    ;[newDrills[index], newDrills[newIndex]] = [newDrills[newIndex], newDrills[index]]
    setSelectedDrills(newDrills.map((d, i) => ({ ...d, order_index: i })))
  }

  function updateDuration(index, duration) {
    const newDrills = [...selectedDrills]
    newDrills[index].custom_duration = parseInt(duration) || 0
    setSelectedDrills(newDrills)
  }

  function updateNotes(index, notes) {
    const newDrills = [...selectedDrills]
    newDrills[index].notes = notes
    setSelectedDrills(newDrills)
  }

  const totalDuration = selectedDrills.reduce((sum, d) => sum + (d.custom_duration || 0), 0)

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/images/background-training-foto.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(4px) grayscale(20%)',
          WebkitFilter: 'blur(4px) grayscale(20%)',
          opacity: 0.75,
          zIndex: 0
        }}
      />
      
      {/* Fade to Black Gradient Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.75) 30%, rgba(10,10,10,0.50) 60%, rgba(10,10,10,0.40) 100%)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navigation />
        <main className={styles.pageMain}>
          <h2 className={styles.pageTitle}>
            BUILD YOUR SESSION
          </h2>
          <p className="text-gray-400 italic text-lg mb-8">Select drills and build your custom training session</p>

          {/* Split Layout */}
          <div className={styles.splitLayout}>
            {/* Left: Drill List */}
            <DrillListSidebar 
              onAddDrill={addDrill} 
              onRemoveDrill={removeDrillById}
              selectedDrillIds={selectedDrills.map(d => d.drill.id)} 
            />

            {/* Right: Session Builder */}
            <SessionBuilder
              selectedDrills={selectedDrills}
              sessionTitle={sessionTitle}
              sessionDescription={sessionDescription}
              sessionDate={sessionDate}
              totalDuration={totalDuration}
              onTitleChange={setSessionTitle}
              onDescriptionChange={setSessionDescription}
              onDateChange={setSessionDate}
              onRemoveDrill={removeDrill}
              onMoveDrill={moveDrill}
              onUpdateDuration={updateDuration}
              onUpdateNotes={updateNotes}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
