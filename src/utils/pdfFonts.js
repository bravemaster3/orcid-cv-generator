import { Font } from '@react-pdf/renderer'

let registered = false

/**
 * Register Unicode-capable fonts for react-pdf.
 *
 * DejaVu Sans  — metric-compatible with Vera Sans, excellent Unicode coverage
 *                (Polish Ł, Slovenian č/š/ž, and thousands more glyphs)
 * DejaVu Serif — serif companion with the same broad Unicode coverage
 *
 * Both fonts are served from jsDelivr npm CDN (cdn.jsdelivr.net/npm/)
 * using the dejavu-fonts-ttf@2.37.3 package — confirmed reliable.
 */
export function registerPdfFonts() {
  if (registered) return
  registered = true

  const BASE = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf'

  Font.register({
    family: 'DejaVu Sans',
    fonts: [
      { src: `${BASE}/DejaVuSans.ttf` },
      { src: `${BASE}/DejaVuSans-Bold.ttf`,        fontWeight: 'bold' },
      { src: `${BASE}/DejaVuSans-Oblique.ttf`,     fontStyle: 'italic' },
      { src: `${BASE}/DejaVuSans-BoldOblique.ttf`, fontWeight: 'bold', fontStyle: 'italic' },
    ],
  })

  Font.register({
    family: 'DejaVu Serif',
    fonts: [
      { src: `${BASE}/DejaVuSerif.ttf` },
      { src: `${BASE}/DejaVuSerif-Bold.ttf`,        fontWeight: 'bold' },
      { src: `${BASE}/DejaVuSerif-Italic.ttf`,      fontStyle: 'italic' },
      { src: `${BASE}/DejaVuSerif-BoldItalic.ttf`,  fontWeight: 'bold', fontStyle: 'italic' },
    ],
  })
}
