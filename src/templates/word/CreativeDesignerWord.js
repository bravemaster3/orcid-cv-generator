import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const AMBER      = 'f59e0b'
const AMBER_DARK = '92400e'
const AMBER_MID  = '78350f'
const AMBER_LIGHT = 'a16207'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: AMBER_DARK, size: 26 })],
    spacing: { before: 200, after: 100 },
    border: {
      left: { style: BorderStyle.THICK, size: 16, color: AMBER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: AMBER },
    },
    indent: { left: 160 },
  })
}

function itemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: AMBER_MID, size: 22 }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: AMBER, size: 18 }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 100, after: 40 },
  })
}

export function buildCreativeDesignerWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // ── Header card: photo | name/email/bio ───────────────────────────────────
  const headerInfoChildren = [
    new Paragraph({
      children: [new TextRun({ text: personal?.fullName || '', bold: true, color: AMBER_DARK, size: 48 })],
      spacing: { after: 80 },
    }),
  ]
  if (personal?.emails?.length > 0) {
    headerInfoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: AMBER_MID, size: 20 })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.biography) {
    headerInfoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: AMBER_MID, size: 18 })],
      spacing: { after: 60 },
    }))
  }

  if (photoData) {
    const run = photoRun(photoData, 32, 32)
    const photoCell = new TableCell({
      children: [new Paragraph({ children: run ? [run] : [] })],
      width: { size: 22, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      margins: { right: 280 },
    })
    const infoCell = new TableCell({
      children: headerInfoChildren,
      width: { size: 78, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
    })
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [new TableRow({ children: [photoCell, infoCell] })],
    }))
  } else {
    children.push(...headerInfoChildren)
  }

  // Keywords
  if (personal?.keywords?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: AMBER_LIGHT, size: 18 })],
      spacing: { before: 60, after: 200 },
    }))
  }

  // ── Sections ──────────────────────────────────────────────────────────────
  if (jobs.length > 0) {
    children.push(sectionTitle('Experience'))
    jobs.forEach(job => {
      children.push(itemRow(job.title, job.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: job.organization, color: AMBER_DARK, size: 20 })],
        spacing: { after: 40 },
      }))
      if (job.department) {
        children.push(new Paragraph({
          children: [new TextRun({ text: job.department, color: AMBER_LIGHT, size: 18 })],
          spacing: { after: 80 },
        }))
      }
    })
  }

  if (edus.length > 0) {
    children.push(sectionTitle('Education'))
    edus.forEach(edu => {
      children.push(itemRow(edu.title, edu.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: edu.organization, color: AMBER_DARK, size: 20 })],
        spacing: { after: 40 },
      }))
      if (edu.department) {
        children.push(new Paragraph({
          children: [new TextRun({ text: edu.department, color: AMBER_LIGHT, size: 18 })],
          spacing: { after: 80 },
        }))
      }
    })
  }

  if (pubs.length > 0) {
    children.push(sectionTitle('Publications'))
    pubs.forEach(pub => {
      children.push(new Paragraph({
        children: [
          ...(pub.authors.length > 0 ? [
          ...formatAuthors(pub.authors, personal?.fullName).map(seg => new TextRun({ text: seg.text, bold: seg.bold, color: AMBER_MID, size: 20 })),
          new TextRun({ text: ' ', color: AMBER_MID, size: 20 }),
        ] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: AMBER_MID, size: 20 })] : []),
          new TextRun({ text: pub.title, bold: true, color: AMBER_MID, size: 20 }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: AMBER, size: 20 })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: AMBER_MID, size: 20 })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: AMBER_MID, size: 20 })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: AMBER_MID, size: 20 })] : []),
          ...(pub.doi ? [new TextRun({ text: `. DOI: ${pub.doi}`, color: AMBER_LIGHT, size: 20 })] : []),
        ],
        border: { left: { style: BorderStyle.THICK, size: 12, color: 'fbbf24' } },
        indent: { left: 120 },
        spacing: { before: 80, after: 80 },
      }))
    })
  }

  if (grants.length > 0) {
    children.push(sectionTitle('Funding'))
    grants.forEach(grant => {
      children.push(itemRow(grant.title, grant.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: grant.organization, color: AMBER_DARK, size: 20 })],
        spacing: { after: 80 },
      }))
    })
  }

  return new Document({
    background: { color: 'fef3c7' },
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 800, right: 800 } } },
      footers: { default: pageNumberFooter('a16207') },
      children,
    }],
  })
}
