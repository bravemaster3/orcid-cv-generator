import {
  Document, Paragraph, TextRun, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, ExternalHyperlink,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { ALL_NO_BORDERS, RIGHT_TAB, photoRun, pageNumberFooter } from './helpers'

const FONT  = 'Calibri'
const RED   = 'CC0000'
const DARK  = '1A1A1A'
const MID   = '555555'
const LIGHT = '999999'
const RULE  = 'D4D4D4'

// ── Helpers ──────────────────────────────────────────────────────────────────

// Section header paragraph: "EXPERIENCE" in red with a thin gray rule above
function sectionHeader(text) {
  return new Paragraph({
    children: [new TextRun({
      text: text.toUpperCase(),
      bold: true,
      color: RED,
      size: 15,          // 7.5pt
      font: FONT,
      characterSpacing: 40,
    })],
    spacing: { before: 320, after: 120 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: RULE },
    },
  })
}

// Job / education / grant entry
function itemBlock(title, org, dateRange, dept) {
  const rows = [
    new Paragraph({
      children: [
        new TextRun({ text: title, bold: true, color: DARK, size: 20, font: FONT }),
        new TextRun({ text: '\t' }),
        new TextRun({ text: dateRange, color: LIGHT, size: 16, italics: true, font: FONT }),
      ],
      tabStops: [RIGHT_TAB],
      spacing: { before: 80, after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: org, color: MID, size: 18, font: FONT })],
      spacing: { after: dept ? 20 : 80 },
    }),
  ]
  if (dept) {
    rows.push(new Paragraph({
      children: [new TextRun({ text: dept, color: LIGHT, size: 16, font: FONT })],
      spacing: { after: 80 },
    }))
  }
  return rows
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildSwissMinimalWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // ── Red accent bar (thin shaded table row at the very top) ─────────────────
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
    rows: [new TableRow({
      height: { value: 140, rule: 'exact' },
      children: [new TableCell({
        children: [new Paragraph({ children: [] })],
        shading: { type: ShadingType.SOLID, color: RED, fill: RED },
        borders: ALL_NO_BORDERS,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      })],
    })],
  }))

  // ── Header: name / email / bio / keywords | photo ─────────────────────────
  const leftHeaderChildren = [
    new Paragraph({
      children: [new TextRun({
        text: personal?.fullName || '',
        color: DARK,
        size: 60,          // 30pt, deliberately not bold — Swiss weight
        font: FONT,
      })],
      spacing: { before: 160, after: 100 },
    }),
  ]

  if (personal?.emails?.length > 0) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: MID, size: 18, font: FONT })],
      spacing: { after: 140 },
    }))
  }

  if (personal?.biography) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: DARK, size: 19, font: FONT })],
      spacing: { after: 120 },
    }))
  }

  if (personal?.keywords?.length > 0) {
    leftHeaderChildren.push(new Paragraph({
      children: [new TextRun({
        text: personal.keywords.join('  ·  '),
        color: RED,
        size: 15,
        font: FONT,
        characterSpacing: 24,
      })],
      spacing: { after: 160 },
    }))
  }

  if (photoData) {
    const run = photoRun(photoData, 28, 28)
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: [new TableRow({
        children: [
          new TableCell({
            children: leftHeaderChildren,
            width: { size: 78, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
          }),
          new TableCell({
            children: [new Paragraph({ children: run ? [run] : [], spacing: { before: 160 } })],
            width: { size: 22, type: WidthType.PERCENTAGE },
            borders: ALL_NO_BORDERS,
            margins: { left: 300 },
          }),
        ],
      })],
    }))
  } else {
    children.push(...leftHeaderChildren)
  }

  // ── Red divider rule between header and body ───────────────────────────────
  children.push(new Paragraph({
    children: [],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: RED },
    },
    spacing: { before: 0, after: 280 },
  }))

  // ── Experience ─────────────────────────────────────────────────────────────
  if (jobs.length > 0) {
    children.push(sectionHeader('Experience'))
    jobs.forEach(job => children.push(...itemBlock(job.title, job.organization, job.dateRange, job.department)))
  }

  // ── Education ──────────────────────────────────────────────────────────────
  if (edus.length > 0) {
    children.push(sectionHeader('Education'))
    edus.forEach(edu => children.push(...itemBlock(edu.title, edu.organization, edu.dateRange, edu.department)))
  }

  // ── Grants & Funding ───────────────────────────────────────────────────────
  if (grants.length > 0) {
    children.push(sectionHeader('Grants & Funding'))
    grants.forEach(grant => children.push(...itemBlock(grant.title, grant.organization, grant.dateRange, null)))
  }

  // ── Publications ───────────────────────────────────────────────────────────
  if (pubs.length > 0) {
    children.push(sectionHeader('Publications'))
    pubs.forEach(pub => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${pub.number}.  `, color: LIGHT, size: 17, font: FONT }),
          ...(pub.authors.length > 0 ? [
            ...formatAuthors(pub.authors, personal?.fullName).map(seg =>
              new TextRun({ text: seg.text, bold: seg.bold, color: DARK, size: 17, font: FONT })
            ),
            new TextRun({ text: ' ', size: 17, font: FONT }),
          ] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, color: DARK, size: 17, font: FONT })] : []),
          new TextRun({ text: pub.title, bold: true, color: DARK, size: 17, font: FONT }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, color: MID, size: 17, font: FONT })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, color: DARK, size: 17, font: FONT })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, color: DARK, size: 17, font: FONT })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, color: DARK, size: 17, font: FONT })] : []),
          ...(pub.doi ? [new ExternalHyperlink({
            link: `https://doi.org/${pub.doi}`,
            children: [new TextRun({ text: ` https://doi.org/${pub.doi}`, size: 17, font: FONT, color: '0563C1', underline: {} })],
          })] : []),
        ],
        indent: { left: 320, hanging: 320 },
        spacing: { before: 80, after: 80 },
      }))
    })
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 560, bottom: 720, left: 1000, right: 1000 } } },
      footers: { default: pageNumberFooter('999999') },
      children,
    }],
  })
}
