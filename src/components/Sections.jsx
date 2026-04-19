import { useState, useEffect, useCallback } from 'react'
import { ME, PROJECTS, SKILLS, EXPERIENCE, STATS } from '../data'
import { SoundSettings } from './SoundSettings'
import { useSound } from '../App'

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const IconArrow = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"/>
  </svg>
)

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 1l12 12M13 1L1 13"/>
  </svg>
)

const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11L11 3M11 3H6M11 3V8"/>
  </svg>
)

const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const PROJECT_ICONS = {
  purple: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  teal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  coral: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  blue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
}

const COLOR_MAP = {
  purple: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  teal:   { bg: 'rgba(29,158,117,0.12)',  color: '#1D9E75' },
  coral:  { bg: 'rgba(216,90,48,0.12)',   color: '#D85A30' },
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6' },
}

/* ══════════════════════════════════════════════════════════
   PROJECT DETAIL MODAL
══════════════════════════════════════════════════════════ */
function ProjectDetail({ project, onClose }) {
  const [closing, setClosing] = useState(false)
  const c = COLOR_MAP[project.color] || COLOR_MAP.purple

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 260)
  }, [onClose])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  const hasDemo   = project.demo   && project.demo   !== '#'
  const hasSource = project.github && project.github !== '#'

  return (
    <div
      className={`modal-backdrop${closing ? ' closing' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <div className={`modal-card${closing ? ' closing' : ''}`}>

        {/* Drag handle */}
        <div className="modal-handle" />

        {/* Top bar */}
        <div className="modal-topbar">
          <div className="modal-breadcrumb">
            Projects <span>/ {project.name}</span>
          </div>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            <IconClose />
          </button>
        </div>

        {/* Two-column body */}
        <div className="modal-body">

          {/* ── Left: info + CTAs ── */}
          <div className="modal-left">
            {/* Icon + Title + Year */}
            <div className="modal-proj-header">
              <div className="modal-icon" style={{ background: c.bg, color: c.color }}>
                {PROJECT_ICONS[project.color]}
              </div>
              <div className="modal-proj-title-wrap">
                <div className="modal-proj-name">{project.name}</div>
                <div className="modal-proj-subtitle">{project.subtitle}</div>
              </div>
              <div className="modal-year-badge">{project.year}</div>
            </div>

            {/* Tags */}
            <div className="modal-tags">
              {project.featured && <span className="ptag featured-tag">Featured</span>}
              {project.tags.map(t => <span className="ptag" key={t}>{t}</span>)}
            </div>

            {/* Description */}
            <p className="modal-desc">{project.desc}</p>

            {/* CTAs */}
            <div className="modal-actions">
              {hasDemo ? (
                <a href={project.demo} target="_blank" rel="noreferrer" className="modal-btn-demo">
                  <IconExternal /> Live Demo
                </a>
              ) : (
                <span className="modal-btn-demo disabled">
                  <IconExternal /> Demo coming soon
                </span>
              )}
              {hasSource ? (
                <a href={project.github} target="_blank" rel="noreferrer" className="modal-btn-source">
                  <IconGithub /> Source Code
                </a>
              ) : (
                <span className="modal-btn-source disabled">
                  <IconGithub /> Private repo
                </span>
              )}
            </div>
          </div>

          {/* ── Right: case study ── */}
          <div className="modal-right">
            <div className="modal-case-label">Case Study</div>

            <div className="modal-block">
              <div className="modal-block-kicker">Problem</div>
              <p>{project.problem}</p>
            </div>

            <div className="modal-block">
              <div className="modal-block-kicker">Solution</div>
              <p>{project.solution}</p>
            </div>

            <div className="modal-block impact">
              <div className="modal-block-kicker">Impact</div>
              <p>{project.impact}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════ */
export function Loader({ done }) {
  return (
    <div id="loader" className={done ? 'out' : ''}>
      <div className="ld-inner">
        <div className="ld-initials">M<span>B</span>R</div>
        <div className="ld-bar-wrap"><div className="ld-bar" /></div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
export function Nav() {
  const sound = useSound()

  return (
    <nav className="nav" id="main-nav">
      <div className="inner nav-inner">
        <a href="#home" className="nav-logo">{ME.initials}</a>

        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-right">
          {sound && (
            <SoundSettings
              muted={sound.muted}
              volume={sound.volume}
              onToggleMute={sound.toggleMute}
              onVolumeChange={sound.setVolume}
            />
          )}
          <a href={`mailto:${ME.email}`} className="nav-cta">Hire me</a>
        </div>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-orb" aria-hidden="true" />
      <div className="hero-orb-2" aria-hidden="true" />

      <div className="inner hero-shell">
        <div className="hero-badge reveal">
          <div className="hero-badge-dot" />
          <span>Available for work</span>
        </div>

        <h1 className="hero-h1 reveal">
          {ME.firstName}<br />
          Ben <em>Romdhane</em>
        </h1>

        <p className="hero-role reveal">
          <strong>Full Stack Developer</strong> — {ME.roleDetail}
        </p>

        <p className="hero-desc reveal">{ME.bio}</p>

        <div className="hero-actions reveal">
          <a href="#projects" className="btn-primary">View projects</a>
          <a href={ME.resume} className="btn-ghost" target="_blank" rel="noreferrer">Download CV</a>
        </div>

        <div className="hero-stack reveal">
          {ME.stack.map(item => <span className="stack-pill" key={item}>{item}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════════════ */
export function Projects() {
  const [selected, setSelected] = useState(null)

  const featured = PROJECTS.filter(p => p.featured)
  const regular  = PROJECTS.filter(p => !p.featured)

  return (
    <section id="projects">
      <div className="inner">
        <div className="section-head">
          <div>
            <p className="sec-label reveal">Selected projects</p>
            <h2 className="section-title reveal">Real problems, real solutions.</h2>
          </div>
          <p className="section-note reveal">
            Click any project to explore the full case study, demo, and source code.
          </p>
        </div>

        <div className="projects-grid">
          {/* Featured */}
          {featured.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              featured
              onClick={() => setSelected(p)}
            />
          ))}
          {/* Regular */}
          {regular.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <ProjectDetail
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}

/* ── Single Project Card ── */
function ProjectCard({ project, featured, onClick }) {
  const c = COLOR_MAP[project.color] || COLOR_MAP.purple

  return (
    <div
      className={`proj-card color-${project.color} tilt reveal${featured ? ' featured' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View ${project.name} details`}
    >
      {/* Icon */}
      <div className="proj-icon" style={{ background: c.bg, color: c.color }}>
        {PROJECT_ICONS[project.color]}
      </div>

      {/* Title row */}
      <div className="proj-card-top">
        <div>
          <div className="proj-name">{project.name}</div>
          <div className="proj-subtitle">{project.subtitle}</div>
        </div>
        <div className="proj-year">{project.year}</div>
      </div>

      {/* Description */}
      <p className="proj-desc">{project.desc}</p>

      {/* Footer: tags + view button */}
      <div className="proj-footer">
        <div className="proj-tags">
          {project.featured && <span className="ptag featured-tag">Featured</span>}
          {project.tags.map(t => <span className="ptag" key={t}>{t}</span>)}
        </div>
        <span className="proj-view-btn" aria-hidden="true">
          View <IconArrow />
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════ */
export function About() {
  return (
    <section id="about">
      <div className="inner">
        <p className="sec-label reveal">About</p>
        <div className="about-row">
          <div className="about-body">
            <p className="reveal about-lead">
              Full Stack Developer from Tunisia — I bridge engineering and visual craft
              to build apps that perform well and feel great.
            </p>
            <p className="reveal">
              My work spans <strong>backend APIs</strong>, <strong>frontend interfaces</strong>,
              and <strong>AI/ML systems</strong>. I've built gamified platforms, industrial AI
              dashboards, inventory systems, and real-time chat — always with a bias toward
              shipping clean, production-ready software.
            </p>
            <p className="reveal">
              I care about product thinking, clean code, and turning technical requirements
              into systems that are useful, maintainable, and ready for real users.
            </p>
          </div>
          <div className="stat-grid">
            {STATS.map(stat => (
              <div className="stat-card reveal" key={stat.label}>
                <div className="stat-num" data-count={stat.number} data-suffix={stat.suffix}>
                  {stat.number}{stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   SKILLS
══════════════════════════════════════════════════════════ */
export function SkillsSection() {
  return (
    <section id="skills">
      <div className="inner">
        <div className="section-head">
          <div>
            <p className="sec-label reveal">Expertise</p>
            <h2 className="section-title reveal">Tools I work with daily.</h2>
          </div>
          <p className="section-note reveal">
            No decorative skill bars — just battle-tested tools used in real production systems.
          </p>
        </div>
        <div className="skills-grid">
          {SKILLS.map(group => (
            <div className="skill-card reveal" key={group.group}>
              <div className="skill-card-title">{group.group}</div>
              <div className="skill-items">
                {group.items.map(item => <span className="skill-pill" key={item}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════════════════════ */
export function Experience() {
  return (
    <section id="experience">
      <div className="inner">
        <div className="section-head">
          <div>
            <p className="sec-label reveal">Experience</p>
            <h2 className="section-title reveal">Where I've built and shipped.</h2>
          </div>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((exp, i) => (
            <div className="timeline-item reveal" key={i}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <div className="timeline-role">{exp.role}</div>
                    <div className="timeline-company">{exp.company}</div>
                  </div>
                  <div className="timeline-period">{exp.period}</div>
                </div>
                <p className="timeline-desc">{exp.description}</p>
                <div className="timeline-highlights">
                  {exp.highlights.map(h => <span className="timeline-tag" key={h}>{h}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════ */
export function Contact() {
  return (
    <section id="contact">
      <div className="inner">
        <p className="sec-label reveal">Contact</p>
        <div className="contact-bar reveal">
          <div>
            <div className="contact-left-text">Let's build something.</div>
            <div className="contact-sub">{ME.email} — {ME.location}</div>
          </div>
          <div className="contact-links">
            <a href={`https://${ME.github}`}  target="_blank" rel="noreferrer" className="c-link">
              GitHub <IconArrow />
            </a>
            <a href={`https://${ME.linkedin}`} target="_blank" rel="noreferrer" className="c-link">
              LinkedIn <IconArrow />
            </a>
            <a href={`mailto:${ME.email}`} className="c-link main">
              Email me <IconArrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer>
      <div className="inner footer-inner">
        <div className="footer-copy">© {new Date().getFullYear()} {ME.name}</div>
        <div className="footer-links">
          <a href={`https://${ME.github}`}  target="_blank" rel="noreferrer">GitHub</a>
          <a href={`https://${ME.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${ME.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}
