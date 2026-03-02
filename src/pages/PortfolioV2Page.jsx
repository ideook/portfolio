import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projects.json'
import styles from '../styles/pages/PortfolioV2Page.module.css'

const PLATFORM_LABELS = {
  ios: 'App Store',
  android: 'Google Play',
  web: 'Website',
  twitter: 'X / Twitter',
  github: 'GitHub',
}

const TRUNCATE_AT = 240

function getProjectSummary(project) {
  const summary = project.summary || project.description || ''
  if (summary.length <= TRUNCATE_AT) return summary
  return `${summary.slice(0, TRUNCATE_AT)}…`
}

function formatDate(dateValue) {
  if (!dateValue) return null
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return dateValue
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildDisplayData(projects = []) {
  return projects
    .filter((project) => project && project.hidden !== true)
    .map((project, index) => ({
      ...project,
      slug: project.slug || project.id || `${index}`,
      summary: project.summary || getProjectSummary(project),
      category: project.category || '',
      rating: project.rating || '4.7',
      reviewCount: project.reviewCount || project.reviews || 0,
      screenshots: Array.isArray(project.screenshots)
        ? project.screenshots
        : project.image
          ? [project.image]
          : [],
      launchedAt: formatDate(project.launchDate),
    }))
}


function PortfolioV2Page() {
  const items = useMemo(() => buildDisplayData(projectsData.projects), [])
  const [selectedSlug, setSelectedSlug] = useState(items[0]?.slug ?? null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedProject = useMemo(
    () => items.find((project) => project.slug === selectedSlug) ?? items[0],
    [items, selectedSlug],
  )

  const secondaryPlatforms = useMemo(() => {
    if (!selectedProject?.platforms) return []
    return Object.entries(selectedProject.platforms).map(([key, value]) => ({
      key,
      label: PLATFORM_LABELS[key] || key,
      url: value?.url || value,
      status: value?.status || 'link',
    }))
  }, [selectedProject?.platforms])

  const isLongDescription =
    (selectedProject?.description || '').length > TRUNCATE_AT

  const visibleDescription =
    isExpanded || !isLongDescription
      ? selectedProject?.description
      : `${(selectedProject?.description || '').slice(0, TRUNCATE_AT)}…`

  const stats = selectedProject
    ? [
        { label: 'Launch', value: selectedProject.launchedAt || 'TBD' },
        { label: 'Users', value: selectedProject?.users?.count || '-', unit: selectedProject?.users?.unit || '' },
        { label: 'Price', value: selectedProject?.price || 'Free' },
        { label: 'Status', value: selectedProject?.management || 'active' },
      ]
    : []

  async function copyAll() {
    if (!selectedProject) return
    const payload = [
      `Project: ${selectedProject.name}`,
      `Category: ${selectedProject.category}`,
      `Launched: ${selectedProject.launchedAt || 'TBD'}`,
      selectedProject.description || '',
      secondaryPlatforms.map((platform) => `${platform.label}: ${platform.url}`).join('\n'),
    ]
      .filter(Boolean)
      .join('\n')

    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      setCopied(false)
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <p className={styles.brand}>portfolio<span className={styles.brandDot}>v2</span></p>
          <p className={styles.subBrand}>Product Explorer</p>
        </header>

        <div className={styles.sidebarList}>
          {items.map((project) => {
            const isActive = project.slug === selectedProject?.slug
            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(project.slug)
                  setIsExpanded(false)
                }}
                className={[
                  styles.sidebarItem,
                  isActive ? styles.sidebarItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.sidebarItemName}>{project.name}</span>
              </button>
            )
          })}
        </div>

        <a href="/privacy" className={styles.insightLink}>개인정보 처리 방침</a>
        <Link to="/" className={styles.insightLink}>이전 버전 보기</Link>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.headerRow}>
            <p className={styles.badge}>Portfolio v2</p>
            {selectedProject && (
              <p className={styles.category}>{selectedProject.category}</p>
            )}
          </div>

          <h1 className={styles.title}>{selectedProject?.name}</h1>

          <div className={styles.statsRow}>
            {stats.map((item) => (
              <div className={styles.statCard} key={item.label}>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statValue}>
                  {item.value}{item.unit ? ` ${item.unit}` : ''}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.reputationRow}>
            <p>
              <span className={styles.metaStrong}>Google Rating</span>
              <span className={styles.metaValue}> {selectedProject?.rating} </span>
              <span className={styles.metaSub}>({selectedProject?.reviewCount || 0})</span>
            </p>
          </div>

          <section className={styles.descriptionBlock}>
            <h2 className={styles.sectionHead}>About this project</h2>
            <p className={styles.descriptionText}>{visibleDescription}</p>
            {isLongDescription && (
              <button
                type="button"
                className={styles.textLink}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </section>

          <section className={styles.actions}>
            {secondaryPlatforms.map((platform) => (
              <a
                key={`${selectedProject?.slug}-${platform.key}`}
                href={platform.url}
                className={styles.actionButton}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${platform.label}로 이동`}
              >
                {platform.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
            <button
              type="button"
              className={styles.copyButton}
              onClick={copyAll}
            >
              {copied ? 'Copied ✓' : 'Copy all'}
            </button>
          </section>

          {selectedProject?.tags?.length > 0 && (
            <div className={styles.tagsWrap}>
              {selectedProject.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <section className={styles.gallerySection}>
            <h2 className={styles.sectionHead}>Screenshots</h2>
            <div className={styles.galleryStrip}>
              {selectedProject?.screenshots?.length ? (
                selectedProject.screenshots.map((src, index) => (
                  <figure className={styles.galleryFrame} key={`${src}-${index}`}>
                    <img src={src} alt={`${selectedProject.name} screenshot ${index + 1}`} />
                  </figure>
                ))
              ) : (
                <p className={styles.emptyGallery}>No screenshot available.</p>
              )}
            </div>
          </section>

          <footer className={styles.footer}>
            <span>© 2026 evanyi portfolio. v2 layout.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default PortfolioV2Page
