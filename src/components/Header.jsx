import styles from '../styles/components/Header.module.css'
import projectsData from '../data/projects.json'

function Header() {
  const { navigation } = projectsData

  return (
    <header className={styles.header}>
      <h1 className={styles.brand}>evanyi<span className={styles.brandAccent}> ◦</span></h1>
      <nav className={styles.nav}>
        {navigation.primaryProjects.map((project, index) => (
          <a 
            key={index}
            href={project.url} 
            className={styles.navLink}
            target="_blank" 
            rel="noopener noreferrer"
          >
            {project.name}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header