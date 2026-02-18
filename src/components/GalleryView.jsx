import { useMemo, useState, useEffect } from 'react'
import GalleryCard from './GalleryCard'
import DetailPanel from './DetailPanel'
import projectsData from '../data/projects.json'
import styles from '../styles/components/GalleryView.module.css'

const PROFILE_ITEM = { _isProfile: true }
const MIN_TILE_COLS = 2
const MIN_TILE_ROWS = 2
const DETAIL_PANEL_RATIO = 0.3333

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRng(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function getGridConfig(projectCount) {
  if (projectCount <= 5) return { cols: 12, rows: 8, profileW: 4, profileH: 4 }
  if (projectCount <= 8) return { cols: 12, rows: 9, profileW: 4, profileH: 3 }
  if (projectCount <= 12) return { cols: 12, rows: 10, profileW: 3, profileH: 3 }
  return { cols: 12, rows: 10, profileW: 3, profileH: 2 }
}

function getRegionCapacity(region) {
  if (region.w < MIN_TILE_COLS || region.h < MIN_TILE_ROWS) return 0
  return Math.floor(region.w / MIN_TILE_COLS) * Math.floor(region.h / MIN_TILE_ROWS)
}

function getCutCandidates(length, minSide) {
  const candidates = []
  for (let cut = minSide; cut <= length - minSide; cut += 1) {
    candidates.push(cut)
  }
  return candidates
}

function getBalancedCut(candidates, rng) {
  if (candidates.length === 0) return null
  if (candidates.length === 1) return candidates[0]

  const center = (candidates[0] + candidates[candidates.length - 1]) / 2
  const sorted = [...candidates].sort((a, b) => Math.abs(a - center) - Math.abs(b - center))
  const bucket = sorted.slice(0, Math.min(3, sorted.length))
  return bucket[Math.floor(rng() * bucket.length)]
}

function splitRect(rect, rng) {
  const verticalCuts = getCutCandidates(rect.w, MIN_TILE_COLS)
  const horizontalCuts = getCutCandidates(rect.h, MIN_TILE_ROWS)

  const canSplitVertically = verticalCuts.length > 0
  const canSplitHorizontally = horizontalCuts.length > 0
  if (!canSplitVertically && !canSplitHorizontally) return null

  let orientation
  if (canSplitVertically && canSplitHorizontally) {
    if (Math.abs(rect.w - rect.h) >= 2) {
      orientation = rect.w > rect.h ? 'v' : 'h'
    } else {
      orientation = rng() > 0.5 ? 'v' : 'h'
    }
  } else {
    orientation = canSplitVertically ? 'v' : 'h'
  }

  if (orientation === 'v' && canSplitVertically) {
    const cut = getBalancedCut(verticalCuts, rng)
    if (cut == null) return null

    return [
      { ...rect, w: cut },
      { ...rect, x: rect.x + cut, w: rect.w - cut },
    ]
  }

  const cut = getBalancedCut(horizontalCuts, rng)
  if (cut == null) return null

  return [
    { ...rect, h: cut },
    { ...rect, y: rect.y + cut, h: rect.h - cut },
  ]
}

function splitRegion(region, targetCount, rng) {
  if (targetCount <= 0 || region.w <= 0 || region.h <= 0) return []

  const maxCount = Math.min(region.w * region.h, getRegionCapacity(region))
  const desired = Math.max(1, Math.min(targetCount, maxCount))
  const rects = [{ ...region }]

  while (rects.length < desired) {
    const splittable = rects
      .map((rect, idx) => ({ rect, idx }))
      .filter(({ rect }) => rect.w > 1 || rect.h > 1)
      .sort((a, b) => (b.rect.w * b.rect.h) - (a.rect.w * a.rect.h))

    if (splittable.length === 0) break

    const picked = splittable[0]
    const split = splitRect(picked.rect, rng)
    if (!split) break

    rects.splice(picked.idx, 1, split[0], split[1])
  }

  return rects
}

function distributeProjects(totalProjects, regions) {
  const counts = Array(regions.length).fill(0)
  if (totalProjects <= 0) return counts

  const active = regions
    .map((region, idx) => ({ region, idx }))
    .filter(({ region }) => getRegionCapacity(region) > 0)

  if (active.length === 0) return counts

  let remaining = totalProjects

  if (totalProjects >= active.length) {
    active.forEach(({ idx }) => { counts[idx] = 1 })
    remaining -= active.length
  } else {
    for (let i = 0; i < totalProjects; i += 1) counts[active[i].idx] = 1
    return counts
  }

  if (remaining <= 0) return counts

  const totalArea = active.reduce((sum, { region }) => sum + (region.w * region.h), 0)
  const weighted = active.map(({ region, idx }) => {
    const ideal = remaining * (region.w * region.h / totalArea)
    const extra = Math.floor(ideal)
    counts[idx] += extra
    return { idx, fraction: ideal - extra }
  })

  const used = weighted.reduce((sum, { idx }) => sum + (counts[idx] - 1), 0)
  let left = remaining - used
  weighted.sort((a, b) => b.fraction - a.fraction)

  for (let i = 0; i < weighted.length && left > 0; i += 1) {
    counts[weighted[i].idx] += 1
    left -= 1
  }

  return counts
}

function clampCountsByArea(counts, regions) {
  const next = [...counts]
  let overflow = 0

  for (let i = 0; i < regions.length; i += 1) {
    const max = Math.min(regions[i].w * regions[i].h, getRegionCapacity(regions[i]))
    if (next[i] > max) {
      overflow += next[i] - max
      next[i] = max
    }
  }

  while (overflow > 0) {
    let target = -1
    let room = 0
    for (let i = 0; i < regions.length; i += 1) {
      const max = Math.min(regions[i].w * regions[i].h, getRegionCapacity(regions[i]))
      const remain = max - next[i]
      if (remain > room) {
        room = remain
        target = i
      }
    }
    if (target === -1 || room <= 0) break
    next[target] += 1
    overflow -= 1
  }

  return next
}

function sortRectsByRegion(rects, type, profileRect) {
  const centerX = profileRect.x + (profileRect.w / 2)
  const centerY = profileRect.y + (profileRect.h / 2)

  if (type === 'top') {
    return [...rects].sort((a, b) => {
      const da = Math.abs((a.x + a.w / 2) - centerX)
      const db = Math.abs((b.x + b.w / 2) - centerX)
      return da - db
    })
  }

  if (type === 'bottom') {
    return [...rects].sort((a, b) => {
      const da = Math.abs((a.x + a.w / 2) - centerX)
      const db = Math.abs((b.x + b.w / 2) - centerX)
      return da - db
    })
  }

  if (type === 'left') {
    return [...rects].sort((a, b) => {
      const da = Math.abs((a.y + a.h / 2) - centerY)
      const db = Math.abs((b.y + b.h / 2) - centerY)
      return da - db
    })
  }

  return [...rects].sort((a, b) => {
    const da = Math.abs((a.y + a.h / 2) - centerY)
    const db = Math.abs((b.y + b.h / 2) - centerY)
    return da - db
  })
}

function createCardMotion(projectId, index, rect, profileRect, cols, rows) {
  const seed = hashString(`${projectId}:${index}`)
  let shiftX = ((seed >>> 8) % 5) - 2
  let shiftY = ((seed >>> 13) % 7) - 3
  let tilt = (((seed >>> 18) % 9) - 4) / 12

  if (rect.x === 0) shiftX = Math.min(shiftX, 0)
  if (rect.x + rect.w === cols) shiftX = Math.max(shiftX, 0)
  if (rect.y === 0) shiftY = Math.min(shiftY, 0)
  if (rect.y + rect.h === rows) shiftY = Math.max(shiftY, 0)

  if (rect.x + rect.w === profileRect.x) shiftX = Math.max(shiftX, 0)
  if (rect.x === profileRect.x + profileRect.w) shiftX = Math.min(shiftX, 0)
  if (rect.y + rect.h === profileRect.y) shiftY = Math.max(shiftY, 0)
  if (rect.y === profileRect.y + profileRect.h) shiftY = Math.min(shiftY, 0)

  if (rect.w <= MIN_TILE_COLS || rect.h <= MIN_TILE_ROWS) {
    shiftX = Math.round(shiftX * 0.4)
    shiftY = Math.round(shiftY * 0.4)
    tilt *= 0.4
  }

  if (rect.w * rect.h >= 10) tilt *= 0.55

  return {
    tilt,
    shiftX: `${shiftX}px`,
    shiftY: `${shiftY}px`,
  }
}

function buildLayout(projects) {
  const config = getGridConfig(projects.length)
  const { cols, rows, profileW, profileH } = config
  const profileRect = {
    x: Math.floor((cols - profileW) / 2),
    y: Math.floor((rows - profileH) / 2),
    w: profileW,
    h: profileH,
  }

  const regions = [
    { type: 'top', x: 0, y: 0, w: cols, h: profileRect.y },
    { type: 'left', x: 0, y: profileRect.y, w: profileRect.x, h: profileRect.h },
    {
      type: 'right',
      x: profileRect.x + profileRect.w,
      y: profileRect.y,
      w: cols - (profileRect.x + profileRect.w),
      h: profileRect.h,
    },
    {
      type: 'bottom',
      x: 0,
      y: profileRect.y + profileRect.h,
      w: cols,
      h: rows - (profileRect.y + profileRect.h),
    },
  ]

  const baseCounts = distributeProjects(projects.length, regions)
  const counts = clampCountsByArea(baseCounts, regions)
  const rng = createRng(hashString(projects.map((project) => project.id).join('|')))

  const groupedRects = regions.map((region, idx) => ({
    type: region.type,
    rects: splitRegion(region, counts[idx], rng),
  }))

  const orderedRects = [
    ...sortRectsByRegion(groupedRects.find((g) => g.type === 'top')?.rects ?? [], 'top', profileRect),
    ...sortRectsByRegion(groupedRects.find((g) => g.type === 'right')?.rects ?? [], 'right', profileRect),
    ...sortRectsByRegion(groupedRects.find((g) => g.type === 'bottom')?.rects ?? [], 'bottom', profileRect),
    ...sortRectsByRegion(groupedRects.find((g) => g.type === 'left')?.rects ?? [], 'left', profileRect),
  ]

  const placements = {}
  projects.forEach((project, idx) => {
    const rect = orderedRects[idx]
    if (!rect) return

    const motion = createCardMotion(project.id, idx, rect, profileRect, cols, rows)
    placements[project.id] = {
      ...rect,
      ...motion,
    }
  })

  return {
    cols,
    rows,
    profileRect,
    placements,
  }
}

function getGalleryNudgeX({ isPanelOpen, selectedProject, layout }) {
  if (!isPanelOpen || !selectedProject || selectedProject._isProfile) return '0px'
  const placement = layout.placements[selectedProject.id]
  if (!placement) return '0px'

  const panelStartRatio = 1 - DETAIL_PANEL_RATIO
  const cardRightRatio = (placement.x + placement.w) / layout.cols
  const safeMarginRatio = 0.02
  const requiredShiftRatio = cardRightRatio - (panelStartRatio - safeMarginRatio)
  if (requiredShiftRatio <= 0) return '0px'

  const nudgeVW = Math.min(33, Math.max(6, requiredShiftRatio * 100))
  return `-${nudgeVW.toFixed(2)}vw`
}

function GalleryView() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const isProfileSelected = selectedProject?._isProfile === true

  const { projects, social } = projectsData
  const layout = useMemo(() => buildLayout(projects), [projects])
  const galleryNudgeX = useMemo(
    () => getGalleryNudgeX({ isPanelOpen, selectedProject, layout }),
    [isPanelOpen, selectedProject, layout],
  )

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isPanelOpen) handlePanelClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPanelOpen])

  function handleCardClick(item) {
    const isSame = item._isProfile
      ? selectedProject?._isProfile
      : selectedProject?.id === item.id
    if (isSame && isPanelOpen) { handlePanelClose(); return }
    setSelectedProject(item)
    setIsPanelOpen(true)
  }

  function handlePanelClose() {
    setIsPanelOpen(false)
    setSelectedProject(null)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  return (
    <div className={styles.viewportContainer}>
      <div
        className={[styles.galleryContainer, isPanelOpen ? styles.panelOpen : ''].filter(Boolean).join(' ')}
        style={{ '--gallery-nudge-x': galleryNudgeX }}
      >
        <div
          className={styles.galleryGrid}
          style={{
            '--grid-cols': layout.cols,
            '--grid-rows': layout.rows,
          }}
        >

          {/* Profile card */}
          <article
            className={[styles.profileCard, isProfileSelected ? styles.profileSelected : ''].filter(Boolean).join(' ')}
            style={{
              gridColumn: `${layout.profileRect.x + 1} / span ${layout.profileRect.w}`,
              gridRow: `${layout.profileRect.y + 1} / span ${layout.profileRect.h}`,
              '--card-tilt': '0deg',
              '--card-shift-x': '0px',
              '--card-shift-y': '0px',
            }}
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
          {projects.map((project) => {
            const placement = layout.placements[project.id]
            if (!placement) return null
            return (
              <GalleryCard
                key={project.id}
                project={project}
                placement={placement}
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
