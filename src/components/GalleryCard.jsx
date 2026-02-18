import { useState } from 'react'
import { PLATFORM_LABELS } from '../utils/platformIcons'
import styles from '../styles/components/GalleryCard.module.css'

function GalleryCard({ project, gridArea, index, isSelected, isDimmed, onClick }) {
  const [imageError, setImageError] = useState(false)

  const hasImage = Boolean(project.image) && !imageError
  const displayTags = project.tags ? project.tags.slice(0, 3) : []
  return (
    <article
      className={[
        styles.card,
        isSelected ? styles.selected : '',
        isDimmed ? styles.dimmed : '',
        !hasImage ? styles.noImage : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gridArea }}
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
        <div className={styles.textContent}>
          <h2 className={styles.projectName}>{project.name}</h2>
          {displayTags.length > 0 && (
            <div className={styles.tagsBottomRight}>
              {displayTags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
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
