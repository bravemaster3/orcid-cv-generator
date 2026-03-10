import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const SIDEBAR_BG  = '1e293b'
const SIDEBAR_TXT = 'cbd5e1'
const SIDEBAR_ACC = '60a5fa'
const MAIN_DARK   = '0f172a'
const MAIN_MID    = '475569'
const MAIN_LIGHT  = '64748b'
const BLUE        = '3b82f6'

const SIDEBAR_SHADING = { type: ShadingType.SOLID, color: SIDEBAR_BG, fill: SIDEBAR_BG }

function sidebarHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: SIDEBAR_ACC, size: 18 })],
    spacing: { before: 200, after: 80 },
    shading: SIDEBAR_SHADING,
  })
}

function sidebarText(text, size = 18) {
  return new Paragraph({
    children: [new TextRun({ text, color: SIDEBAR_TXT, size })],
    spacing: { after: 40 },
    shading: SIDEBAR_SHADING,
  })
}

function mainSectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: '1e293b', size: 24 })],
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE } },
  })
}

function mainItemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: MAIN_DARK, size: 22 }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: MAIN_LIGHT, size: 18, italics: true }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 100, after: 40 },
  })
}

export function buildExecutiveWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebarChildren = []

  // Photo at top of sidebar (full-width feel, ~55mm)
  if (photoData) {
    const run = photoRun(photoData, 55, 55)
    if (run) {
      sidebarChildren.push(new Paragraph({
        children: [run],
        spacing: { after: 160 },
        shading: SIDEBAR_SHADING,
      }))
    }
  }

  // Name in sidebar (white, bold)
  sidebarChildren.push(new Paragraph({
    children: [new TextRun({ text: personal?.fullName || '', bold: true, color: 'ffffff', size: 26 })],
    spacing: { after: 160 },
    shading: SIDEBAR_SHADING,
  }))

  if (personal?.biography) {
    sidebarChildren.push(sidebarHeading('About'))
    sidebarChildren.push(sidebarText(personal.biography))
  }

  if (edus.length > 0) {
    sidebarChildren.push(sidebarHeading('Education'))
    edus.forEach(edu => {
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: edu.title, bold: true, color: SIDEBAR_TXT, size: 18 })],
        spacing: { after: 20 },
        shading: SIDEBAR_SHADING,
      }))
      sidebarChildren.push(sidebarText(edu.organization))
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: edu.dateRange, color: '94a3b8', size: 16 })],
        spacing: { after: 100 },
        shading: SIDEBAR_SHADING,
      }))
    })
  }

  if (personal?.keywords?.length > 0) {
    sidebarChildren.push(sidebarHeading('Expertise'))
    personal.keywords.forEach(kw => sidebarChildren.push(sidebarText(kw)))
  }

  if (personal?.emails?.length > 0) {
    sidebarChildren.push(sidebarHeading('Contact'))
    sidebarChildren.push(sidebarText(personal.emails[0]))
  }

  // ── Main content ──────────────────────────────────────────────────────────
  const mainChildren = []

  mainChildren.push(new Paragraph({
    children: [new TextRun({ text: personal?.fullName || '', bold: true, color: MAIN_DARK, size: 48 })],
    spacing: { after: 60 },
  }))

  mainChildren.push(new Paragraph({
    children: [new TextRun({ text: 'Professional Profile', color: MAIN_LIGHT, size: 22 })],
    border: { bottom: { style: BorderStyle.THICK, size: 12, color: BLUE } },
    spacing: { after: 200 },
  }))

  if (jobs.length > 0) {
    mainChildren.push(mainSectionTitle('Experience'))
    jobs.forEach(job => {
      mainChildren.push(mainItemRow(job.title, job.dateRange))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: job.organization, color: MAIN_MID, size: 20 })],
        spacing: { after: 40 },
      }))
      if (job.department) {
        mainChildren.push(new Paragraph({
          children: [new TextRun({ text: job.department, color: MAIN_LIGHT, size: 18 })],
          spacing: { after: 80 },
        }))
      }
    })
  }

  if (pubs.length > 0) {
    mainChildren.push(mainSectionTitle('Publications'))
    pubs.forEach(pub => {
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: pub.title, color: '1e293b', size: 20 })],
        border: { left: { style: BorderStyle.THICK, size: 12, color: 'e2e8f0' } },
        indent: { left: 120 },
        spacing: { before: 80, after: 40 },
      }))
      if (pub.journal) {
        mainChildren.push(new Paragraph({
          children: [new TextRun({ text: pub.journal, color: BLUE, italics: true, size: 18 })],
          indent: { left: 120 },
          spacing: { after: 40 },
        }))
      }
      if (pub.meta) {
        mainChildren.push(new Paragraph({
          children: [new TextRun({ text: pub.meta, color: MAIN_LIGHT, size: 18 })],
          indent: { left: 120 },
          spacing: { after: 60 },
        }))
      }
    })
  }

  if (grants.length > 0) {
    mainChildren.push(mainSectionTitle('Grants & Funding'))
    grants.forEach(grant => {
      mainChildren.push(mainItemRow(grant.title, grant.dateRange))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: grant.organization, color: MAIN_MID, size: 20 })],
        spacing: { after: 80 },
      }))
    })
  }

  // ── Layout table ──────────────────────────────────────────────────────────
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
            margins: { top: 360, bottom: 360, left: 360, right: 360 },
          }),
          new TableCell({
            children: mainChildren,
            width: { size: 67, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
            margins: { top: 360, bottom: 360, left: 500, right: 500 },
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
