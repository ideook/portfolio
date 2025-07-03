import ProjectItem from './ProjectItem'
import projectsData from '../data/projects.json'
import styles from '../styles/components/ProjectList.module.css'

function ProjectList() {
  const { projects } = projectsData

  return (
    <main className={styles.projectList}>
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </main>
  )
}

export default ProjectList