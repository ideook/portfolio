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
  const managementLabel = MANAGEMENT_LABELS[project.management] || 'Active'
  const userTrend = TREND_LABELS[project.users.trend] || ''
  const revenueTrend = TREND_LABELS[project.revenue.trend] || ''

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
      
      {project.platforms && (
        <div className={styles.platformLinks}>
          {Object.entries(project.platforms).map(([platform, data]) => (
            <a
              key={platform}
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformLink}
            >
              <span className={styles.platformName}>{platform} ↗</span>
              {data.status !== 'launched' && (
                <span className={styles.platformStatus}>({STATUS_LABELS[data.status]})</span>
              )}
            </a>
          ))}
        </div>
      )}
      
      <div className={styles.projectMetrics}>
        <div className={styles.metric}>
          <span className={styles.metricPrefix}>·</span>
          <span className={styles.metricValue}>
            {project.users.count.toLocaleString()}
          </span>
          <span className={styles.metricLabel}>
            {project.users.unit}
          </span>
          {userTrend && <span className={styles.metricTrend}>{userTrend}</span>}
        </div>
        <div className={styles.metric}>
          <span className={styles.metricPrefix}>·</span>
          <span className={styles.metricValue}>
            {project.revenue.monthly}
          </span>
          <span className={styles.metricLabel}>
            /month
          </span>
          {revenueTrend && <span className={styles.metricTrend}>{revenueTrend}</span>}
        </div>
      </div>
      
      <div className={styles.projectMeta}>
        <span className={styles.metaItem}>{managementLabel}</span>
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