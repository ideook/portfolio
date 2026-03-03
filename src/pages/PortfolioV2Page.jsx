import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projects.json'
import styles from '../styles/pages/PortfolioV2Page.module.css'

const DEFAULT_APP_ICON = '/images/default-app-icon.svg'

const PLATFORM_LABELS = {
  ios: 'App Store',
  android: 'Google Play',
  web: 'Website',
  twitter: 'X / Twitter',
  github: 'GitHub',
}

const TRUNCATE_AT = 240
const PROFILE_SLUG = '__evanyi_profile__'

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
      icon: isImageSource(project.icon) ? project.icon : DEFAULT_APP_ICON,
      rating: project.rating || '4.7',
      reviewCount: project.reviewCount || project.reviews || 0,
      screenshots: Array.isArray(project.screenshots)
        ? project.screenshots
        : project.image
          ? [project.image]
          : [DEFAULT_APP_ICON],
      launchedAt: formatDate(project.launchDate),
    }))
}

function isImageSource(value) {
  if (!value || typeof value !== 'string') return false
  return value.startsWith('/') || /^https?:\/\//i.test(value) || value.startsWith('data:')
}

function PortfolioV2Page() {
  const items = useMemo(() => buildDisplayData(projectsData.projects), [])
  const [selectedSlug, setSelectedSlug] = useState(items[0]?.slug ?? null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const profileData = useMemo(() => {
    const profile = projectsData.profile || {}
    const social = projectsData.social || {}
    const profileAvatar = profile.avatar || profile.icon

    return {
      slug: PROFILE_SLUG,
      name: 'evanyi profile',
      headline: 'evanyi',
      role: profile.role || 'Indie maker · Architect turned coder',
      intro: profile.intro
        || 'After 15 years in architecture, I switched to coding for the immediacy of building solutions. I believe in rapid prototyping and learning through making.',
      avatar: isImageSource(profileAvatar) ? profileAvatar : DEFAULT_APP_ICON,
      social: {
        twitter: social.twitter || '',
        github: social.github || '',
        email: social.email || '',
      },
    }
  }, [])
  const isProfileSelected = selectedSlug === PROFILE_SLUG

  const selectedProject = useMemo(
    () => {
      if (isProfileSelected) return null
      return items.find((project) => project.slug === selectedSlug) ?? items[0] ?? null
    },
    [isProfileSelected, items, selectedSlug],
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

  const metaLine = selectedProject
    ? [
        `★ ${selectedProject.rating} (${selectedProject.reviewCount || 0} reviews)`,
        `${selectedProject?.launchedAt || 'TBD'}`,
        selectedProject?.price || 'Free',
        selectedProject?.management || 'active',
      ].filter(Boolean)
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
          <p className={styles.brand}>evanyi</p>
        </header>

        <div className={styles.sidebarList}>
          <button
            type="button"
            onClick={() => {
              setSelectedSlug(profileData.slug)
              setIsExpanded(false)
            }}
            className={[
              styles.sidebarItem,
              isProfileSelected ? styles.sidebarItemActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={isProfileSelected ? 'page' : undefined}
          >
            <img
              src={profileData.avatar}
              alt=""
              className={styles.sidebarItemIconImage}
              onError={(e) => {
                if (e.currentTarget.dataset.broken) return
                e.currentTarget.dataset.broken = '1'
                e.currentTarget.src = DEFAULT_APP_ICON
              }}
            />
            <span className={styles.sidebarItemName}>{profileData.name}</span>
          </button>

          {items.map((project) => {
            const isActive = project.slug === selectedSlug
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
                <img
                  src={isImageSource(project.icon) ? project.icon : DEFAULT_APP_ICON}
                  alt=""
                  className={styles.sidebarItemIconImage}
                  onError={(e) => {
                    if (e.currentTarget.dataset.broken) return
                    e.currentTarget.dataset.broken = '1'
                    e.currentTarget.src = DEFAULT_APP_ICON
                  }}
                />
                <span className={styles.sidebarItemName}>{project.name}</span>
              </button>
            )
          })}
        </div>

        <div className={styles.sidebarFooter}>
          <a href="/privacy" className={styles.insightLink}>개인정보 처리 방침</a>
          <Link to="/" className={styles.insightLink}>이전 버전 보기</Link>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          {isProfileSelected ? (
            <section className={styles.profileDetailPanel}>
              <img
                src={profileData.avatar}
                alt="evanyi avatar"
                className={styles.profileAvatar}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_APP_ICON
                }}
              />

              <h1 className={styles.profileHeading}>{profileData.headline}</h1>
              <p className={styles.profileRole}>{profileData.role}</p>
              <p className={styles.profileIntro}>{profileData.intro}</p>

              <div className={styles.profileSocials}>
                {profileData.social.twitter && (
                  <a
                    href={profileData.social.twitter}
                    className={styles.profileSocialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {profileData.social.github && (
                  <a
                    href={profileData.social.github}
                    className={styles.profileSocialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {profileData.social.email && (
                  <a
                    href={`mailto:${profileData.social.email}`}
                    className={styles.profileSocialLink}
                  >
                    {profileData.social.email}
                  </a>
                )}
              </div>
            </section>
          ) : (
            <>
              {selectedProject?.category ? (
                <p className={styles.category}>{selectedProject.category}</p>
              ) : null}

              <h1 className={styles.title}>{selectedProject?.name}</h1>

              <section className={styles.descriptionBlock}>
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

              <p className={styles.metaLine} aria-label="project meta">{metaLine.join(' · ')}</p>

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
                        <img
                          src={src}
                          alt={`${selectedProject.name} screenshot ${index + 1}`}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_APP_ICON
                          }}
                        />
                      </figure>
                    ))
                  ) : (
                    <p className={styles.emptyGallery}>No screenshot available.</p>
                  )}
                </div>
              </section>
            </>
          )}

          <footer className={styles.footer}>
            <span>© 2026 evanyi portfolio. v2 layout.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default PortfolioV2Page
