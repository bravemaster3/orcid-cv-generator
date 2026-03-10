import ModernMinimal from './ModernMinimal'
import AcademicClassic from './AcademicClassic'
import TechStartup from './TechStartup'

export const templates = {
  'modern-minimal': {
    name: 'Modern Minimal',
    description: 'Clean and contemporary design with plenty of white space',
    emoji: '✨',
    previewImage: 'template-previews/modern-minimal.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: ModernMinimal,
  },
  'academic-classic': {
    name: 'Academic Classic',
    description: 'Traditional academic CV format with formal Times New Roman styling',
    emoji: '🎓',
    previewImage: 'template-previews/academic-classic.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: AcademicClassic,
  },
  'professional': {
    name: 'Professional',
    description: 'Single-column layout with a bold blue accent line',
    emoji: '💼',
    previewImage: 'template-previews/professional.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: ModernMinimal,
  },
  'executive': {
    name: 'Executive',
    description: 'Two-column layout with a dark sidebar for a bold, senior look',
    emoji: '👔',
    previewImage: 'template-previews/executive.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: TechStartup,
  },
  'creative-designer': {
    name: 'Creative Designer',
    description: 'Warm amber theme with rounded card sections and personality',
    emoji: '🎨',
    previewImage: 'template-previews/creative-designer.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: ModernMinimal,
  },
  'compact-dense': {
    name: 'Compact Dense',
    description: 'Two-column layout that fits maximum information on one page',
    emoji: '📋',
    previewImage: 'template-previews/compact-dense.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: AcademicClassic,
  },
  'timeline': {
    name: 'Timeline',
    description: 'Chronological career timeline with indigo accents',
    emoji: '📅',
    previewImage: 'template-previews/timeline.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: TechStartup,
  },
  'swiss-minimal': {
    name: 'Swiss Minimal',
    description: 'Ultra-clean, typography-driven design inspired by Swiss graphic design',
    emoji: '⬜',
    previewImage: 'template-previews/swiss-minimal.svg',
    creator: { name: 'ORCID CV Generator', url: 'https://github.com/bravemaster3/orcid-cv-generator' },
    component: ModernMinimal,
  },
}
