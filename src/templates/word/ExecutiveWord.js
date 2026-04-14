import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, ExternalHyperlink,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const FONT        = 'Calibri'
const SIDEBAR_BG  = '1e293b'
const SIDEBAR_TXT = 'cbd5e1'
const SIDEBAR_ACC = '60a5fa'
const SIDEBAR_DIM = '94a3b8'
const KW_BG       = '334155'
const MAIN_DARK   = '0f172a'
const MAIN_MID    = '475569'
const MAIN_LIGHT  = '64748b'
const BLUE        = '3b82f6'

const SIDEBAR_SHADING = { type: ShadingType.SOLID, color: SIDEBAR_BG, fill: SIDEBAR_BG }
const KW_SHADING      = { type: ShadingType.SOLID, color: KW_BG,      fill: KW_BG }

// ── Sidebar helpers ──────────────────────────────────────────────────────────

function sidebarHeading(text) {
  return new Paragraph({
    children: [new TextRun({
      text: text.toUpperCase(),
      bold: true,
      color: SIDEBAR_ACC,
      size: 16,
      font: FONT,
      characterSpacing: 30,
    })],
    spacing: { before: 240, after: 80 },
    shading: SIDEBAR_SHADING,
  })
}

function sidebarBody(text, size = 18) {
  return new Paragraph({
    children: [new TextRun({ text, color: SIDEBAR_TXT, size, font: FONT })],
    spacing: { after: 40 },
    shading: SIDEBAR_SHADING,
  })
}

function sidebarDim(text) {
  return new Paragraph({
    children: [new TextRun({ text, color: SIDEBAR_DIM, size: 16, font: FONT })],
    spacing: { after: 100 },
    shading: SIDEBAR_SHADING,
  })
}

// Keyword chip — dark background block mimicking PDF's rounded chip
function sidebarKeyword(text) {
  return new Paragraph({
    children: [new TextRun({ text: `  ${text}  `, color: 'e2e8f0', size: 16, font: FONT })],
    spacing: { after: 60 },
    shading: KW_SHADING,
  })
}

// ── Main content helpers ─────────────────────────────────────────────────────

function mainSectionTitle(text) {
  // PDF: bold 14pt uppercase, no border — replicated faithfully
  return new Paragraph({
    children: [new TextRun({
      text: text.toUpperCase(),
      bold: true,
      color: '1e293b',
      size: 28,          // 14pt
      font: FONT,
      characterSpacing: 10,
    })],
    spacing: { before: 280, after: 120 },
    // Thin rule underneath to aid visual scanning in Word (PDF relies on font rendering alone)
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'e2e8f0' } },
  })
}

function mainItemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: MAIN_DARK, size: 22, font: FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: MAIN_LIGHT, size: 18, italics: true, font: FONT }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 120, after: 40 },
  })
}

// ── Builder ──────────────────────────────────────────────────────────────────

