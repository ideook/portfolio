import styles from '../styles/components/ProjectItem.module.css'

const STATUS_ICONS = {
  'launched': '🚀',
  'development': '🛠️', 
  'paused': '⏸️',
  'discontinued': '🔚'
}

const MANAGEMENT_ICONS = {
  'active': '✅',
  'maintenance': '⚠️',
  'discontinued': '❌'
}

const TREND_ICONS = {
  'up': '📈',
  'down': '📉', 
  'stable': '➡️'
}

function ProjectItem({ project }) {
  const statusIcon = STATUS_ICONS[project.status] || '🔗'
  const managementIcon = MANAGEMENT_ICONS[project.management] || '✅'
  const userTrendIcon = TREND_ICONS[project.users.trend] || '➡️'
  const revenueTrendIcon = TREND_ICONS[project.revenue.trend] || '➡️'

  return (
    <article className={styles.projectItem}>
      <h2 className={styles.projectName}>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          🔗 {project.name}
        </a>
      </h2>
      <p className={styles.projectDescription}>{project.description}</p>
      <div className={styles.projectStatus}>
        <span className={styles.statusIcon}>{statusIcon}</span>
        <span className={styles.managementIcon}>{managementIcon}</span>
      </div>
      <div className={styles.projectMetrics}>
        <div className={styles.metric}>
          {project.users.count.toLocaleString()} {project.users.unit} {userTrendIcon}
        </div>
        <div className={styles.metric}>
          {project.revenue.monthly}/month {revenueTrendIcon}
        </div>
      </div>
    </article>
  )
}

export default ProjectItem