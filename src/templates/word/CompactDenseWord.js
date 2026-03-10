import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'
import { ALL_NO_BORDERS, photoRun, pageNumberFooter } from './helpers'

const DARK  = '000000'
const MID   = '374151'
const LIGHT = '6b7280'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 20 })],
    spacing: { before: 180, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '9ca3af' } },
  })
}

function compactItem(title, org, dateRange) {
  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: DARK, size: 18 })],
      spacing: { before: 80, after: 20 },
    }),
    new Paragraph({
      children: [new TextRun({ text: org, color: MID, size: 16 })],
      spacing: { after: 20 },
    }),
    new Paragraph({
      children: [new TextRun({ text: dateRange, color: LIGHT, italics: true, size: 14 })],
      spacing: { after: 60 },
    }),
  ]
}

export function buildCompactDenseWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const topChildren = []

  // ── Header: [photo | name/email/bio/keywords] ─────────────────────────────
  const headerInfoChildren = [
    new Paragraph({
      children: [new TextRun({ text: personal?.fullName || '', bold: true, color: DARK, size: 36 })],
      spacing: { after: 40 },
    }),
  ]
  if (personal?.emails?.length > 0) {
    headerInfoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: MID, size: 16 })],
      spacing: { after: 30 },
    }))
  }
  if (personal?.biography) {
    headerInfoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: MID, size: 16 })],
      spacing: { after: 30 },
    }))
  }
  if (personal?.keywords?.length > 0) {
    headerInfoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: LIGHT, size: 14 })],
      spacing: { after: 40 },
    }))
  }

  if (photoData) {
    const run = photoRun(photoData, 22, 22)
    const photoCell = new TableCell({
      children: [new Paragraph({ children: run ? [run] : [] })],
      width: { size: 15, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      margins: { right: 200 },
    })
    const infoCell = new TableCell({
      children: headerInfoChildren,
      width: { size: 85, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
    })
    topChildren.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [new TableRow({ children: [photoCell, infoCell] })],
    }))
  } else {
    topChildren.push(...headerInfoChildren)
  }

  // Horizontal rule after header
  topChildren.push(new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: DARK } },
    spacing: { before: 80, after: 160 },
  }))

  // ── Two-column body ───────────────────────────────────────────────────────
  const leftChildren = []
  if (jobs.length > 0) {
    leftChildren.push(sectionTitle('Experience'))
    jobs.forEach(job => leftChildren.push(...compactItem(job.title, job.organization, job.dateRange)))
  }
  if (edus.length > 0) {
    leftChildren.push(sectionTitle('Education'))
    edus.forEach(edu => leftChildren.push(...compactItem(edu.title, edu.organization, edu.dateRange)))
  }
  if (grants.length > 0) {
    leftChildren.push(sectionTitle('Funding'))
    grants.forEach(grant => leftChildren.push(...compactItem(grant.title, grant.organization, grant.dateRange)))
  }

  const rightChildren = []
  if (pubs.length > 0) {
    rightChildren.push(sectionTitle('Publications'))
    pubs.forEach(pub => {
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: pub.title, color: DARK, size: 16 })],
        spacing: { before: 60, after: 20 },
      }))
      if (pub.journal) {
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: pub.journal, color: MID, italics: true, size: 14 })],
          spacing: { after: 20 },
        }))
      }
      if (pub.meta) {
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: pub.meta, color: LIGHT, size: 14 })],
          spacing: { after: 60 },
        }))
      }
    })
  }

  const twoCol = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph({ children: [] })],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
            margins: { right: 200 },
          }),
          new TableCell({
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph({ children: [] })],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
            margins: { left: 200 },
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 540, bottom: 540, left: 720, right: 720 } } },
      footers: { default: pageNumberFooter() },
      children: [...topChildren, twoCol],
    }],
  })
}
