import { useParams, useNavigate } from 'react-router-dom'
import styles from '../styles/components/ProjectDetail.module.css'
import projectsData from '../data/projects.json'

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

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projectsData.projects.find(p => p.id === id)

  if (!project) {
    return (
      <main className={styles.projectDetail}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12l7 7m-7-7l7-7"/>
          </svg>
          Back
        </button>
        <h1>Project not found</h1>
      </main>
    )
  }

  const managementLabel = MANAGEMENT_LABELS[project.management] || 'Active'
  
  return (
    <main className={styles.projectDetail}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M5 12l7 7m-7-7l7-7"/>
        </svg>
        Back
      </button>

      <article className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.description}>{project.description}</p>
        </header>

        {project.image && (
          <section className={styles.imageSection}>
            <img 
              src={project.image} 
              alt={`${project.name} screenshot`}
              className={styles.projectImage}
            />
          </section>
        )}

        {project.platforms && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Platforms</h2>
            <div className={styles.platforms}>
              {Object.entries(project.platforms).map(([platform, data]) => (
                <div key={platform} className={styles.platform}>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                  >
                    <span className={styles.platformName}>{platform}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <span className={styles.platformStatus}>{STATUS_LABELS[data.status]}</span>
                </div>
              ))}
            </div>
          </section>
        )}


        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <dl className={styles.details}>
            <div className={styles.detailItem}>
              <dt>Status</dt>
              <dd>{managementLabel}</dd>
            </div>
            {project.launchDate && (
              <div className={styles.detailItem}>
                <dt>Launch Date</dt>
                <dd>{new Date(project.launchDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}</dd>
              </div>
            )}
            {project.tags && (
              <div className={styles.detailItem}>
                <dt>Tags</dt>
                <dd>
                  <div className={styles.tags}>
                    {project.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </section>
      </article>
    </main>
  )
}

export default ProjectDetail