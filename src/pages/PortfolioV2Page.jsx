import { useMemo, useState } from 'react'
import projectsData from '../data/projects.json'
import styles from '../styles/pages/PortfolioV2Page.module.css'

const DEFAULT_APP_ICON = '/images/default-app-icon.svg'

const UI_TEXT = {
  en: {
    appLabel: 'evanyi',
    profileTitle: 'evanyi',
    role: 'Indie maker · Architect turned coder',
    intro:
      'After 15 years in architecture, I switched to coding for the immediacy of building solutions. I believe in rapid prototyping and learning through making.',
    privacy: 'Privacy',
    readMore: 'Read more',
    readLess: 'Read less',
    copyAll: 'Copy all',
    copied: 'Copied ✓',
    noScreenshot: 'No screenshot available.',
    screenshots: 'Screenshots',
    categoryLabel: 'Category',
    launchedLabel: 'Launched',
    projectLabel: 'Project',
    to: 'to',
    languageEn: 'EN',
    languageKo: '한글',
    openProfile: 'Open profile',
  },
  ko: {
    appLabel: 'evanyi',
    profileTitle: 'evanyi',
    role: '독립 앱 메이커 · 건축가에서 코더로',
    intro:
      '15년간 건축 현장에서 일한 뒤, 직접 만들고 바로 배포할 수 있는 코딩으로 방향을 바꿨습니다. 빠른 실험과 반복으로 배움의 속도를 높입니다.',
    privacy: 'Privacy',
    readMore: '더 보기',
    readLess: '접기',
    copyAll: '복사하기',
    copied: '복사됨 ✓',
    noScreenshot: '스크린샷이 없습니다.',
    screenshots: '스크린샷',
    categoryLabel: '카테고리',
    launchedLabel: '출시일',
    projectLabel: '프로젝트',
    to: '로 이동',
    languageEn: '영문',
    languageKo: '한글',
    openProfile: '프로필 보기',
  },
}

