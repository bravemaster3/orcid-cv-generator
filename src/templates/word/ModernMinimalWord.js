import {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'
import { ALL_NO_BORDERS, NO_BORDER, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const DARK   = '1f2937'
const MID    = '374151'
const LIGHT  = '6b7280'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 26 })],
    spacing: { before: 280, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: DARK } },
  })
}

function itemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: DARK, size: 22 }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: LIGHT, size: 18 }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 120, after: 40 },
  })
}

function subLine(text, italic = false) {
  return new Paragraph({
    children: [new TextRun({ text, color: MID, size: 20, italics: italic })],
    spacing: { after: 40 },
  })
}

export function buildModernMinimalWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  // ── Header (photo | name/bio/email/keywords) ──────────────────────────────
  const photoCell = photoData
    ? new TableCell({
        children: [new Paragraph({ children: [photoRun(photoData, 28, 28)] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        borders: ALL_NO_BORDERS,
        margins: { right: 200 },
      })
    : null

  const infoChildren = [
    new Paragraph({
      children: [new TextRun({ text: personal?.fullName || '', bold: true, color: DARK, size: 52 })],
      spacing: { after: 80 },
    }),
  ]
  if (personal?.biography) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: MID, size: 20 })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.emails?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: LIGHT, size: 18 })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.keywords?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: LIGHT, size: 18 })],
      spacing: { after: 60 },
    }))
  }

  const infoCell = new TableCell({
    children: infoChildren,
    width: { size: photoData ? 80 : 100, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
  })

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
    rows: [new TableRow({ children: photoData ? [photoCell, infoCell] : [infoCell] })],
  })

  // ── Divider ───────────────────────────────────────────────────────────────
  const divider = new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.THICK, size: 16, color: DARK } },
    spacing: { after: 160 },
  })

  // ── Body sections ──────────────────────────────────────────────────────────
  const children = [headerTable, divider]

  if (jobs.length > 0) {
    children.push(sectionTitle('Experience'))
    jobs.forEach(job => {
      children.push(itemRow(job.title, job.dateRange))
      children.push(subLine(job.organization))
      if (job.department) children.push(subLine(job.department, true))
    })
  }
  if (edus.length > 0) {
    children.push(sectionTitle('Education'))
    edus.forEach(edu => {
      children.push(itemRow(edu.title, edu.dateRange))
      children.push(subLine(edu.organization))
      if (edu.department) children.push(subLine(edu.department, true))
    })
  }
  if (pubs.length > 0) {
    children.push(sectionTitle('Publications'))
    pubs.forEach(pub => {
      children.push(new Paragraph({
        children: [
          ...(pub.authors.length > 0 ? [new TextRun({ text: `${pub.authors.join(', ')} `, color: DARK, size: 20 })] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: DARK, size: 20 })] : []),
          new TextRun({ text: pub.title, bold: true, color: DARK, size: 20 }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: DARK, size: 20 })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: DARK, size: 20 })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: DARK, size: 20 })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: DARK, size: 20 })] : []),
          ...(pub.doi ? [new TextRun({ text: `. DOI: ${pub.doi}`, color: DARK, size: 20 })] : []),
        ],
        spacing: { before: 100, after: 80 },
      }))
    })
  }
  if (grants.length > 0) {
    children.push(sectionTitle('Funding & Grants'))
    grants.forEach(grant => {
      children.push(itemRow(grant.title, grant.dateRange))
      children.push(subLine(grant.organization))
    })
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      footers: { default: pageNumberFooter() },
      children,
    }],
  })
}
