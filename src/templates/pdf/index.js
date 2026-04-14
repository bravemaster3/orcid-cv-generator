import ModernMinimalPDF from './ModernMinimalPDF'
import AcademicClassicPDF from './AcademicClassicPDF'
import ProfessionalPDF from './ProfessionalPDF'
import ExecutivePDF from './ExecutivePDF'
import TimelinePDF from './TimelinePDF'
import SwissMinimalPDF from './SwissMinimalPDF'

export const pdfTemplates = {
  'modern-minimal':   ModernMinimalPDF,
  'academic-classic': AcademicClassicPDF,
  'professional':     ProfessionalPDF,
  'executive':        ExecutivePDF,
  'timeline':         TimelinePDF,
  'swiss-minimal':    SwissMinimalPDF,
}