export function buildExecutiveWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  // ── Sidebar content ────────────────────────────────────────────────────────
  const sidebarChildren = []

  // Photo — sized to fill the sidebar width (sidebar ≈ 57 mm internal after cell margin)
  if (photoData) {
    const run = photoRun(photoData, 57, 57)
    if (run) {
      sidebarChildren.push(new Paragraph({
        children: [run],
        spacing: { after: 180 },
        shading: SIDEBAR_SHADING,
      }))
    }
  }

  // Name in sidebar (white, bold, matches PDF sidebar)
  sidebarChildren.push(new Paragraph({
    children: [new TextRun({
      text: personal?.fullName || '',
      bold: true,
      color: 'ffffff',
      size: 26,
      font: FONT,
    })],
    spacing: { after: 200 },
    shading: SIDEBAR_SHADING,
  }))

  if (personal?.biography) {
    sidebarChildren.push(sidebarHeading('About'))
    sidebarChildren.push(sidebarBody(personal.biography))
  }

  if (edus.length > 0) {
    sidebarChildren.push(sidebarHeading('Education'))
    edus.forEach(edu => {
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: edu.title, bold: true, color: SIDEBAR_TXT, size: 18, font: FONT })],
        spacing: { after: 20 },
        shading: SIDEBAR_SHADING,
      }))
      sidebarChildren.push(sidebarBody(edu.organization))
      sidebarChildren.push(sidebarDim(edu.dateRange))
    })
  }

  if (personal?.keywords?.length > 0) {
    sidebarChildren.push(sidebarHeading('Expertise'))
    personal.keywords.forEach(kw => sidebarChildren.push(sidebarKeyword(kw)))
  }

  if (personal?.emails?.length > 0) {
    sidebarChildren.push(sidebarHeading('Contact'))
    sidebarChildren.push(sidebarBody(personal.emails[0]))
  }

  // Extend sidebar background downward with a spacer paragraph
  sidebarChildren.push(new Paragraph({ children: [], shading: SIDEBAR_SHADING, spacing: { before: 2000 } }))

  // ── Main content ──────────────────────────────────────────────────────────
  const mainChildren = []

  // Large name — 32pt, matching PDF
  mainChildren.push(new Paragraph({
    children: [new TextRun({
      text: personal?.fullName || '',
      bold: true,
      color: MAIN_DARK,
      size: 64,          // 32pt
      font: FONT,
    })],
    spacing: { after: 80 },
  }))

  // "Professional Profile" tagline with thin blue bottom rule (matches PDF borderBottomWidth: 2)
  mainChildren.push(new Paragraph({
    children: [new TextRun({ text: 'Professional Profile', color: MAIN_LIGHT, size: 24, font: FONT })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
    spacing: { after: 240 },
  }))

  // Experience
  if (jobs.length > 0) {
    mainChildren.push(mainSectionTitle('Experience'))
    jobs.forEach(job => {
      mainChildren.push(mainItemRow(job.title, job.dateRange))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: job.organization, color: MAIN_MID, size: 20, font: FONT })],
        spacing: { after: 40 },
      }))
      if (job.department) {
        mainChildren.push(new Paragraph({
          children: [new TextRun({ text: job.department, color: MAIN_LIGHT, size: 18, font: FONT })],
          spacing: { after: 100 },
        }))
      }
    })
  }

  // Publications
  if (pubs.length > 0) {
    mainChildren.push(mainSectionTitle('Publications'))
    pubs.forEach(pub => {
      mainChildren.push(new Paragraph({
        children: [
          new TextRun({ text: `${pub.number}.  `, color: '94a3b8', size: 20, font: FONT }),
          ...(pub.authors.length > 0 ? [
            ...formatAuthors(pub.authors, personal?.fullName).map(seg =>
              new TextRun({ text: seg.text, bold: seg.bold, color: '1e293b', size: 20, font: FONT })
            ),
            new TextRun({ text: ' ', size: 20, font: FONT }),
          ] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: '1e293b', size: 20, font: FONT })] : []),
          new TextRun({ text: pub.title, bold: true, color: '1e293b', size: 20, font: FONT }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: BLUE, size: 20, font: FONT })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: '1e293b', size: 20, font: FONT })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: '1e293b', size: 20, font: FONT })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: '1e293b', size: 20, font: FONT })] : []),
          ...(pub.doi ? [new ExternalHyperlink({ link: `https://doi.org/${pub.doi}`, children: [new TextRun({ text: ` https://doi.org/${pub.doi}`, size: 20, font: FONT, color: '0563C1', underline: {} })] })] : []),
        ],
        border: { left: { style: BorderStyle.THICK, size: 12, color: 'e2e8f0' } },
        indent: { left: 360, hanging: 300 },
        spacing: { before: 80, after: 80 },
      }))
    })
  }

  // Grants & Funding
  if (grants.length > 0) {
    mainChildren.push(mainSectionTitle('Grants & Funding'))
    grants.forEach(grant => {
      mainChildren.push(mainItemRow(grant.title, grant.dateRange))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: grant.organization, color: MAIN_MID, size: 20, font: FONT })],
        spacing: { after: 100 },
      }))
    })
  }

  // ── Two-column layout table ───────────────────────────────────────────────
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: sidebarChildren,
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: SIDEBAR_SHADING,
            borders: ALL_NO_BORDERS,
            margins: { top: 500, bottom: 500, left: 360, right: 360 },
          }),
          new TableCell({
            children: mainChildren,
            width: { size: 67, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
            margins: { top: 500, bottom: 500, left: 560, right: 560 },
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 0, bottom: 600, left: 0, right: 0 } } },
      footers: { default: pageNumberFooter() },
      children: [table],
    }],
  })
}
