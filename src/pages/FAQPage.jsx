import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    q: 'What is ORCID?',
    a: 'ORCID (Open Researcher and Contributor ID) is a non-profit organisation that provides a persistent digital identifier for researchers. It lets you connect your research activities and outputs in one place. You can create a free ORCID account at orcid.org.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'No. Everything runs entirely in your browser. Your ORCID data is fetched directly from the ORCID public API and is never sent to any server. When you close the tab, it\'s gone.',
  },
  {
    q: 'Do I need an ORCID account to use this?',
    a: 'You need an ORCID iD (which means you need an ORCID account), and your profile must be set to public. If your profile is private, the API will not return any data.',
  },
  {
    q: 'Can I use this for free?',
    a: 'Yes, completely free and open-source. No account required, no subscription, no watermarks.',
  },
  {
    q: 'What templates are available?',
    a: 'There are 8 templates: Modern Minimal, Academic Classic, Professional, Executive, Creative Designer, Compact Dense, Timeline, and Swiss Minimal. Each is available as both PDF and Word export.',
  },
  {
    q: 'Can I export to Word (.docx)?',
    a: 'Yes. Every template supports both PDF and Word export. The Word version is designed to visually match the PDF template while being fully editable.',
  },
  {
    q: 'Can I add a photo to my CV?',
    a: 'Yes. On the template selection step you can upload a profile photo. It will be embedded in the templates that support photos.',
  },
  {
    q: 'My ORCID data is incomplete — what can I do?',
    a: 'The app only shows what is publicly available on your ORCID profile. To include more, update your ORCID record at orcid.org and make sure the relevant sections are set to public visibility.',
  },
  {
    q: 'Can I pick which publications or jobs to include?',
    a: 'Yes. In the "Customize" step you can toggle individual items on or off within each section.',
  },
  {
    q: 'How do I contribute a new template?',
    a: null,
    link: { label: 'See the contribution guide', to: '/contribute' },
  },
]

function FAQItem({ q, a, link }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-gray-100">
          {a && <p className="text-gray-600 leading-relaxed pt-4">{a}</p>}
          {link && (
            <Link to={link.to} className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-medium pt-4">
              {link.label} →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Everything you need to know about the ORCID CV Generator.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} {...faq} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQPage
