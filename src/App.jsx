import { useState } from 'react'
import ContactForm from './components/ContactForm'
import ParticleBackground from './components/ParticleBackground'
import CinematicOverlay from './components/CinematicOverlay'
import SecretPortal from './components/SecretPortal'
import './App.css'

function App() {
  const [showCinematic, setShowCinematic] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmitSuccess = () => {
    setShowCinematic(true)
  }

  const handleCinematicEnd = () => {
    setShowCinematic(false)
    setFormSubmitted(true)
  }

  const handleSecretActivated = () => {
    setShowSecret(true)
  }

  return (
    <div className="app">
      <ParticleBackground />
      
      {showCinematic && (
        <CinematicOverlay onComplete={handleCinematicEnd} />
      )}
      
      {showSecret && (
        <SecretPortal onClose={() => setShowSecret(false)} />
      )}
      
      <main className="main-content">
        <header className="header">
          <h1 className="title">
            <span className="title-line">CONTACTEZ</span>
            <span className="title-line accent">L'ÉLITE</span>
          </h1>
          <p className="subtitle">Une expérience de contact... transcendante</p>
        </header>
        
        <ContactForm 
          onSubmitSuccess={handleSubmitSuccess}
          onSecretActivated={handleSecretActivated}
          formSubmitted={formSubmitted}
        />
      </main>
      
      <footer className="footer">
        <span className="footer-text">⚡ Propulsé par la détermination ⚡</span>
      </footer>
    </div>
  )
}

export default App

