import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import './ContactForm.css'

// Regex patterns pour validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/
const UNUSUAL_NAMES = ['xxx', 'test', 'aaa', 'bbb', 'asdf', '123', 'qwerty', 'admin', 'user', 'null', 'undefined']

const AnimatedPlaceholder = ({ texts, isActive }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!isActive) {
      setCurrentText('')
      return
    }

    const text = texts[currentIndex]
    let charIndex = 0
    let timeout

    if (isTyping) {
      timeout = setInterval(() => {
        if (charIndex <= text.length) {
          setCurrentText(text.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(timeout)
          setTimeout(() => setIsTyping(false), 1500)
        }
      }, 80)
    } else {
      timeout = setInterval(() => {
        if (currentText.length > 0) {
          setCurrentText(prev => prev.slice(0, -1))
        } else {
          clearInterval(timeout)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
          setIsTyping(true)
        }
      }, 40)
    }

    return () => clearInterval(timeout)
  }, [currentIndex, isTyping, isActive, texts])

  return <span className="animated-placeholder">{currentText}<span className="cursor">|</span></span>
}

const ContactForm = ({ onSubmitSuccess, onSecretActivated, formSubmitted }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isShaking, setIsShaking] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [buttonUnlocked, setButtonUnlocked] = useState(false)
  const [unlockProgress, setUnlockProgress] = useState(0)
  const [gloryMode, setGloryMode] = useState(false)
  
  const audioRef = useRef(null)
  const formRef = useRef(null)

  // Placeholders animés
  const placeholders = {
    nom: ['Votre nom légendaire...', 'Comment vous appelle-t-on ?', 'Le nom du héros...'],
    email: ['votre@email.épique', 'contact@victoire.com', 'champion@elite.fr'],
    sujet: ['L\'objet de votre quête...', 'De quoi parle-t-on ?', 'Le titre de votre saga...'],
    message: ['Écrivez votre message épique ici...', 'Partagez votre histoire...', 'Les mots qui changeront tout...']
  }

  // Vérifier le mot secret GLOIRE
  useEffect(() => {
    const checkGlory = () => {
      const allText = `${formData.nom} ${formData.email} ${formData.sujet} ${formData.message}`.toUpperCase()
      if (allText.includes('GLOIRE') && !gloryMode) {
        setGloryMode(true)
        onSecretActivated()
      }
    }
    checkGlory()
  }, [formData, gloryMode, onSecretActivated])

  // Déblocage progressif du bouton
  useEffect(() => {
    const filledFields = Object.values(formData).filter(v => v.trim().length > 0).length
    const progress = (filledFields / 4) * 100
    setUnlockProgress(progress)
    
    const allValid = 
      NAME_REGEX.test(formData.nom) &&
      EMAIL_REGEX.test(formData.email) &&
      formData.sujet.trim().length >= 3 &&
      formData.message.trim().length >= 10

    if (progress === 100 && allValid) {
      setTimeout(() => setButtonUnlocked(true), 500)
    } else {
      setButtonUnlocked(false)
    }
  }, [formData])

  // Vérifier nom inhabituel
  useEffect(() => {
    const lowerName = formData.nom.toLowerCase().trim()
    if (UNUSUAL_NAMES.some(unusual => lowerName.includes(unusual)) && formData.nom.length > 0) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 820)
    }
  }, [formData.nom])

  const validateField = (name, value) => {
    switch (name) {
      case 'nom':
        if (!value.trim()) return 'Le nom est requis'
        if (!NAME_REGEX.test(value)) return 'Nom invalide (lettres uniquement, 2-50 caractères)'
        return ''
      case 'email':
        if (!value.trim()) return 'L\'email est requis'
        if (!EMAIL_REGEX.test(value)) return 'Format d\'email invalide'
        return ''
      case 'sujet':
        if (!value.trim()) return 'Le sujet est requis'
        if (value.trim().length < 3) return 'Le sujet doit contenir au moins 3 caractères'
        return ''
      case 'message':
        if (!value.trim()) return 'Le message est requis'
        if (value.trim().length < 10) return 'Le message doit contenir au moins 10 caractères'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#00f5d4', '#7b2cbf', '#ff006e', '#fb5607', '#ffbe0b']

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Explosion centrale
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5, x: 0.5 },
        colors: colors,
        startVelocity: 45
      })
    }, 500)
  }

  const playVictorySound = () => {
    // Créer un son de victoire avec Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    const now = audioContext.currentTime
    // Mélodie de victoire (fanfare)
    playNote(523.25, now, 0.15)        // C5
    playNote(659.25, now + 0.15, 0.15) // E5
    playNote(783.99, now + 0.3, 0.15)  // G5
    playNote(1046.5, now + 0.45, 0.4)  // C6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Valider tous les champs
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    
    setErrors(newErrors)
    setTouched({ nom: true, email: true, sujet: true, message: true })
    
    if (Object.keys(newErrors).length === 0 && buttonUnlocked) {
      // Jouer le son
      playVictorySound()
      
      // Lancer les confettis
      triggerConfetti()
      
      // Déclencher l'effet cinématique
      setTimeout(() => {
        onSubmitSuccess()
      }, 1000)
      
      // Afficher la popup après le cinématique
      setTimeout(() => {
        setShowPopup(true)
      }, 5000)
    }
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <>
      <form ref={formRef} className={`contact-form ${gloryMode ? 'glory-mode' : ''}`} onSubmit={handleSubmit}>
        <div className={`form-group ${isShaking ? 'shake' : ''} ${errors.nom && touched.nom ? 'error' : ''}`}>
          <label htmlFor="nom">
            <span className="label-icon">👤</span>
            <span className="label-text">Nom</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            {!formData.nom && (
              <AnimatedPlaceholder texts={placeholders.nom} isActive={!formData.nom} />
            )}
          </div>
          {errors.nom && touched.nom && <span className="error-message">{errors.nom}</span>}
        </div>

        <div className={`form-group ${errors.email && touched.email ? 'error' : ''}`}>
          <label htmlFor="email">
            <span className="label-icon">📧</span>
            <span className="label-text">Email</span>
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {!formData.email && (
              <AnimatedPlaceholder texts={placeholders.email} isActive={!formData.email} />
            )}
          </div>
          {errors.email && touched.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className={`form-group ${errors.sujet && touched.sujet ? 'error' : ''}`}>
          <label htmlFor="sujet">
            <span className="label-icon">📝</span>
            <span className="label-text">Sujet</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="sujet"
              name="sujet"
              value={formData.sujet}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {!formData.sujet && (
              <AnimatedPlaceholder texts={placeholders.sujet} isActive={!formData.sujet} />
            )}
          </div>
          {errors.sujet && touched.sujet && <span className="error-message">{errors.sujet}</span>}
        </div>

        <div className={`form-group ${errors.message && touched.message ? 'error' : ''}`}>
          <label htmlFor="message">
            <span className="label-icon">💬</span>
            <span className="label-text">Message</span>
          </label>
          <div className="input-wrapper textarea-wrapper">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="5"
            />
            {!formData.message && (
              <AnimatedPlaceholder texts={placeholders.message} isActive={!formData.message} />
            )}
          </div>
          {errors.message && touched.message && <span className="error-message">{errors.message}</span>}
        </div>

        <div className="button-container">
          <div className="unlock-progress">
            <div 
              className="unlock-bar" 
              style={{ width: `${unlockProgress}%` }}
            />
            <span className="unlock-text">
              {unlockProgress < 100 
                ? `Déverrouillage... ${Math.round(unlockProgress)}%` 
                : buttonUnlocked 
                  ? '🔓 Prêt à envoyer !' 
                  : '⚠️ Corrigez les erreurs'}
            </span>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${buttonUnlocked ? 'unlocked' : 'locked'}`}
            disabled={!buttonUnlocked}
          >
            <span className="button-bg"></span>
            <span className="button-text">
              {buttonUnlocked ? '🚀 ENVOYER' : '🔒 VERROUILLÉ'}
            </span>
            <span className="button-shine"></span>
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <div className="popup-glow"></div>
            <div className="popup-content">
              <div className="popup-icon">🏆</div>
              <h2>FÉLICITATIONS !</h2>
              <h3>VOUS AVEZ GAGNÉ !</h3>
              <p className="popup-message">
                Votre message a été envoyé avec succès dans les archives de l'élite.
                Préparez-vous à recevoir une réponse légendaire.
              </p>
              <div className="popup-details">
                <div className="detail-item">
                  <span className="detail-label">Destinataire</span>
                  <span className="detail-value">{formData.nom}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sujet</span>
                  <span className="detail-value">{formData.sujet}</span>
                </div>
              </div>
              <button className="popup-close" onClick={closePopup}>
                <span>CONTINUER L'AVENTURE</span>
              </button>
            </div>
            <div className="popup-particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="popup-particle" style={{
                  '--delay': `${Math.random() * 2}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--duration': `${2 + Math.random() * 3}s`
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ContactForm
