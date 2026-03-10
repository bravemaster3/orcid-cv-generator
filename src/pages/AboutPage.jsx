import { Github, Coffee, Shield, Zap, Globe, Code } from 'lucide-react'
import { Link } from 'react-router-dom'

const techStack = [
  { name: 'React 18', description: 'UI framework' },
  { name: 'Tailwind CSS', description: 'Styling' },
  { name: 'Vite', description: 'Build tool' },
  { name: '@react-pdf/renderer', description: 'PDF generation' },
  { name: 'docx', description: 'Word generation' },
  { name: 'ORCID Public API', description: 'Data source' },
]

const features = [
  { icon: Shield, text: 'No data stored — everything runs in your browser' },
  { icon: Zap, text: 'Fast — generate a CV in under 2 minutes' },
  { icon: Globe, text: 'Free and open-source, MIT licensed' },
  { icon: Code, text: '8 templates, both PDF and Word export' },
]

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About</h1>
            <p className="text-lg text-gray-600">
              A free, open-source tool for turning ORCID profiles into professional CVs.
            </p>
          </div>

          {/* What is it */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What is ORCID CV Generator?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ORCID CV Generator is a browser-based tool that pulls your public profile from ORCID and
              lets you build a polished, formatted CV — without manual copy-pasting. Pick which sections
              and items to include, choose a template, and download as PDF or Word.
            </p>
            <p className="text-gray-600 leading-relaxed">
              It was built because maintaining a CV from an ORCID profile should not require buying
              expensive software or uploading your data to a third-party service.
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, text }, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-700" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {techStack.map(({ name, description }) => (
                <div key={name} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open source + contribute */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Open Source</h2>
            <p className="text-gray-600 mb-4">
              This project is open-source and MIT licensed. Contributions are welcome — whether that's
              a new template, a bug fix, or an improvement to the UI.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/bravemaster3/orcid-cv-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
              <Link to="/contribute" className="btn-outline flex items-center gap-2">
                Contribution Guide
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Enjoying this tool?</h3>
              <p className="text-sm text-gray-700">
                If the ORCID CV Generator has saved you time, consider buying a coffee to support development.
              </p>
            </div>
            <a
              href="https://buymeacoffee.com/bravemaster"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
            >
              <Coffee className="w-4 h-4" />
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
