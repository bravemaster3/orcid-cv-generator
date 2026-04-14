import { useState, useEffect } from 'react'

const STORAGE_KEY = 'orcidcv_theme'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useDarkMode() {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'system'
  })

  const resolvedTheme = mode === 'system' ? getSystemTheme() : mode

  // Apply / remove the dark class whenever resolved theme changes
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Listen for OS-level changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const root = document.documentElement
      if (e.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setTheme = (newMode) => {
    setModeState(newMode)
    if (newMode === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, newMode)
    }
  }

  return { mode, resolvedTheme, setTheme }
}
