import {
  Document, Paragraph, TextRun, AlignmentType, BorderStyle,
} from 'docx'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'
import { RIGHT_TAB, photoParagraph, pageNumberFooter } from './helpers'

const FONT = 'Times New Roman'

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: FONT })],
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
  })
}

function itemRow(title, dateRange) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: dateRange, size: 20, font: FONT }),
    ],
    tabStops: [RIGHT_TAB],
    indent: { left: 300 },
    spacing: { before: 100, after: 40 },
  })
}

export function buildAcademicClassicWord(data, photoData) {
  const { personal, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // Centered name with double-border underline
  children.push(new Paragraph({
    children: [new TextRun({ text: (personal?.fullName || '').toUpperCase(), bold: true, size: 42, font: FONT })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    border: { bottom: { style: BorderStyle.DOUBLE, size: 12, color: '000000' } },
  }))

  if (personal?.emails?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.emails[0], size: 22, font: FONT })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }))
  }

  // Photo centered below header
  if (photoData) {
    const p = photoParagraph(photoData, 32, 32, AlignmentType.CENTER, { after: 160 })
    if (p) children.push(p)
  }

  if (personal?.biography) {
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.biography, size: 22, font: FONT })],
      alignment: AlignmentType.BOTH,
      spacing: { after: 160 },
    }))
  }

  if (personal?.keywords?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'RESEARCH INTERESTS', bold: true, size: 22, font: FONT })],
      spacing: { before: 160, after: 80 },
    }))
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.keywords.join(' • '), size: 22, font: FONT })],
      spacing: { after: 160 },
    }))
  }

  // Education
  if (edus.length > 0) {
    children.push(sectionTitle('Education'))
    edus.forEach(edu => {
      children.push(itemRow(edu.title, edu.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: edu.organization, italics: true, size: 22, font: FONT })],
        indent: { left: 300 },
        spacing: { after: 40 },
      }))
      if (edu.department) {
        children.push(new Paragraph({
          children: [new TextRun({ text: edu.department, size: 20, font: FONT })],
          indent: { left: 300 },
          spacing: { after: 80 },
        }))
      }
    })
  }

  // Academic Appointments
  if (jobs.length > 0) {
    children.push(sectionTitle('Academic Appointments'))
    jobs.forEach(job => {
      children.push(itemRow(job.title, job.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: job.organization, italics: true, size: 22, font: FONT })],
        indent: { left: 300 },
        spacing: { after: 40 },
      }))
      if (job.department) {
        children.push(new Paragraph({
          children: [new TextRun({ text: job.department, size: 20, font: FONT })],
          indent: { left: 300 },
          spacing: { after: 80 },
        }))
      }
    })
  }

  // Numbered publications
  if (pubs.length > 0) {
    children.push(sectionTitle('Publications'))
    pubs.forEach(pub => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${pub.number}.  `, size: 20, font: FONT }),
          ...(pub.authors.length > 0 ? [new TextRun({ text: `${pub.authors.join(', ')} `, size: 20, font: FONT })] : []),
          ...(pub.year ? [new TextRun({ text: `(${pub.year}): `, size: 20, font: FONT })] : []),
          new TextRun({ text: pub.title, bold: true, size: 20, font: FONT }),
          ...(pub.journal ? [new TextRun({ text: `. ${pub.journal}`, italics: true, size: 20, font: FONT })] : []),
          ...(pub.volume ? [new TextRun({ text: `, ${pub.volume}`, size: 20, font: FONT })] : []),
          ...(pub.issue ? [new TextRun({ text: `(${pub.issue})`, size: 20, font: FONT })] : []),
          ...(pub.pages ? [new TextRun({ text: `, ${pub.pages}`, size: 20, font: FONT })] : []),
          ...(pub.doi ? [new TextRun({ text: `. DOI: ${pub.doi}`, size: 20, font: FONT })] : []),
        ],
        indent: { left: 300, hanging: 300 },
        spacing: { before: 80, after: 80 },
      }))
    })
  }

  // Funding
  if (grants.length > 0) {
    children.push(sectionTitle('Grants & Funding'))
    grants.forEach(grant => {
      children.push(itemRow(grant.title, grant.dateRange))
      children.push(new Paragraph({
        children: [new TextRun({ text: grant.organization, italics: true, size: 22, font: FONT })],
        indent: { left: 300 },
        spacing: { after: 80 },
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
