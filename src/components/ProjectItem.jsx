import { Link } from 'react-router-dom'
import styles from '../styles/components/ProjectItem.module.css'

const STATUS_LABELS = {
  'launched': '• Live',
  'development': 'In Development', 
  'paused': 'Paused',
  'discontinued': 'Discontinued'
}

const MANAGEMENT_LABELS = {
  'active': 'Actively Maintained',
  'maintenance': 'Maintenance Mode',
  'discontinued': 'No Longer Maintained'
}

const TREND_LABELS = {
  'up': '↑',
  'down': '↓', 
  'stable': '→'
}

function ProjectItem({ project }) {

  // Get overall project status based on platform statuses
  const getOverallStatus = () => {
    if (!project.platforms) return 'development'
    const statuses = Object.values(project.platforms).map(p => p.status)
    if (statuses.includes('launched')) return 'launched'
    if (statuses.includes('development')) return 'development'
    return 'paused'
  }

  const overallStatus = getOverallStatus()
  const statusLabel = STATUS_LABELS[overallStatus] || 'Unknown'

  return (
    <article className={styles.projectItem}>
      {project.image && (
        <div className={styles.projectImageContainer}>
          <img 
            src={project.image} 
            alt={`${project.name} screenshot`}
            className={styles.projectImage}
          />
        </div>
      )}
      
      <div className={styles.projectHeader}>
        <h2 className={styles.projectName}>
          <Link to={`/project/${project.id}`} className={styles.projectNameLink}>
            {project.name}
          </Link>
        </h2>
        <span className={styles.projectStatus}>
          {statusLabel}
        </span>
      </div>
      
      <p className={styles.projectDescription}>{project.description}</p>
      
      
      
      <div className={styles.projectMeta}>
        {project.launchDate && (
          <span className={styles.metaItem}>
            Launched {new Date(project.launchDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
    </article>
  )
}

export default ProjectItem