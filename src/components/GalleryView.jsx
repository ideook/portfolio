import { useState, useEffect, useRef } from 'react'
import GalleryCard from './GalleryCard'
import DetailPanel from './DetailPanel'
import projectsData from '../data/projects.json'
import styles from '../styles/components/GalleryView.module.css'

const GRID_AREAS = {
  'thinka-2025':       'thinka',
  'k-random-trip-2025':'ktrip',
  'tidily-2025':       'tidily',
  'then-weather-2025': 'weather',
  'mydb-2025':         'mydb',
  'focusflow-2025':    'focus',
  'mealplan-2025':     'meal',
  'spendsmart-2025':   'spend',
  'localfinder-2025':  'local',
  'sketchnote-2025':   'sketch',
}

const PROFILE_ITEM = { _isProfile: true }

function GalleryView() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const closeTimerRef = useRef(null)
  const isProfileSelected = selectedProject?._isProfile === true

  const { projects, social } = projectsData

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isPanelOpen) handlePanelClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPanelOpen])

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  function handleCardClick(item) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    const isSame = item._isProfile
      ? selectedProject?._isProfile
      : selectedProject?.id === item.id
    if (isSame && isPanelOpen) { handlePanelClose(); return }
    setSelectedProject(item)
    setIsPanelOpen(true)
  }

  function handlePanelClose() {
    setIsPanelOpen(false)
    closeTimerRef.current = setTimeout(() => {
      setSelectedProject(null)
      closeTimerRef.current = null
    }, 460)
  }

  return (
    <div className={styles.viewportContainer}>
      <div className={[styles.galleryContainer, isPanelOpen ? styles.panelOpen : ''].filter(Boolean).join(' ')}>
        <div className={styles.galleryGrid}>

          {/* Profile card */}
          <article
            className={[styles.profileCard, isProfileSelected ? styles.profileSelected : ''].filter(Boolean).join(' ')}
            style={{ gridArea: 'profile' }}
            onClick={() => handleCardClick(PROFILE_ITEM)}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(PROFILE_ITEM)}
            aria-label="About evanyi"
          >
            <div className={styles.profileTop}>
              <a href={social.github} target="_blank" rel="noopener noreferrer"
                className={styles.profileSocialLink} title="GitHub" onClick={(e) => e.stopPropagation()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                className={styles.profileSocialLink} title="X" onClick={(e) => e.stopPropagation()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href={`mailto:${social.email}`}
                className={styles.profileSocialLink} title="Email" onClick={(e) => e.stopPropagation()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
            <div className={styles.profileBottom}>
              <p className={styles.profileRole}>Indie maker</p>
              <h1 className={styles.profileName}>evanyi</h1>
              <span className={styles.profileArrow}>↗</span>
            </div>
          </article>

          {/* Project cards */}
          {projects.map((project, index) => {
            const gridArea = GRID_AREAS[project.id]
            if (!gridArea) return null
            return (
              <GalleryCard
                key={project.id}
                project={project}
                gridArea={gridArea}
                index={index}
                isSelected={selectedProject?.id === project.id}
                isDimmed={isPanelOpen && selectedProject?.id !== project.id}
                onClick={() => handleCardClick(project)}
              />
            )
          })}
        </div>
      </div>

      <DetailPanel
        project={selectedProject}
        isVisible={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  )
}

export default GalleryView