const PLATFORM_LABELS = {
  en: {
    ios: 'App Store',
    android: 'Google Play',
    web: 'Website',
    twitter: 'X / Twitter',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
  ko: {
    ios: '앱 스토어',
    android: 'Google Play',
    web: '웹사이트',
    twitter: 'X',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
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

function isImageSource(value) {
  if (!value || typeof value !== 'string') return false
  return value.startsWith('/') || /^https?:\/\//i.test(value) || value.startsWith('data:')
}

function localizeProject(project, locale) {
  const localized = project?.i18n?.[locale] || {}
  const name = localized.name || project.name || ''
  const description = localized.description || project.description || ''
  const category = localized.category || project.category || ''
  const tags = Array.isArray(localized.tags)
    ? localized.tags
    : Array.isArray(project.tags)
      ? [...project.tags]
      : []

  return {
    ...project,
    name,
    description,
    category,
    tags,
    summary: localized.summary || getProjectSummary({ description }),
  }
}

function buildDisplayData(projects = [], locale) {
  return projects
    .filter((project) => project && project.hidden !== true)
    .map((project, index) => ({
      ...localizeProject(project, locale),
      slug: project.slug || project.id || `${index}`,
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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" role="img" className={styles.socialIcon}>
      <path
        d="M18.244 2.25h3.035l-6.58 7.52 7.734 10.23h-6.06l-4.75-6.276-5.437 6.276H1.95l6.997-8.072L1.5 2.25h6.185L11.95 8.08 18.244 2.25Zm-1.064 15.5h1.683L7.74 3.97H5.94l11.24 13.78Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" role="img" className={styles.socialIcon}>
      <path
        fill="currentColor"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.01-1.023-.015-1.858-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.907-.62.07-.608.07-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.252-4.555-1.11-4.555-4.944 0-1.092.39-1.986 1.03-2.685-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025a9.564 9.564 0 0 1 5 0c1.91-1.294 2.748-1.025 2.748-1.025.545 1.376.202 2.394.1 2.647.64.7 1.028 1.593 1.028 2.685 0 3.844-2.339 4.69-4.566 4.937.359.31.678.923.678 1.86 0 1.343-.013 2.426-.013 2.756 0 .267.18.576.688.479A10.01 10.01 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" role="img" className={styles.socialIcon}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.555v-5.568c0-1.328-.026-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.94v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.374 4.27 5.462v6.277ZM5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127Zm1.78 13.017H3.56V9h3.556v11.45ZM22.225 1H1.771C.792 1 0 .758 0 .008V23.99C0 23.24.792 24 1.771 24h20.454C23.2 24 24 23.24 24 22.49V1.01C24 .26 23.2 0 22.221 0h.004Z"
      />
    </svg>
  )
}

function PortfolioV2Page() {
  const [locale, setLocale] = useState('en')
  const t = UI_TEXT[locale] || UI_TEXT.en
  const items = useMemo(() => buildDisplayData(projectsData.projects, locale), [locale])
  const [selectedSlug, setSelectedSlug] = useState(items[0]?.slug ?? null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const profileData = useMemo(() => {
    const profile = projectsData.profile || {}
    const social = projectsData.social || {}
    const profileAvatar = profile.avatar || profile.icon
    const profileLocale = profile.i18n?.[locale] || {}

    return {
      slug: PROFILE_SLUG,
      name: profileLocale.name || 'evanyi profile',
      headline: profileLocale.title || t.profileTitle,
      role: profileLocale.role || t.role,
      intro: profileLocale.intro || t.intro,
      avatar: isImageSource(profileAvatar) ? profileAvatar : DEFAULT_APP_ICON,
      social: {
        x: social.x || social.twitter || '',
        github: social.github || '',
        linkedin: social.linkedin || '',
        email: social.email || '',
      },
    }
  }, [locale, t.profileTitle, t.role, t.intro])

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
      label: PLATFORM_LABELS[locale]?.[key] || PLATFORM_LABELS.en[key] || key,
      url: value?.url || value,
      status: value?.status || 'link',
    }))
  }, [locale, selectedProject?.platforms])

  const isLongDescription =
    (selectedProject?.description || '').length > TRUNCATE_AT

  const visibleDescription =
    isExpanded || !isLongDescription
      ? selectedProject?.description
      : `${(selectedProject?.description || '').slice(0, TRUNCATE_AT)}…`

  const metaLine = selectedProject
    ? [
        `★ ${selectedProject.rating} (${selectedProject.reviewCount || 0})`,
        `${selectedProject?.launchedAt || 'TBD'}`,
        selectedProject?.management || 'active',
      ].filter(Boolean)
    : []

  async function copyAll() {
    if (!selectedProject) return
    const payload = [
      `${t.projectLabel}: ${selectedProject.name}`,
      `${t.categoryLabel}: ${selectedProject.category || '-'}`,
      `${t.launchedLabel}: ${selectedProject.launchedAt || 'TBD'}`,
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
          <p className={styles.brand}>{t.appLabel}</p>
          <button
            type="button"
            className={
              [
                styles.sidebarProfileTrigger,
                isProfileSelected ? styles.sidebarProfileTriggerActive : '',
              ].filter(Boolean).join(' ')
            }
            onClick={() => {
              setSelectedSlug(profileData.slug)
              setIsExpanded(false)
            }}
            aria-pressed={isProfileSelected}
            aria-label={t.openProfile}
            title={t.openProfile}
          >
            <img
              src={profileData.avatar}
              alt=""
              className={styles.sidebarProfileTriggerIcon}
              onError={(e) => {
                if (e.currentTarget.dataset.broken) return
                e.currentTarget.dataset.broken = '1'
                e.currentTarget.src = DEFAULT_APP_ICON
              }}
            />
          </button>
        </header>

        <div className={styles.sidebarList}>
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
                className={
                  [
                    styles.sidebarItem,
                    isActive ? styles.sidebarItemActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <img
                  src={project.icon}
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
          <a href="/privacy" className={styles.privacyLink}>
            {t.privacy}
          </a>

          <div className={styles.sidebarIconLinks}>
            <a
              href={projectsData.social?.x || projectsData.social?.twitter || '#'}
              className={styles.iconLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              title="X"
            >
              <XIcon />
            </a>
            {projectsData.social?.github && (
              <a
                href={projectsData.social.github}
                className={styles.iconLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <GitHubIcon />
              </a>
            )}
            {projectsData.social?.linkedin && (
              <a
                href={projectsData.social.linkedin}
                className={styles.iconLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            )}
          </div>

          <div className={styles.langSwitch}>
            <button
              type="button"
              className={
                [styles.langButton, locale === 'en' ? styles.langButtonActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
              onClick={() => setLocale('en')}
            >
              {t.languageEn}
            </button>
            <button
              type="button"
              className={
                [styles.langButton, locale === 'ko' ? styles.langButtonActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
              onClick={() => setLocale('ko')}
            >
              {t.languageKo}
            </button>
          </div>
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
                {profileData.social.x && (
                  <a
                    href={profileData.social.x}
                    className={styles.profileSocialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <XIcon />
                    <span>𝕏</span>
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
                    <GitHubIcon />
                    <span>GitHub</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {profileData.social.linkedin && (
                  <a
                    href={profileData.social.linkedin}
                    className={styles.profileSocialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
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
                    {isExpanded ? t.readLess : t.readMore}
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
                    aria-label={`${platform.label}${t.to}`}
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
                  {copied ? t.copied : t.copyAll}
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
                <h2 className={styles.sectionHead}>{t.screenshots}</h2>
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
                    <p className={styles.emptyGallery}>{t.noScreenshot}</p>
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
