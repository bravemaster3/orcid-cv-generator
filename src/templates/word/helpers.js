import {
  BorderStyle, Footer, ImageRun, Paragraph, TextRun,
  PageNumber, AlignmentType, TabStopType, TabStopPosition,
} from 'docx'

/** Convert millimetres to pixels (docx v9 ImageRun transformation uses pixels, which it converts to EMU internally at 9525 EMU/px) */
export const mm = v => Math.round(v * 96 / 25.4)

/** Convert mm to twips (used for margins / table widths in some contexts) */
export const mmTwip = v => Math.round(v * 56.69)

/** A reusable "no border" style for layout tables */
export const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
export const ALL_NO_BORDERS = {
  top: NO_BORDER, bottom: NO_BORDER,
  left: NO_BORDER, right: NO_BORDER,
  insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
}

/** Right-aligning tab stop at the page edge */
export const RIGHT_TAB = { type: TabStopType.RIGHT, position: TabStopPosition.MAX }

/**
 * Build an ImageRun from preprocessed photo data.
 * @param {object|null} photoData  - { data: Uint8Array, type: string }
 * @param {number} widthMm        - desired width in mm
 * @param {number} heightMm       - desired height in mm
 */
export function photoRun(photoData, widthMm, heightMm) {
  if (!photoData) return null
  return new ImageRun({
    data: photoData.data,
    transformation: { width: mm(widthMm), height: mm(heightMm) },
    type: photoData.type,
  })
}

/** Wrap an ImageRun in a centred paragraph (or left-aligned) */
export function photoParagraph(photoData, widthMm, heightMm, alignment = 'left', spacing = {}) {
  const run = photoRun(photoData, widthMm, heightMm)
  if (!run) return null
  return new Paragraph({ children: [run], alignment, spacing })
}

/** Centered "Page X / Y" footer paragraph */
export function pageNumberFooter(color = '64748b') {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ children: [PageNumber.CURRENT], color, size: 18 }),
          new TextRun({ text: ' / ', color, size: 18 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color, size: 18 }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  })
}
