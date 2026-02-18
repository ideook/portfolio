import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GalleryView from './components/GalleryView'
import About from './components/About'
import PrivacyPolicy from './components/PrivacyPolicy'
import PageWrapper from './components/PageWrapper'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryView />} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
      </Routes>
    </Router>
  )
}

export default App
