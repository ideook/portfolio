import { useState } from 'react'
import styles from '../styles/components/GalleryCard.module.css'

function getCardSizeTier(placement) {
  const area = placement.w * placement.h
  const minSide = Math.min(placement.w, placement.h)

  if (minSide <= 2 || area <= 8) return 'small'
  if (area <= 14) return 'medium'
  return 'large'
}

function GalleryCard({ project, placement, isSelected, isDimmed, onClick }) {
  const [imageError, setImageError] = useState(false)

  const hasImage = Boolean(project.image) && !imageError
  const displayTags = project.tags ? project.tags.slice(0, 3) : []
  const sizeTier = getCardSizeTier(placement)

  return (
    <article
      className={[
        styles.card,
        sizeTier === 'small' ? styles.sizeSmall : '',
        sizeTier === 'medium' ? styles.sizeMedium : '',
        sizeTier === 'large' ? styles.sizeLarge : '',
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
      {hasImage ? (
        <img
          src={project.image}
          alt=""
          className={styles.bgImage}
          onError={() => setImageError(true)}
          aria-hidden="true"
        />
      ) : (
        <div className={styles.bgWhite} />
      )}

      {hasImage && <div className={styles.overlay} />}

      {hasImage ? (
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
