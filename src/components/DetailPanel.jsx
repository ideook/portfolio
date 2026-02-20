import { useEffect, useRef, useState } from 'react'
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../utils/platformIcons'
import projectsData from '../data/projects.json'
import styles from '../styles/components/DetailPanel.module.css'

const MOBILE_BREAKPOINT = 767
const SWIPE_CLOSE_THRESHOLD = 110
const SWIPE_CLOSE_VELOCITY = 0.65
const MAX_DRAG_OFFSET = 260

function getLogoThemeClass(project, stylesObj) {
  if (!project || project.imageStyle !== 'logo-hero') return ''
  if (project.imageTheme === 'tentdb-web') return stylesObj.logoHeroThemeTentdbWeb
  if (project.imageTheme === 'tentdb-luxe') return stylesObj.logoHeroThemeTentdb
  return ''
}

function DetailPanel({ project, isVisible, onClose }) {
  const panelContentRef = useRef(null)
  const dragOffsetRef = useRef(0)
  const dragStateRef = useRef({
    canDrag: false,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )
  const [sheetDragY, setSheetDragY] = useState(0)
  const [isDraggingSheet, setIsDraggingSheet] = useState(false)
  const { social } = projectsData
  const isProfile = project?._isProfile === true
  const isMobile = viewportWidth <= MOBILE_BREAKPOINT
  const isSvgImage = Boolean(project?.image) && /\.svg($|\?)/i.test(project.image)
  const isLogoHero = project?.imageStyle === 'logo-hero'
  const isMessageHero = project?.imageStyle === 'web-message-hero'

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  function handleTouchStart(e) {
    if (!isMobile || !isVisible || e.touches.length !== 1) return
    const panelEl = panelContentRef.current
    if (!panelEl) return

    const y = e.touches[0].clientY
    dragStateRef.current = {
      canDrag: panelEl.scrollTop <= 0,
      startY: y,
      lastY: y,
      startTime: performance.now(),
    }
    dragOffsetRef.current = 0
    setIsDraggingSheet(false)
  }

  function handleTouchMove(e) {
    if (!isMobile || !isVisible || e.touches.length !== 1) return
    if (!dragStateRef.current.canDrag) return

    const y = e.touches[0].clientY
    const delta = y - dragStateRef.current.startY
    dragStateRef.current.lastY = y

    if (delta <= 0) {
      if (!isDraggingSheet) return
      dragOffsetRef.current = 0
      setSheetDragY(0)
      return
    }

    if (e.cancelable) e.preventDefault()
    const nextOffset = Math.min(MAX_DRAG_OFFSET, delta)
    dragOffsetRef.current = nextOffset
    setIsDraggingSheet(true)
    setSheetDragY(nextOffset)
  }

  function handleTouchEnd() {
    if (!isMobile || !isVisible) return

    const dragDistance = dragOffsetRef.current
    const elapsed = Math.max(1, performance.now() - dragStateRef.current.startTime)
    const velocity = dragDistance / elapsed
    const shouldClose = dragDistance > SWIPE_CLOSE_THRESHOLD
      || (dragDistance > 48 && velocity > SWIPE_CLOSE_VELOCITY)

    dragStateRef.current.canDrag = false
    dragOffsetRef.current = 0
    setIsDraggingSheet(false)
    setSheetDragY(0)
    if (shouldClose) onClose()
  }

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isVisible) {
      dragStateRef.current.canDrag = false
      dragOffsetRef.current = 0
      setIsDraggingSheet(false)
      setSheetDragY(0)
    }
  }, [isVisible])

  return (
    <aside
      className={[styles.panel, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      role="complementary"
      aria-label="Details"
      aria-hidden={!isVisible}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close details panel"
        tabIndex={-1}
      />
      <div
        ref={panelContentRef}
        className={[styles.panelContent, isDraggingSheet ? styles.dragging : ''].filter(Boolean).join(' ')}
        style={isMobile ? { '--sheet-drag-y': `${sheetDragY}px` } : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />

        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
          <span className={styles.closeX}>X</span>
          <span className={styles.closeDivider}>|</span>
          <kbd className={styles.closeKey}>ESC</kbd>
        </button>

        {/* ── About / Profile panel ─────────────────────── */}
        {project && isProfile && (
          <>
            <div className={styles.profileSection}>
              <h2 className={styles.profilePanelName}>evanyi</h2>
              <p className={styles.profilePanelRole}>Indie maker · Architect turned coder</p>
            </div>

            <p className={styles.description}>
              After 15 years in architecture, I switched to coding for the immediacy of building solutions.
              I believe in rapid prototyping and learning through making.
            </p>

            <div className={styles.techSection}>
              <p className={styles.techLabel}>Stack</p>
              <ul className={styles.techList}>
                {['Flutter / Dart', 'React / Next.js', 'Python · AI/ML', 'C# / .NET', 'Supabase'].map((t) => (
                  <li key={t} className={styles.techItem}>{t}</li>
                ))}
              </ul>
            </div>

            <div className={styles.contactSection}>
              <a href={social.github} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X / Twitter
              </a>
              <a href={`mailto:${social.email}`} className={styles.contactLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {social.email}
              </a>
            </div>
          </>
        )}

        {/* ── Project panel ─────────────────────────────── */}
        {project && !isProfile && (
          <>
            <h2 className={styles.projectName}>{project.name}</h2>
            <p className={styles.description}>{project.description}</p>

            {project.platforms && (
              <div className={styles.platformLinks}>
                {Object.entries(project.platforms).map(([key, value]) => {
                  const platformLabel = PLATFORM_LABELS[key] ?? key

                  return (
                    <a
                      key={key}
                      href={value.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.platformLink}
                      aria-label={`Open ${project.name} on ${platformLabel}`}
                    >
                      <span className={styles.platformIcon}>{PLATFORM_ICONS[key]?.icon}</span>
                      <span className={styles.platformLabel}>{platformLabel}</span>
                      <span className={styles.platformArrow} aria-hidden="true">↗</span>
                    </a>
                  )
                })}
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

            {project.launchDate && (
              <p className={styles.launchDate}>
                Launched:{' '}
                {new Date(project.launchDate).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            )}
          </>
        )}

        <div className={styles.spacer} />
        {project && !isProfile && (project.image || isMessageHero) && (
          <figure
            className={[
              styles.detailImageSection,
              isSvgImage ? styles.detailImageSectionPadded : '',
              isLogoHero ? styles.logoHeroImageSection : '',
              isMessageHero ? styles.messageHeroDetailSection : '',
              getLogoThemeClass(project, styles),
            ].filter(Boolean).join(' ')}
          >
            {isMessageHero ? (
              <div className={styles.messageHeroDetailInner}>
                <p className={styles.messageHeroDetailBrand}>{project.name}</p>
                <h3 className={styles.messageHeroDetailTitle}>{project.heroHeadline ?? project.name}</h3>
                {project.heroSubline && (
                  <p className={styles.messageHeroDetailSubline}>{project.heroSubline}</p>
                )}
              </div>
            ) : isLogoHero ? (
              <div className={styles.logoHeroImageInner}>
                <div className={styles.logoHeroImageCard}>
                  <img src={project.image} alt={project.name} className={styles.logoHeroImageIcon} />
                </div>
              </div>
            ) : (
              <img src={project.image} alt={project.name} className={styles.detailImage} />
            )}
          </figure>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.copyright}>© {new Date().getFullYear()} evanyi</span>
        </footer>
      </div>
    </aside>
  )
}

export default DetailPanel
