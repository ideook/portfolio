import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import GalleryView from './components/GalleryView'
import PrivacyPolicy from './components/PrivacyPolicy'
import PageWrapper from './components/PageWrapper'
import PortfolioV2Page from './pages/PortfolioV2Page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioV2Page />} />
        <Route path="/old" element={<GalleryView />} />
        <Route path="/v2" element={<Navigate to="/" replace />} />
        <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
      </Routes>
    </Router>
  )
}

export default App
