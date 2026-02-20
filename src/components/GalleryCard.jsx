import { useState } from 'react'
import styles from '../styles/components/GalleryCard.module.css'

function getCardSizeTier(placement) {
  const sizeW = placement.sizeW ?? placement.w
  const sizeH = placement.sizeH ?? placement.h
  const area = sizeW * sizeH
  const minSide = Math.min(sizeW, sizeH)

  if (minSide <= 2 || area <= 8) return 'small'
  if (area <= 14) return 'medium'
  return 'large'
}

function getLogoThemeClass(project, stylesObj) {
  if (!project || project.imageStyle !== 'logo-hero') return ''
  if (project.imageTheme === 'tentdb-web') return stylesObj.logoHeroThemeTentdbWeb
  if (project.imageTheme === 'tentdb-luxe') return stylesObj.logoHeroThemeTentdb
  return ''
}

function GalleryCard({ project, placement, isSelected, isDimmed, onClick }) {
  const [imageError, setImageError] = useState(false)

  const isMessageHero = project.imageStyle === 'web-message-hero'
  const isLogoHero = project.imageStyle === 'logo-hero' && Boolean(project.image) && !imageError
  const hasStandardImage = Boolean(project.image) && !imageError && !isLogoHero
  const hasImage = isMessageHero || isLogoHero || hasStandardImage
  const isSvgImage = hasStandardImage && /\.svg($|\?)/i.test(project.image)
  const displayTags = project.tags ? project.tags.slice(0, 3) : []
  const sizeTier = getCardSizeTier(placement)

  return (
    <article
      className={[
        styles.card,
        sizeTier === 'small' ? styles.sizeSmall : '',
        sizeTier === 'medium' ? styles.sizeMedium : '',
        sizeTier === 'large' ? styles.sizeLarge : '',
        isMessageHero ? styles.messageHeroMode : '',
        isLogoHero ? styles.logoHeroMode : '',
        getLogoThemeClass(project, styles),
        isSelected ? styles.selected : '',
        isDimmed ? styles.dimmed : '',
        !hasImage ? styles.noImage : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        gridColumn: `${placement.x + 1} / span ${placement.w}`,
        gridRow: `${placement.y + 1} / span ${placement.h}`,
        '--card-tilt': `${placement.tilt}deg`,
        '--card-shift-x': placement.shiftX,
        '--card-shift-y': placement.shiftY,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${project.name} details`}
    >
      {isMessageHero ? (
        <div className={styles.messageHeroBg} aria-hidden="true">
          <div className={styles.messageHeroGrid} />
          <div className={styles.messageHeroInner}>
            <p className={styles.messageHeroBrand}>{project.name}</p>
            <h2 className={styles.messageHeroTitle}>{project.heroHeadline ?? project.name}</h2>
            {project.heroSubline && <p className={styles.messageHeroSubline}>{project.heroSubline}</p>}
          </div>
        </div>
      ) : isLogoHero ? (
        <div className={styles.logoHeroBg} aria-hidden="true">
          <div className={styles.logoHeroGlow} />
          <div className={styles.logoHeroFrame}>
            <img
              src={project.image}
              alt=""
              className={styles.logoHeroIcon}
              onError={() => setImageError(true)}
              aria-hidden="true"
            />
          </div>
        </div>
      ) : hasStandardImage ? (
        <img
          src={project.image}
          alt=""
          className={[styles.bgImage, isSvgImage ? styles.bgImageInset : ''].filter(Boolean).join(' ')}
          onError={() => setImageError(true)}
          aria-hidden="true"
        />
      ) : (
        <div className={styles.bgWhite} />
      )}

      {hasImage && <div className={styles.overlay} />}

      {hasImage && !isMessageHero ? (
        <>
          <div className={styles.textContent}>
            <h2 className={styles.projectName}>{project.name}</h2>
          </div>
          {displayTags.length > 0 && (
            <div className={styles.tagsBottomRight}>
              {displayTags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </>
      ) : hasImage && isMessageHero ? (
        <>
          {displayTags.length > 0 && (
            <div className={styles.tagsBottomRight}>
              {displayTags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.textContentCenter}>
            <h2 className={styles.projectNameCenter}>{project.name}</h2>
          </div>
          {displayTags.length > 0 && (
            <div className={styles.tagsBottomRight}>
              {displayTags.map((tag) => (
                <span key={tag} className={styles.tagDark}>#{tag}</span>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default GalleryCard
