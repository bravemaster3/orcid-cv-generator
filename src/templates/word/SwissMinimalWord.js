import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'
import { ALL_NO_BORDERS, photoRun, pageNumberFooter } from './helpers'

const DARK  = '000000'
const MID   = '333333'
const LIGHT = '666666'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 18, characterSpacing: 40 })],
    spacing: { before: 280, after: 120 },
  })
}

function gridItem(title, org, dateRange) {
  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: DARK, size: 20 })],
      spacing: { before: 80, after: 20 },
    }),
    new Paragraph({
      children: [new TextRun({ text: org, color: MID, size: 18 })],
      spacing: { after: 20 },
    }),
    new Paragraph({
      children: [new TextRun({ text: dateRange, color: LIGHT, size: 16 })],
      spacing: { after: 100 },
    }),
  ]
}

export function buildSwissMinimalWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // ── Header: [name/email/bio/keywords] | [photo top-right] ─────────────────
  const leftHeaderChildren = [
    new Paragraph({
      children: [new TextRun({ text: personal?.fullName || '', color: DARK, size: 64, characterSpacing: -20 })],
      spacing: { after: 80 },
    }),
  ]
  if (personal?.emails?.length > 0) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: DARK, size: 20 })],
      spacing: { after: 80 },
    }))
  }
  if (personal?.biography) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: DARK, size: 20 })],
      spacing: { after: 80 },
    }))
  }
  if (personal?.keywords?.length > 0) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('   '), color: DARK, size: 16, characterSpacing: 20 })],
      spacing: { after: 120 },
    }))
  }

  if (photoData) {
    const run = photoRun(photoData, 28, 28)
    const leftCell = new TableCell({
      children: leftHeaderChildren,
      width: { size: 75, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
    })
    const rightCell = new TableCell({
      children: [new Paragraph({ children: run ? [run] : [] })],
      width: { size: 25, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      margins: { left: 200 },
    })
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [new TableRow({ children: [leftCell, rightCell] })],
    }))
  } else {
    children.push(...leftHeaderChildren)
  }

  // ── Divider ────────────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DARK } },
    spacing: { after: 200 },
  }))

  // ── Two-column grid: experience+education | funding ────────────────────────
  const leftChildren = []
  if (jobs.length > 0) {
    leftChildren.push(sectionTitle('Experience'))
    jobs.forEach(job => leftChildren.push(...gridItem(job.title, job.organization, job.dateRange)))
  }
  if (edus.length > 0) {
    leftChildren.push(sectionTitle('Education'))
    edus.forEach(edu => leftChildren.push(...gridItem(edu.title, edu.organization, edu.dateRange)))
  }

  const rightChildren = []
  if (grants.length > 0) {
    rightChildren.push(sectionTitle('Funding'))
    grants.forEach(grant => rightChildren.push(...gridItem(grant.title, grant.organization, grant.dateRange)))
  }

  if (leftChildren.length > 0 || rightChildren.length > 0) {
    const grid = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: leftChildren.length > 0 ? leftChildren : [new Paragraph({ children: [] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: ALL_NO_BORDERS,
              margins: { right: 400 },
            }),
            new TableCell({
              children: rightChildren.length > 0 ? rightChildren : [new Paragraph({ children: [] })],
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: ALL_NO_BORDERS,
            }),
          ],
        }),
      ],
    })
    children.push(grid)
  }

  // ── Publications — full width ──────────────────────────────────────────────
  if (pubs.length > 0) {
    children.push(sectionTitle('Selected Publications'))
    pubs.slice(0, 8).forEach(pub => {
      children.push(new Paragraph({
        children: [
          ...(pub.authors.length > 0 ? [new TextRun({ text: `${pub.authors.join(', ')} `, color: DARK, size: 18 })] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: DARK, size: 18 })] : []),
          new TextRun({ text: pub.title, bold: true, color: DARK, size: 18 }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: DARK, size: 18 })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: DARK, size: 18 })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: DARK, size: 18 })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: DARK, size: 18 })] : []),
          ...(pub.doi ? [new TextRun({ text: `. DOI: ${pub.doi}`, color: DARK, size: 18 })] : []),
        ],
        spacing: { before: 80, after: 80 },
      }))
    })
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
      footers: { default: pageNumberFooter('000000') },
      children,
    }],
  })
}
