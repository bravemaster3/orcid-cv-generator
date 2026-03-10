import {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType,
} from 'docx'
import { buildTimelineItems, normalizePublications, normalizeFunding } from '../shared/cvData'
import { ALL_NO_BORDERS, photoParagraph, pageNumberFooter } from './helpers'

const INDIGO = '6366f1'
const DARK   = '1e293b'
const MID    = '475569'
const LIGHT  = '64748b'

const noBorderRight = { style: BorderStyle.THICK, size: 8, color: 'e2e8f0' }
const noBorder      = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 24 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 280, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'e2e8f0' } },
  })
}

function timelineRow(dateRange, title, org, dept) {
  const dateCell = new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: dateRange, bold: true, color: LIGHT, size: 18 })],
      alignment: AlignmentType.RIGHT,
    })],
    width: { size: 25, type: WidthType.PERCENTAGE },
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorderRight },
  })

  const contentChildren = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: DARK, size: 22 })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: org, color: INDIGO, size: 20 })],
      spacing: { after: 40 },
    }),
  ]
  if (dept) {
    contentChildren.push(new Paragraph({
      children: [new TextRun({ text: dept, color: LIGHT, size: 18 })],
      spacing: { after: 40 },
    }))
  }

  const contentCell = new TableCell({
    children: contentChildren,
    width: { size: 75, type: WidthType.PERCENTAGE },
    borders: ALL_NO_BORDERS,
    margins: { left: 200 },
  })

  return new TableRow({ children: [dateCell, contentCell] })
}

export function buildTimelineWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const timelineItems = buildTimelineItems(employment, education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // ── Centered header ────────────────────────────────────────────────────────
  if (photoData) {
    const p = photoParagraph(photoData, 36, 36, AlignmentType.CENTER, { after: 120 })
    if (p) children.push(p)
  }

  children.push(new Paragraph({
    children: [new TextRun({ text: personal?.fullName || '', bold: true, color: DARK, size: 44 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
  }))

  if (personal?.emails?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], color: LIGHT, size: 20 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }))
  }

  if (personal?.biography) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, color: MID, size: 20 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }))
  }

  if (personal?.keywords?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join('  ·  '), color: INDIGO, size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }))
  }

  // ── Career Timeline ────────────────────────────────────────────────────────
  if (timelineItems.length > 0) {
    children.push(sectionTitle('Career Timeline'))
    const timelineTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: ALL_NO_BORDERS,
      rows: timelineItems.map(item =>
        timelineRow(item.dateRange, item.title, item.organization, item.department)
      ),
    })
    children.push(timelineTable)
  }

  // ── Publications ───────────────────────────────────────────────────────────
  if (pubs.length > 0) {
    children.push(sectionTitle('Selected Publications'))
    pubs.slice(0, 10).forEach(pub => {
      children.push(new Paragraph({
        children: [new TextRun({ text: pub.title, color: DARK, size: 20 })],
        border: { left: { style: BorderStyle.THICK, size: 8, color: 'e2e8f0' } },
        indent: { left: 120 },
        spacing: { before: 80, after: 40 },
      }))
      if (pub.journal) {
        children.push(new Paragraph({
          children: [new TextRun({ text: pub.journal, color: INDIGO, italics: true, size: 18 })],
          indent: { left: 120 },
          spacing: { after: 40 },
        }))
      }
      if (pub.meta) {
        children.push(new Paragraph({
          children: [new TextRun({ text: pub.meta, color: LIGHT, size: 18 })],
          indent: { left: 120 },
          spacing: { after: 60 },
        }))
      }
    })
  }

  // ── Funding ────────────────────────────────────────────────────────────────
  if (grants.length > 0) {
    children.push(sectionTitle('Grants & Funding'))
    grants.forEach(grant => {
      children.push(new Paragraph({
        children: [new TextRun({ text: grant.title, bold: true, color: DARK, size: 20 })],
        border: { left: { style: BorderStyle.THICK, size: 8, color: 'e2e8f0' } },
        indent: { left: 120 },
        spacing: { before: 80, after: 40 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: grant.organization, color: INDIGO, size: 18 })],
        indent: { left: 120 },
        spacing: { after: 40 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: grant.dateRange, color: LIGHT, size: 18 })],
        indent: { left: 120 },
        spacing: { after: 80 },
      }))
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
