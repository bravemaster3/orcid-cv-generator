import {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ExternalHyperlink,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const FONT  = 'Calibri'
const DARK  = '0f172a'
const MID   = '475569'
const LIGHT = '64748b'
const BLUE  = '3b82f6'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: '1e293b', size: 28, font: FONT, characterSpacing: 20 })],
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.THICK, size: 12, color: BLUE } },
  })
}

function itemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, color: DARK, size: 24, font: FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, color: LIGHT, size: 20, italics: true, font: FONT }),
    ],
    tabStops: [RIGHT_TAB],
    spacing: { before: 140, after: 40 },
  })
}

export function buildProfessionalWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // Large name
  children.push(new Paragraph({
    children: [new TextRun({ text: personal?.fullName || '', bold: true, color: DARK, size: 64, font: FONT })],
    spacing: { after: 100 },
  }))

  // Header row: photo | info
  const infoChildren = []
  if (personal?.emails?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: MID, size: 20, font: FONT })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.biography) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: MID, size: 20, font: FONT })],
      spacing: { after: 60 },
    }))
  }
  if (personal?.keywords?.length > 0) {
    infoChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: MID, size: 18, font: FONT })],
      spacing: { after: 60 },
    }))
  }
  if (infoChildren.length === 0) infoChildren.push(new Paragraph({ children: [] }))

  if (photoData) {
    const photoCell = new TableCell({
      children: [new Paragraph({ children: [photoRun(photoData, 28, 28)] })],
      width: { size: 18, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      margins: { right: 200 },
    })
    const infoCell = new TableCell({
      children: infoChildren,
      width: { size: 82, type: WidthType.PERCENTAGE },
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

  // Blue divider
  children.push(new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.THICK, size: 16, color: BLUE } },
    spacing: { before: 80, after: 200 },
  }))

  // Experience
  if (jobs.length > 0) {
    children.push(sectionTitle('Experience'))
    jobs.forEach(job => {
      children.push(itemRow(job.title, job.dateRange))
      children.push(new Paragraph({ children: [new TextRun({ text: job.organization, color: MID, size: 20, font: FONT })], spacing: { after: 40 } }))
      if (job.department) children.push(new Paragraph({ children: [new TextRun({ text: job.department, color: LIGHT, size: 18, font: FONT })], spacing: { after: 80 } }))
    })
  }

  // Education
  if (edus.length > 0) {
    children.push(sectionTitle('Education'))
    edus.forEach(edu => {
      children.push(itemRow(edu.title, edu.dateRange))
      children.push(new Paragraph({ children: [new TextRun({ text: edu.organization, color: MID, size: 20, font: FONT })], spacing: { after: 40 } }))
      if (edu.department) children.push(new Paragraph({ children: [new TextRun({ text: edu.department, color: LIGHT, size: 18, font: FONT })], spacing: { after: 80 } }))
    })
  }

  // Publications
  if (pubs.length > 0) {
    children.push(sectionTitle('Publications'))
    pubs.forEach(pub => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${pub.number}.  `, color: '94a3b8', size: 20, font: FONT }),
          ...(pub.authors.length > 0 ? [
            ...formatAuthors(pub.authors, personal?.fullName).map(seg => new TextRun({ text: seg.text, bold: seg.bold, color: '1e293b', size: 20, font: FONT })),
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
        indent: { left: 400, hanging: 300 },
        spacing: { before: 100, after: 80 },
      }))
    })
  }

  // Funding
  if (grants.length > 0) {
    children.push(sectionTitle('Grants & Funding'))
    grants.forEach(grant => {
      children.push(itemRow(grant.title, grant.dateRange))
      children.push(new Paragraph({ children: [new TextRun({ text: grant.organization, color: MID, size: 20, font: FONT })], spacing: { after: 80 } }))
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
