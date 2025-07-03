import { useState, useEffect } from 'react'
import styles from '../styles/components/Header.module.css'
import projectsData from '../data/projects.json'

function Header() {
  const { navigation } = projectsData
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
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