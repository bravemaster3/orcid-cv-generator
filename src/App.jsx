import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TemplatesPage from './pages/TemplatesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FAQPage from './pages/FAQPage'
import AboutPage from './pages/AboutPage'
import ContributePage from './pages/ContributePage'
import ContributorPage from './pages/ContributorPage'
import { useDarkMode } from './hooks/useDarkMode'

function Layout({ children, darkMode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar darkMode={darkMode} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const darkMode = useDarkMode()

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout darkMode={darkMode}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/templates/contributor/:slug" element={<ContributorPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
