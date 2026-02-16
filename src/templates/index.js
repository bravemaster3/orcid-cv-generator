import ModernMinimal from './ModernMinimal'
import AcademicClassic from './AcademicClassic'
import TechStartup from './TechStartup'

export const templates = {
  'modern-minimal': {
    name: 'Modern Minimal',
    description: 'Clean and contemporary design with plenty of white space',
    emoji: '✨',
    component: ModernMinimal
  },
  'academic-classic': {
    name: 'Academic Classic',
    description: 'Traditional academic CV format with formal styling',
    emoji: '🎓',
    component: AcademicClassic
  },
  'professional': {
    name: 'Professional',
    description: 'Single column professional layout',
    emoji: '💼',
    component: ModernMinimal
  },
  'executive': {
    name: 'Executive',
    description: 'Two-column layout with sidebar',
    emoji: '👔',
    component: TechStartup
  },
  'creative-designer': {
    name: 'Creative Designer',
    description: 'Colorful and unique layout with personality',
    emoji: '🎨',
    component: ModernMinimal
  },
  'compact-dense': {
    name: 'Compact Dense',
    description: 'Fits maximum information on one page',
    emoji: '📋',
    component: AcademicClassic
  },
  'timeline': {
    name: 'Timeline',
    description: 'Visual career timeline format',
    emoji: '📅',
    component: TechStartup
  },
  'swiss-minimal': {
    name: 'Swiss Minimal',
    description: 'Ultra-clean typography-focused design',
    emoji: '⬜',
    component: ModernMinimal
  }
}