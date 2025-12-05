import { useEffect, useState } from 'react'
import './CinematicOverlay.css'

const CinematicOverlay = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)
  const [text, setText] = useState('')
  
  const messages = [
    { text: 'TRANSMISSION EN COURS...', delay: 0 },
    { text: 'CONNEXION ÉTABLIE', delay: 1500 },
    { text: 'ANALYSE DU MESSAGE...', delay: 3000 },
    { text: '✓ VALIDÉ', delay: 4000 },
    { text: '🏆 VOUS AVEZ GAGNÉ !', delay: 4500 }
  ]

  useEffect(() => {
    const timers = messages.map((msg, index) => {
      return setTimeout(() => {
        setPhase(index)
        setText(msg.text)
      }, msg.delay)
    })

    const endTimer = setTimeout(() => {
      onComplete()
    }, 6000)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      clearTimeout(endTimer)
    }
  }, [onComplete])

  return (
    <div className="cinematic-overlay">
      <div className="scanlines" />
      <div className="vignette" />
      
      <div className="cinematic-content">
        <div className={`cinematic-text phase-${phase}`}>
          <div className="glitch-wrapper">
            <span className="glitch-text" data-text={text}>{text}</span>
          </div>
        </div>
        
        {phase < 4 && (
          <div className="loading-bar">
            <div className="loading-progress" style={{ 
              width: `${(phase + 1) * 25}%`,
              transition: 'width 1s ease-out'
            }} />
          </div>
        )}
        
        {phase === 4 && (
          <div className="victory-burst">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="burst-ray"
                style={{ '--rotation': `${i * 30}deg` }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="corner-decorations">
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>
    </div>
  )
}

export default CinematicOverlay

