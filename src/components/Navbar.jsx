import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, FileText, Sun, Moon, Monitor } from 'lucide-react'

const links = [
  { to: '/', label: 'Generator' },
  { to: '/templates', label: 'Templates' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/contribute', label: 'Contribute' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
]

const MODES = ['system', 'light', 'dark']

function ThemeIcon({ mode }) {
  if (mode === 'dark') return <Moon className="w-4 h-4" />
  if (mode === 'light') return <Sun className="w-4 h-4" />
  return <Monitor className="w-4 h-4" />
}

function Navbar({ darkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { mode, setTheme } = darkMode || {}

  const cycleTheme = () => {
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length]
    setTheme(next)
  }

  const themeLabel = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System'

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold text-lg">
            <FileText className="w-6 h-6" />
            <span>ORCID CV Generator</span>
          </NavLink>

          {/* Desktop links + theme toggle */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${themeLabel} (click to cycle)`}
              className="ml-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              aria-label={`Switch theme (current: ${themeLabel})`}
            >
              <ThemeIcon mode={mode} />
            </button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={cycleTheme}
              title={`Theme: ${themeLabel}`}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Switch theme (current: ${themeLabel})`}
            >
              <ThemeIcon mode={mode} />
            </button>
            <button
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
