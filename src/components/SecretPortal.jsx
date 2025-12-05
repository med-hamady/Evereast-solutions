import { useEffect, useState } from 'react'
import './SecretPortal.css'

const SecretPortal = ({ onClose }) => {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setTimeout(() => setRevealed(true), 500)
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="secret-portal" onClick={onClose}>
      <div className="portal-vortex">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="vortex-ring" style={{ '--delay': `${i * 0.1}s` }} />
        ))}
      </div>
      
      <div className={`secret-content ${revealed ? 'revealed' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="secret-glow" />
        
        <div className="secret-header">
          <span className="secret-icon">🔮</span>
          <h2>ACCÈS ACCORDÉ</h2>
          <span className="secret-icon">🔮</span>
        </div>
        
        <div className="secret-message">
          <p className="secret-title">Vous avez découvert le mot secret !</p>
          <div className="secret-code">
            <span className="code-bracket">[</span>
            <span className="code-word">G</span>
            <span className="code-word">L</span>
            <span className="code-word">O</span>
            <span className="code-word">I</span>
            <span className="code-word">R</span>
            <span className="code-word">E</span>
            <span className="code-bracket">]</span>
          </div>
          <p className="secret-desc">
            La GLOIRE vous attend. Vous faites maintenant partie des initiés.
            Ce secret restera entre nous...
          </p>
        </div>
        
        <div className="secret-rewards">
          <h3>Récompenses Débloquées</h3>
          <div className="rewards-grid">
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <span className="reward-text">Badge Élite</span>
            </div>
            <div className="reward-item">
              <span className="reward-icon">🎯</span>
              <span className="reward-text">Accès VIP</span>
            </div>
            <div className="reward-item">
              <span className="reward-icon">🌟</span>
              <span className="reward-text">Statut Légende</span>
            </div>
          </div>
        </div>
        
        <button className="secret-close" onClick={onClose}>
          <span className="close-text">FERMER LE PORTAIL</span>
          <span className="close-hint">(ou appuyez sur Échap)</span>
        </button>
        
        <div className="secret-particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="secret-particle"
              style={{
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 3}s`,
                '--size': `${Math.random() * 6 + 2}px`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SecretPortal

