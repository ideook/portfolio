import styles from '../styles/components/About.module.css'

function About() {
  return (
    <main className={styles.about}>
      <section className={styles.intro}>
        <h2>About</h2>
        <p>Developer focused on building useful products that people actually use.</p>
      </section>
      
      <section className={styles.section}>
        <h3>Experience</h3>
        <p>Building web services and mobile applications with a focus on user experience and performance.</p>
      </section>
      
      <section className={styles.section}>
        <h3>Technologies</h3>
        <ul className={styles.techList}>
          <li>JavaScript / TypeScript</li>
          <li>React / React Native</li>
          <li>Node.js / Express</li>
          <li>Python / Django</li>
          <li>PostgreSQL / MongoDB</li>
        </ul>
      </section>
      
      <section className={styles.section}>
        <h3>Contact</h3>
        <p>Feel free to reach out for collaborations or just a friendly chat.</p>
      </section>
    </main>
  )
}

export default About