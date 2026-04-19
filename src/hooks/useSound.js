/**
 * Sound System — AudioContext singleton
 * ─────────────────────────────────────
 * - Preloads all sounds on first user interaction
 * - Anti-spam: 60ms cooldown per sound
 * - Volume + mute persisted in localStorage
 * - Global volume multiplier applied to all sounds
 */

// ── Sound definitions ─────────────────────────────────────────
const SOUNDS = {
  'click-primary': { src: '/audio/click-primary.wav', vol: 0.35 },
  'click-light':   { src: '/audio/click-light.mp3',  vol: 0.22 },
  'success':       { src: '/audio/success.mp3',       vol: 0.30 },
  'shimmer':       { src: '/audio/shimmer.mp3',       vol: 0.18 },
  'warning':       { src: '/audio/warning.wav',       vol: 0.28 },
  'error':         { src: '/audio/error.mp3',         vol: 0.28 },
  'whoosh':        { src: '/audio/whoosh.mp3',        vol: 0.22 },
  'modal-open':    { src: '/audio/modal-open.mp3',    vol: 0.28 },
  'card-open':     { src: '/audio/card-open.mp3',     vol: 0.24 },
  'tick':          { src: '/audio/tick.wav',           vol: 0.28 },
  'tab-switch':    { src: '/audio/tab-switch.mp3',    vol: 0.20 },
}

// ── Singleton state ───────────────────────────────────────────
let audioCtx    = null
let masterGain  = null
const buffers   = {}
let loaded      = false
let loading     = false
const lastPlayed = {}  // anti-spam timestamps

// ── localStorage helpers ──────────────────────────────────────
const LS_MUTE   = 'mbr-sound-muted'
const LS_VOL    = 'mbr-sound-volume'

function getSavedMute()   { return localStorage.getItem(LS_MUTE)   === 'true' }
function getSavedVolume() { return parseFloat(localStorage.getItem(LS_VOL) ?? '0.7') }

function saveMute(val)    { localStorage.setItem(LS_MUTE, String(val)) }
function saveVolume(val)  { localStorage.setItem(LS_VOL,  String(val)) }

// ── AudioContext initialization ───────────────────────────────
function getCtx() {
  if (!audioCtx) {
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioCtx.createGain()
    masterGain.connect(audioCtx.destination)
    masterGain.gain.value = getSavedMute() ? 0 : getSavedVolume()
  }
  return audioCtx
}

// ── Preload all sounds ────────────────────────────────────────
async function preloadAll() {
  if (loaded || loading) return
  loading = true
  const ctx = getCtx()

  await Promise.allSettled(
    Object.entries(SOUNDS).map(async ([name, def]) => {
      try {
        const res = await fetch(def.src)
        const ab  = await res.arrayBuffer()
        buffers[name] = await ctx.decodeAudioData(ab)
      } catch {
        // silently skip missing/broken files
      }
    })
  )
  loaded  = true
  loading = false
}

// ── Core play function ────────────────────────────────────────
function _play(name) {
  if (!loaded) return
  if (getSavedMute()) return

  const def    = SOUNDS[name]
  const buffer = buffers[name]
  if (!def || !buffer) return

  // Anti-spam: 60ms cooldown per sound key
  const now = Date.now()
  if (lastPlayed[name] && now - lastPlayed[name] < 60) return
  lastPlayed[name] = now

  const ctx    = getCtx()
  const source = ctx.createBufferSource()
  const gain   = ctx.createGain()

  gain.gain.value = def.vol
  source.buffer   = buffer
  source.connect(gain)
  gain.connect(masterGain)

  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume()
  source.start(0)
}

// ── Public API object ─────────────────────────────────────────
export const SoundSystem = {
  // Trigger preload (call on first interaction)
  init() {
    preloadAll()
  },

  play(name) {
    _play(name)
  },

  getVolume() {
    return getSavedVolume()
  },

  setVolume(val) {
    const v = Math.max(0, Math.min(1, val))
    saveVolume(v)
    if (masterGain) masterGain.gain.value = getSavedMute() ? 0 : v
  },

  isMuted() {
    return getSavedMute()
  },

  setMuted(muted) {
    saveMute(muted)
    if (masterGain) masterGain.gain.value = muted ? 0 : getSavedVolume()
  },

  toggleMute() {
    const next = !getSavedMute()
    this.setMuted(next)
    return next
  },
}

// ── React hook ───────────────────────────────────────────────
import { useEffect, useCallback, useState } from 'react'

export function useSoundSystem() {
  const [muted,  setMutedState]  = useState(SoundSystem.isMuted())
  const [volume, setVolumeState] = useState(SoundSystem.getVolume())

  // Init on mount (preload after first interaction)
  useEffect(() => {
    const onFirst = () => {
      SoundSystem.init()
      window.removeEventListener('pointerdown', onFirst, { once: true })
    }
    window.addEventListener('pointerdown', onFirst, { once: true })
  }, [])

  const play = useCallback((name) => SoundSystem.play(name), [])

  const setVolume = useCallback((v) => {
    SoundSystem.setVolume(v)
    setVolumeState(v)
  }, [])

  const toggleMute = useCallback(() => {
    const next = SoundSystem.toggleMute()
    setMutedState(next)
    return next
  }, [])

  const setMuted = useCallback((v) => {
    SoundSystem.setMuted(v)
    setMutedState(v)
  }, [])

  return { play, muted, volume, toggleMute, setMuted, setVolume }
}
