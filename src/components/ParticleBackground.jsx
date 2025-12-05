import { useEffect, useRef } from 'react'
import './ParticleBackground.css'

const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    let mouse = { x: null, y: null, radius: 150 }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = this.getRandomColor()
      }

      getRandomColor() {
        const colors = [
          'rgba(0, 245, 212, 0.8)',    // Cyan
          'rgba(123, 44, 191, 0.8)',   // Purple
          'rgba(255, 0, 110, 0.8)',    // Pink
          'rgba(251, 86, 7, 0.6)',     // Orange
          'rgba(255, 190, 11, 0.6)'    // Yellow
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }

      update() {
        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x
          let dy = mouse.y - this.y
          let distance = Math.sqrt(dx * dx + dy * dy)
          let forceDirectionX = dx / distance
          let forceDirectionY = dy / distance
          let maxDistance = mouse.radius
          let force = (maxDistance - distance) / maxDistance
          let directionX = forceDirectionX * force * this.density
          let directionY = forceDirectionY * force * this.density

          if (distance < mouse.radius) {
            this.x -= directionX
            this.y -= directionY
          }
        }

        // Floating animation
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check
        if (this.x > canvas.width + 50) this.x = -50
        if (this.x < -50) this.x = canvas.width + 50
        if (this.y > canvas.height + 50) this.y = -50
        if (this.y < -50) this.y = canvas.height + 50
      }
    }

    const init = () => {
      particles = []
      const numberOfParticles = (canvas.width * canvas.height) / 8000
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle())
      }
    }

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x
          let dy = particles[a].y - particles[b].y
          let distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            let opacity = 1 - (distance / 120)
            ctx.strokeStyle = `rgba(0, 245, 212, ${opacity * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let particle of particles) {
        particle.draw()
        particle.update()
      }
      connectParticles()
      
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouse.x = e.x
      mouse.y = e.y
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    init()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="particle-background">
      <canvas ref={canvasRef} />
      <div className="gradient-overlay" />
    </div>
  )
}

export default ParticleBackground

