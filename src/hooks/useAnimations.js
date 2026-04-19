import { useEffect } from 'react'

/* ════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
════════════════════════════════════════════════════════ */
export function useCursor() {
  useEffect(() => {
    const dot  = document.getElementById('cur')
    const ring = document.getElementById('cur-ring')
    if (!dot || !ring) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      dot.style.display = 'none'
      ring.style.display = 'none'
      document.body.style.cursor = 'auto'
      return
    }

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf = null

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = `${mx}px`
      dot.style.top  = `${my}px`
    }

    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = `${rx}px`
      ring.style.top  = `${ry}px`
      raf = requestAnimationFrame(tick)
    }

    const onEnter = () => document.body.classList.add('hov')
    const onLeave = () => document.body.classList.remove('hov')

    document.addEventListener('mousemove', onMove)
    tick()

    const targets = document.querySelectorAll('a, button, .proj-card, .stat-card, .skill-card, .nav-cta')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

/* ════════════════════════════════════════════════════════
   2. PARTICLE BACKGROUND
════════════════════════════════════════════════════════ */
export function useParticles() {
  useEffect(() => {
    const canvas = document.getElementById('bg-canvas')
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0, height = 0, raf = null, particles = []

    const resize = () => {
      width  = canvas.width  = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x  = Math.random() * width
        this.y  = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.18
        this.vy = (Math.random() - 0.5) * 0.18
        this.r  = Math.random() * 1.1 + 0.3
        // mostly purple, some teal
        this.c  = Math.random() > 0.65 ? '167,139,250' : '29,158,117'
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.c}, 0.2)`
        ctx.fill()
      }
    }

    const init = () => {
      resize()
      const count = window.innerWidth < 768 ? 18 : 50
      particles = Array.from({ length: count }, () => new Particle())
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 90) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(167,139,250, ${0.07 * (1 - d / 90)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => { p.update(); p.draw() })
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

/* ════════════════════════════════════════════════════════
   3. SCROLL REVEAL
════════════════════════════════════════════════════════ */
export function useReveal() {
  useEffect(() => {
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll('.reveal')

    if (reduced) {
      elements.forEach(el => el.classList.add('in'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    // Stagger within same parent
    const groups = new Map()
    elements.forEach(el => {
      const parent = el.parentElement
      if (!groups.has(parent)) groups.set(parent, [])
      groups.get(parent).push(el)
    })

    groups.forEach(group => {
      group.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.06}s`
        observer.observe(el)
      })
    })

    return () => observer.disconnect()
  }, [])
}

/* ════════════════════════════════════════════════════════
   4. NAV SCROLL EFFECT
════════════════════════════════════════════════════════ */
export function useNavScroll() {
  useEffect(() => {
    const nav = document.getElementById('main-nav')
    if (!nav) return

    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* ════════════════════════════════════════════════════════
   5. STAT COUNTER ANIMATION
════════════════════════════════════════════════════════ */
export function useCounter() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll('[data-count]')
    if (!elements.length) return

    const countUp = (el) => {
      const target  = parseInt(el.getAttribute('data-count'), 10)
      const suffix  = el.getAttribute('data-suffix') || ''
      const duration = 1200
      const start   = performance.now()

      if (reduced) {
        el.textContent = target + suffix
        return
      }

      const tick = (now) => {
        const elapsed  = now - start
        const progress = Math.min(elapsed / duration, 1)
        // ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(ease * target)
        el.textContent = current + suffix

        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            countUp(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ════════════════════════════════════════════════════════
   6. 3D CARD TILT
════════════════════════════════════════════════════════ */
export function useTilt() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const cards = document.querySelectorAll('.tilt')
    if (!cards.length) return

    const MAX = 8 // max degrees

    const onMove = (e, card) => {
      const rect = card.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = (e.clientX - cx) / (rect.width  / 2)
      const dy   = (e.clientY - cy) / (rect.height / 2)
      const rotX = -dy * MAX
      const rotY =  dx * MAX

      card.style.transition = 'transform 0.08s linear, box-shadow 0.08s linear'
      card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`
      card.style.boxShadow  = `
        ${-dx * 10}px ${-dy * 10}px 30px rgba(0,0,0,0.3),
        0 8px 32px rgba(0,0,0,0.4)
      `
    }

    const onLeave = (card) => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease'
      card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
      card.style.boxShadow  = ''
    }

    const handlers = []

    cards.forEach(card => {
      const move  = (e) => onMove(e, card)
      const leave = ()  => onLeave(card)
      card.addEventListener('mousemove', move)
      card.addEventListener('mouseleave', leave)
      handlers.push({ card, move, leave })
    })

    return () => {
      handlers.forEach(({ card, move, leave }) => {
        card.removeEventListener('mousemove', move)
        card.removeEventListener('mouseleave', leave)
      })
    }
  }, [])
}

/* ════════════════════════════════════════════════════════
   7. TEXT SCRAMBLE (hero name)
════════════════════════════════════════════════════════ */
export function useScramble() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = document.querySelector('.hero-h1')
    if (!el) return

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'
    const original = el.innerText
    const lines = original.split('\n')

    let frame = 0
    let raf = null
    const TOTAL_FRAMES = 28

    const scramble = () => {
      frame++
      const progress = frame / TOTAL_FRAMES

      el.innerHTML = lines.map((line, li) => {
        const lineProgress = Math.max(0, (progress * 2) - li * 0.5)
        const resolved = Math.floor(lineProgress * line.length)
        const result = line
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < resolved) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
        return li === 1 ? `<em>${result}</em>` : result
      }).join('<br/>')

      if (frame < TOTAL_FRAMES) {
        raf = requestAnimationFrame(scramble)
      } else {
        // Restore clean original
        el.innerHTML = `${lines[0]}<br/><em>${lines[1]}</em>`
      }
    }

    // Start after loader finishes (1.4s)
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(scramble)
    }, 1500)

    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
