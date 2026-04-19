import { useEffect, useState, createContext, useContext } from 'react'
import './styles/global.css'
import {
  useCursor,
  useParticles,
  useReveal,
  useNavScroll,
  useCounter,
  useTilt,
  useScramble,
} from './hooks/useAnimations'
import { useSoundSystem, SoundSystem } from './hooks/useSound'
import {
  Loader,
  Nav,
  Hero,
  Projects,
  About,
  SkillsSection,
  Experience,
  Contact,
  Footer,
} from './components/Sections'

// ── Sound context ─────────────────────────────────────────────
export const SoundCtx = createContext(null)
export const useSound = () => useContext(SoundCtx)

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)
  const sound = useSoundSystem()

  // Loader timer
  useEffect(() => {
    const t = window.setTimeout(() => setLoaderDone(true), 1400)
    return () => window.clearTimeout(t)
  }, [])

  // Animations
  useCursor()
  useParticles()
  useReveal()
  useNavScroll()
  useCounter()
  useTilt()
  useScramble()

  // Global sound wiring — primary buttons
  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('a, button')
      if (!el) return

      // Primary CTA
      if (el.classList.contains('btn-primary') || el.classList.contains('modal-btn-demo')) {
        SoundSystem.play('click-primary')
        return
      }
      // Nav CTA (Hire me)
      if (el.classList.contains('nav-cta')) {
        SoundSystem.play('click-primary')
        return
      }
      // Ghost / secondary buttons
      if (
        el.classList.contains('btn-ghost') ||
        el.classList.contains('modal-btn-source') ||
        el.classList.contains('proj-link') ||
        el.classList.contains('c-link') ||
        el.classList.contains('drawer-close') ||
        el.classList.contains('modal-close')
      ) {
        SoundSystem.play('click-light')
        return
      }
      // Nav links
      if (el.closest('.nav-links')) {
        SoundSystem.play('tab-switch')
        return
      }
      // Stack pills / skill pills
      if (el.classList.contains('stack-pill') || el.classList.contains('skill-pill')) {
        SoundSystem.play('shimmer')
        return
      }
    }

    // Modal open sound — project cards
    const handleProjectCard = (e) => {
      const card = e.target.closest('.proj-card')
      if (card) SoundSystem.play('card-open')
    }

    // Modal close sound
    const handleModalClose = (e) => {
      const el = e.target.closest('button')
      if (el?.classList.contains('modal-close')) {
        SoundSystem.play('whoosh')
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    document.addEventListener('click', handleProjectCard)
    document.addEventListener('click', handleModalClose)

    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
      document.removeEventListener('click', handleProjectCard)
      document.removeEventListener('click', handleModalClose)
    }
  }, [])

  return (
    <SoundCtx.Provider value={sound}>
      {/* Custom cursor */}
      <div id="cur" aria-hidden="true" />
      <div id="cur-ring" aria-hidden="true" />

      {/* Particle background */}
      <canvas id="bg-canvas" aria-hidden="true" />

      {/* Splash loader */}
      <Loader done={loaderDone} />

      {/* Main page */}
      <div className="page">
        <Nav />
        <main>
          <Hero />
          <Projects />
          <About />
          <SkillsSection />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </SoundCtx.Provider>
  )
}
