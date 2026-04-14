import ModernMinimal from './ModernMinimal'
import AcademicClassic from './AcademicClassic'
import TechStartup from './TechStartup'

export const contributors = {
  'bravemaster3': {
    slug: 'bravemaster3',
    displayName: 'bravemaster3',
    github: 'bravemaster3',
    url: 'https://github.com/bravemaster3',
    projectUrl: 'https://github.com/bravemaster3/orcid-cv-generator',
    bio: 'Building open-source tools to help researchers present their work without expensive software or data lock-in. ORCID CV Generator is free, browser-only, and MIT licensed.',
  },
}

export const templates = {
  'modern-minimal': {
    name: 'Modern Minimal',
    description: 'Clean and contemporary design with plenty of white space',
    emoji: '✨',
    previewImage: 'template-previews/modern-minimal.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: ModernMinimal,
  },
  'academic-classic': {
    name: 'Academic Classic',
    description: 'Traditional academic CV format with formal serif styling',
    emoji: '🎓',
    previewImage: 'template-previews/academic-classic.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: AcademicClassic,
  },
  'professional': {
    name: 'Professional',
    description: 'Single-column layout with a bold blue accent line',
    emoji: '💼',
    previewImage: 'template-previews/professional.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: ModernMinimal,
  },
  'executive': {
    name: 'Executive',
    description: 'Two-column layout with a dark sidebar for a bold, senior look',
    emoji: '👔',
    previewImage: 'template-previews/executive.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: TechStartup,
  },
  'timeline': {
    name: 'Timeline',
    description: 'Employment & education blended in a colour-coded chronological timeline',
    emoji: '📅',
    previewImage: 'template-previews/timeline.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: TechStartup,
  },
  'swiss-minimal': {
    name: 'Swiss Minimal',
    description: 'Ultra-clean, typography-driven design inspired by Swiss graphic design',
    emoji: '⬜',
    previewImage: 'template-previews/swiss-minimal.svg',
    creator: { slug: 'bravemaster3', name: 'bravemaster3', url: 'https://github.com/bravemaster3' },
    component: ModernMinimal,
  },
}
