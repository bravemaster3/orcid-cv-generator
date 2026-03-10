import { Link } from 'react-router-dom'
import { ArrowRight, Search, ToggleLeft, Edit3, Layout, Download, Shield } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Enter your ORCID ID',
    description: 'Paste your 16-digit ORCID iD (e.g. 0000-0002-1234-5678). The app fetches your public profile data directly from ORCID\'s API.',
    tip: 'Your ORCID iD is on your ORCID profile page and in most academic publications.',
  },
  {
    icon: ToggleLeft,
    title: 'Choose your sections',
    description: 'Select which sections to include: personal info, employment, education, publications, and funding. Toggle any section on or off.',
    tip: 'You can always go back and change your selection.',
  },
  {
    icon: Edit3,
    title: 'Customize your items',
    description: 'Within each section, choose exactly which items to include. Remove outdated roles, irrelevant publications, or anything you\'d rather not show.',
    tip: 'Use "Select All" or "Deselect All" to quickly manage large lists.',
  },
  {
    icon: Layout,
    title: 'Pick a template',
    description: 'Choose from 8 professionally designed templates ranging from classic academic to modern minimal. Optionally upload a profile photo.',
    tip: 'Not sure which to pick? Try the Academic Classic for research roles, or Executive for industry.',
  },
  {
    icon: Download,
    title: 'Download your CV',
    description: 'Preview your CV and download it as a PDF or a Word document (.docx). Both formats are generated from the same data — no re-entry needed.',
    tip: 'The Word version lets you make final tweaks before sending.',
  },
]

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From your ORCID profile to a polished CV in under two minutes — no account, no upload, no data stored.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Privacy callout */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-10 flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">100% private</p>
              <p className="text-sm text-green-700">
                All processing happens in your browser. Your ORCID data is fetched directly from ORCID's public API and never sent to any server.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-700" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">Step {idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <p className="text-sm text-primary-700 bg-primary-50 rounded-lg px-3 py-2">
                      💡 {step.tip}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage
