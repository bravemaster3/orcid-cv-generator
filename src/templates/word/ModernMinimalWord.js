import {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ExternalHyperlink,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const FONT  = 'Calibri'
const DARK  = '1f2937'
const MID   = '374151'
const LIGHT = '6b7280'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 28, font: FONT, characterSpacing: 20 })],
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: DARK } },
  })
}

function itemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: DARK, size: 24, font: FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: LIGHT, size: 20, font: FONT }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 140, after: 40 },
  })
}

function subLine(text, italic = false) {
  return new Paragraph({
    children: [new TextRun({ text, color: MID, size: 20, italics: italic, font: FONT })],
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
  const infoChildren = [
    new Paragraph({
      children: [new TextRun({ text: personal?.fullName || '', bold: true, color: DARK, size: 56, font: FONT })],
      spacing: { after: 80 },
    }),
  ]
  if (personal?.biography) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: MID, size: 20, font: FONT })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.emails?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: LIGHT, size: 20, font: FONT })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.keywords?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: LIGHT, size: 18, font: FONT })],
      spacing: { after: 60 },
    }))
  }

  const children = []

  if (photoData) {
    const photoCell = new TableCell({
      children: [new Paragraph({ children: [photoRun(photoData, 28, 28)] })],
      width: { size: 20, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      margins: { right: 200 },
    })
    const infoCell = new TableCell({
      children: infoChildren,
      width: { size: 80, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
    })
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [new TableRow({ children: [photoCell, infoCell] })],
    }))
  } else {
    children.push(...infoChildren)
  }

  // ── Divider ───────────────────────────────────────────────────────────────
  children.push(new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.THICK, size: 16, color: DARK } },
    spacing: { before: 80, after: 200 },
  }))

  // ── Body sections ─────────────────────────────────────────────────────────
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
          new TextRun({ text: `${pub.number}.  `, color: LIGHT, size: 20, font: FONT }),
          ...(pub.authors.length > 0 ? [
            ...formatAuthors(pub.authors, personal?.fullName).map(seg => new TextRun({ text: seg.text, bold: seg.bold, color: DARK, size: 20, font: FONT })),
            new TextRun({ text: ' ', size: 20, font: FONT }),
          ] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: DARK, size: 20, font: FONT })] : []),
          new TextRun({ text: pub.title, bold: true, color: DARK, size: 20, font: FONT }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: DARK, size: 20, font: FONT })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: DARK, size: 20, font: FONT })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: DARK, size: 20, font: FONT })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: DARK, size: 20, font: FONT })] : []),
          ...(pub.doi ? [new ExternalHyperlink({ link: `https://doi.org/${pub.doi}`, children: [new TextRun({ text: ` https://doi.org/${pub.doi}`, size: 20, font: FONT, color: '0563C1', underline: {} })] })] : []),
        ],
        indent: { left: 300, hanging: 300 },
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
