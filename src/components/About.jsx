import styles from '../styles/components/About.module.css'

function About() {
  return (
    <main className={styles.about}>
      <section className={styles.intro}>
        <h2>About</h2>
        <p>After 15 years in architecture, I switched to coding for the immediacy of building solutions. While I continue working in the architecture field, I'm increasingly drawn to personal projects where I can experiment and build without constraints.</p>
        <p>I believe in rapid prototyping and learning through making—some of my best work happens when I just start building.</p>
      </section>
      
      <section className={styles.section}>
        <h3>Technologies</h3>
        <ul className={styles.techList}>
          <li>C# / .NET (Windows, Revit Add-ins)</li>
          <li>Flutter / Dart (Mobile AI Apps)</li>
          <li>React / Next.js (SaaS Web)</li>
          <li>Python (AI/ML Integration)</li>
          <li>PostgreSQL / Supabase</li>
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