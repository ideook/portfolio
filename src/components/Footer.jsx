import styles from '../styles/components/Footer.module.css'
import projectsData from '../data/projects.json'

function Footer() {
  const { social } = projectsData

  return (
    <footer className={styles.footer}>
      <a 
        href={`https://twitter.com/${social.twitter.replace('@', '')}`} 
        className={styles.socialLink}
        target="_blank" 
        rel="noopener noreferrer"
      >
        {social.twitter}
      </a>
      <a 
        href={`mailto:${social.email}`} 
        className={styles.socialLink}
      >
        {social.email}
      </a>
    </footer>
  )
}

export default Footer