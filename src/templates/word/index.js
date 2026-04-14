import { buildModernMinimalWord } from './ModernMinimalWord'
import { buildAcademicClassicWord } from './AcademicClassicWord'
import { buildProfessionalWord } from './ProfessionalWord'
import { buildExecutiveWord } from './ExecutiveWord'
import { buildTimelineWord } from './TimelineWord'
import { buildSwissMinimalWord } from './SwissMinimalWord'

export const wordTemplates = {
  'modern-minimal':   { build: buildModernMinimalWord,   circularPhoto: false },
  'academic-classic': { build: buildAcademicClassicWord, circularPhoto: false },
  'professional':     { build: buildProfessionalWord,     circularPhoto: false },
  'executive':        { build: buildExecutiveWord,        circularPhoto: false },
  'timeline':         { build: buildTimelineWord,        circularPhoto: true  },
  'swiss-minimal':    { build: buildSwissMinimalWord,    circularPhoto: false },
}
