import { useState, useRef, useEffect } from 'react'
import { SoundSystem } from '../hooks/useSound'

const CATEGORIES = [
  { key: 'ui',     label: 'UI Clicks',    sounds: ['click-primary', 'click-light', 'tick'] },
  { key: 'nav',    label: 'Navigation',   sounds: ['whoosh', 'tab-switch', 'modal-open'] },
  { key: 'cards',  label: 'Cards',        sounds: ['card-open', 'shimmer'] },
  { key: 'notify', label: 'Feedback',     sounds: ['success', 'warning', 'error'] },
]

const PREVIEW_MAP = {
  ui:     'click-primary',
  nav:    'tab-switch',
  cards:  'card-open',
  notify: 'success',
}

/* ── Icon ── */
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const IconVolume = ({ muted }) => muted ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
)

const IconPlay = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

/* ══════════════════════════════════════════════════════════
   SOUND SETTINGS PANEL
══════════════════════════════════════════════════════════ */
export function SoundSettings({ muted, volume, onToggleMute, onVolumeChange }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handlePreview = (category) => {
    SoundSystem.play(PREVIEW_MAP[category])
  }

  const pct = Math.round(volume * 100)

  return (
    <div className="sound-settings-wrap" ref={panelRef}>
      {/* Trigger button */}
      <button
        className={`sound-settings-btn${open ? ' active' : ''}`}
        onClick={() => { setOpen(v => !v); SoundSystem.play('click-light') }}
        aria-label="Sound settings"
        title="Sound settings"
      >
        <IconSettings />
      </button>

      {/* Floating panel */}
      {open && (
        <div className="sound-panel" role="dialog" aria-label="Sound settings">
          {/* Header */}
          <div className="sound-panel-head">
            <div className="sound-panel-title">
              <IconVolume muted={muted} />
              Sound Settings
            </div>
            <div className="sound-panel-pct">{muted ? 'Off' : `${pct}%`}</div>
          </div>

          {/* Master toggle + volume */}
          <div className="sound-master">
            <div className="sound-toggle-row">
              <span className="sound-toggle-label">Sound effects</span>
              <button
                className={`sound-toggle${!muted ? ' on' : ''}`}
                onClick={() => { onToggleMute(); SoundSystem.play('click-light') }}
                aria-label={muted ? 'Enable sound' : 'Disable sound'}
              >
                <span className="sound-toggle-knob" />
              </button>
            </div>

            {/* Volume slider */}
            <div className={`sound-vol-row${muted ? ' disabled' : ''}`}>
              <button
                className="sound-vol-icon"
                onClick={() => { onToggleMute(); SoundSystem.play('click-light') }}
                aria-label="Mute"
              >
                <IconVolume muted={muted} />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                disabled={muted}
                className="sound-slider"
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume"
              />
              <span className="sound-vol-pct">{pct}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="sound-divider" />

          {/* Categories */}
          <div className="sound-categories">
            <div className="sound-cat-label">Preview sounds</div>
            {CATEGORIES.map(cat => (
              <div className="sound-cat-row" key={cat.key}>
                <span className="sound-cat-name">{cat.label}</span>
                <button
                  className="sound-preview-btn"
                  onClick={() => handlePreview(cat.key)}
                  disabled={muted}
                  aria-label={`Preview ${cat.label}`}
                >
                  <IconPlay /> Play
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="sound-panel-footer">
            Settings saved automatically
          </div>
        </div>
      )}
    </div>
  )
}
