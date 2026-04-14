# ORCID CV Generator

Generate beautiful, professional CVs directly from your ORCID profile — free, open-source, and 100% browser-based.

🌐 **Live app:** [orcidcv.kndev.org](https://orcidcv.kndev.org)

## Features

- 6 professionally designed templates (PDF + Word export for each)
- Fetches data directly from the ORCID public API — no account needed
- Select which sections and individual items to include
- Optional profile photo
- Dark mode with system-preference default
- No data stored — everything runs in your browser

## How to Use

1. Enter your ORCID iD
2. Choose which sections to include
3. Customize individual items
4. Pick a template and optionally upload a photo
5. Preview and download as PDF or Word (.docx)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages (auto-commits and pushes main first)
npm run deploy
```

## Contributing a Template

Adding a template requires two files (PDF + Word) and two one-line registrations. The full guide is in the app at [/contribute](https://orcidcv.kndev.org/#/contribute), but here is the short version:

### 1. Create the PDF template

```jsx
// src/templates/pdf/MyTemplatePDF.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation,
         normalizePublications, normalizeFunding } from '../shared/cvData'

function MyTemplatePDF({ data }) {
  const { personal, employment, education, publications, funding } = data
  // ... render your layout
}

export default MyTemplatePDF
```

Register it in `src/templates/pdf/index.js`:

```js
export const pdfTemplates = {
  // ...existing templates
  'my-template': MyTemplatePDF,
}
```

### 2. Create the Word template

```js
// src/templates/word/MyTemplateWord.js
import { Document, Paragraph, TextRun } from 'docx'
import { normalizeEmployment, normalizePublications } from '../shared/cvData'

export function buildMyTemplateWord(data) {
  // ... build and return a docx Document
}
```

Register it in `src/templates/word/index.js`:

```js
export const wordTemplates = {
  // ...existing templates
  'my-template': buildMyTemplateWord,
}
```

### 3. Add metadata and a preview image

```js
// src/templates/index.js
export const templates = {
  // ...existing templates
  'my-template': {
    name: 'My Template',
    description: 'A short description',
    emoji: '🎯',
    previewImage: 'template-previews/my-template.svg',
    creator: {
      slug: 'your-github-handle',
      name: 'Your Name',
      url: 'https://github.com/your-github-handle',
    },
  },
}
```

Generate the preview image by downloading a PDF from the app and converting it with [PDF24 PDF-to-SVG](https://tools.pdf24.org/en/pdf-to-svg). Save the first page SVG to `public/template-previews/my-template.svg`.

### 4. Add yourself to the contributors registry

```js
// src/templates/index.js
export const contributors = {
  // ...existing contributors
  'your-github-handle': {
    slug: 'your-github-handle',
    displayName: 'Your Name',
    github: 'your-github-handle',
    url: 'https://github.com/your-github-handle',
    bio: 'A short bio.',
  },
}
```

Then open a pull request — include a screenshot of the PDF output in the description.

### Shared data helpers

Import from `src/templates/shared/cvData.js` for consistently normalised data:

```js
import {
  normalizeEmployment,   // → [{ title, organization, department, dateRange }]
  normalizeEducation,    // → [{ title, organization, department, dateRange }]
  normalizePublications, // → [{ number, title, journal, year, authors, volume, issue, pages, doi }]
  normalizeFunding,      // → [{ title, organization, dateRange }]
  buildTimelineItems,    // → sorted combined employment + education
} from '../shared/cvData'
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- @react-pdf/renderer (PDF generation)
- docx (Word generation)
- ORCID Public API + OpenAlex API

## License

MIT
