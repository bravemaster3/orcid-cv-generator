import { Github, FileText, File, Share2, CheckCircle, Image, User } from 'lucide-react'

function Code({ children }) {
  return (
    <code className="bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  )
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm font-mono overflow-x-auto leading-relaxed my-4">
      {children}
    </pre>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ContributePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contribute a Template</h1>
            <p className="text-lg text-gray-600">
              Adding a new template requires two files — one for PDF, one for Word — plus two one-line registrations.
              The shared data layer handles the rest.
            </p>
          </div>

          {/* Project structure */}
          <Section icon={FileText} title="Project Structure">
            <p className="text-gray-600 mb-3">The relevant files for templates are:</p>
            <CodeBlock>{`src/templates/
  shared/
    cvData.js          ← shared data normalizers (edit here to add fields)
  pdf/
    MyTemplatePDF.jsx  ← your new PDF template
    index.js           ← register it here
  word/
    MyTemplateWord.js  ← your new Word template
    index.js           ← register it here
src/templates/
  index.js             ← add metadata (name, description, emoji)`}</CodeBlock>
          </Section>

          {/* Shared data */}
          <Section icon={Share2} title="Shared Data Normalizers">
            <p className="text-gray-600 mb-3">
              Import from <Code>../shared/cvData</Code> to get consistently formatted data.
              If you need a new field, add it here and both PDF and Word templates get it automatically.
            </p>
            <CodeBlock>{`import {
  normalizeEmployment,   // → [{ title, organization, department, dateRange }]
  normalizeEducation,    // → [{ title, organization, department, dateRange }]
  normalizePublications, // → [{ number, title, journal, year, meta, fullCitation }]
  normalizeFunding,      // → [{ title, organization, dateRange }]
  buildTimelineItems,    // → sorted combined employment + education
} from '../shared/cvData'`}</CodeBlock>
          </Section>

          {/* PDF template */}
          <Section icon={File} title="Creating a PDF Template">
            <p className="text-gray-600 mb-3">
              PDF templates use <Code>@react-pdf/renderer</Code>. Create <Code>src/templates/pdf/MyTemplatePDF.jsx</Code>:
            </p>
            <CodeBlock>{`import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation,
         normalizePublications, normalizeFunding } from '../shared/cvData'

const styles = StyleSheet.create({
  page:         { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  name:         { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10,
                  borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4 },
  item:         { marginBottom: 12 },
})

function MyTemplatePDF({ data }) {
  const { personal, employment, education, publications, funding } = data
  const jobs  = normalizeEmployment(employment)
  const edus  = normalizeEducation(education)
  const pubs  = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{personal?.fullName}</Text>

        {jobs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {jobs.map((job, idx) => (
              <View key={idx} style={styles.item}>
                <Text>{job.title}</Text>
                <Text>{job.organization}  {job.dateRange}</Text>
              </View>
            ))}
          </View>
        )}
        {/* add more sections as needed */}
      </Page>
    </Document>
  )
}

export default MyTemplatePDF`}</CodeBlock>
            <p className="text-gray-600 mt-3">
              Then register it in <Code>src/templates/pdf/index.js</Code>:
            </p>
            <CodeBlock>{`import MyTemplatePDF from './MyTemplatePDF'

export const pdfTemplates = {
  // ...existing templates...
  'my-template': MyTemplatePDF,
}`}</CodeBlock>
          </Section>

          {/* Word template */}
          <Section icon={File} title="Creating a Word Template">
            <p className="text-gray-600 mb-3">
              Word templates use the <Code>docx</Code> library. Create <Code>src/templates/word/MyTemplateWord.js</Code>:
            </p>
            <CodeBlock>{`import { Document, Paragraph, TextRun, BorderStyle,
         TabStopType, TabStopPosition } from 'docx'
import { normalizeEmployment, normalizeEducation,
         normalizePublications, normalizeFunding } from '../shared/cvData'

export function buildMyTemplateWord(data) {
  const { personal, employment, education, publications, funding } = data
  const jobs  = normalizeEmployment(employment)
  const edus  = normalizeEducation(education)
  const pubs  = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const children = []

  // Name
  children.push(new Paragraph({
    children: [new TextRun({ text: personal?.fullName || '', bold: true, size: 48 })],
    spacing: { after: 120 },
  }))

  // Experience section
  if (jobs.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'EXPERIENCE', bold: true, size: 22 })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
      spacing: { before: 240, after: 120 },
    }))
    jobs.forEach(job => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: job.title, bold: true, size: 22 }),
          new TextRun({ text: '\\t' }),
          new TextRun({ text: job.dateRange, size: 18 }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: job.organization, size: 20 })],
        spacing: { after: 80 },
      }))
    })
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      children,
    }],
  })
}`}</CodeBlock>
            <p className="text-gray-600 mt-3">
              Then register it in <Code>src/templates/word/index.js</Code>:
            </p>
            <CodeBlock>{`import { buildMyTemplateWord } from './MyTemplateWord'

export const wordTemplates = {
  // ...existing templates...
  'my-template': buildMyTemplateWord,
}`}</CodeBlock>
          </Section>

          {/* Metadata */}
          <Section icon={CheckCircle} title="Add Template Metadata">
            <p className="text-gray-600 mb-3">
              Finally, add your template to <Code>src/templates/index.js</Code> so it appears in the template selector:
            </p>
            <CodeBlock>{`export const templates = {
  // ...existing templates...
  'my-template': {
    name: 'My Template',
    description: 'A short description of the style',
    emoji: '🎯',
    component: ModernMinimal, // a preview component (can reuse an existing one for now)
  },
}`}</CodeBlock>
            <p className="text-sm text-gray-500 mt-2">
              The key (<Code>'my-template'</Code>) must match across <Code>pdf/index.js</Code>, <Code>word/index.js</Code>, and <Code>templates/index.js</Code>.
            </p>
          </Section>

          {/* Preview image */}
          <Section icon={Image} title="Add a Preview Image">
            <p className="text-gray-600 mb-3">
              Include a preview image so users can see what your template looks like before choosing it.
              The image should show the first page of the PDF rendered with sample data.
            </p>
            <p className="text-gray-600 mb-3">
              <strong>How to generate it:</strong> Run the app locally with ORCID ID{' '}
              <Code>0000-0002-3305-174X</Code>, select your template, and take a screenshot of the PDF
              preview. Crop to the first page at A4 proportions (210 × 297 mm).
            </p>
            <p className="text-gray-600 mb-3">
              Save the image to <Code>public/template-previews/my-template.svg</Code> (SVG preferred)
              or <Code>.png</Code> / <Code>.jpg</Code>. Then reference it in the metadata:
            </p>
            <CodeBlock>{`// src/templates/index.js
'my-template': {
  name: 'My Template',
  description: '...',
  emoji: '🎯',
  previewImage: 'template-previews/my-template.svg', // ← add this
  creator: { ... },
  component: ModernMinimal,
}`}</CodeBlock>
            <p className="text-sm text-gray-500">
              If no preview image is provided, the template card will show the emoji as a fallback.
            </p>
          </Section>

          {/* Creator */}
          <Section icon={User} title="Add Your Name as Creator">
            <p className="text-gray-600 mb-3">
              Add a <Code>creator</Code> field to the template metadata so your contribution is credited
              on the Templates page and in the project.
            </p>
            <CodeBlock>{`// src/templates/index.js
'my-template': {
  name: 'My Template',
  description: '...',
  emoji: '🎯',
  previewImage: 'template-previews/my-template.svg',
  creator: {
    name: 'Your Name',          // displayed on the template card
    url: 'https://github.com/yourhandle', // linked from your name
  },
  component: ModernMinimal,
}`}</CodeBlock>
          </Section>

          {/* Submit */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Ready to submit?</h3>
              <p className="text-sm text-gray-700">
                Fork the repo, add your template, and open a pull request. Include a screenshot of the PDF output in the PR description.
              </p>
            </div>
            <a
              href="https://github.com/bravemaster3/orcid-cv-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Github className="w-4 h-4" />
              Open on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContributePage
