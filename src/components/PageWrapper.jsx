import { useNavigate } from 'react-router-dom'
import styles from '../styles/components/PageWrapper.module.css'

function PageWrapper({ children }) {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        {children}
      </div>
    </div>
  )
}

export default PageWrapper
