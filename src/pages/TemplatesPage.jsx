import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { templates } from '../templates'

const templateDetails = {
  'modern-minimal':    { tags: ['Single column', 'Clean', 'Modern'],           bestFor: 'Industry & tech roles' },
  'academic-classic':  { tags: ['Single column', 'Formal', 'Times New Roman'], bestFor: 'Academic & research positions' },
  'professional':      { tags: ['Single column', 'Blue accent', 'Corporate'],  bestFor: 'Business & management' },
  'executive':         { tags: ['Two column', 'Dark sidebar', 'Bold'],         bestFor: 'Senior & executive roles' },
  'creative-designer': { tags: ['Amber theme', 'Distinctive', 'Vibrant'],      bestFor: 'Creative & design fields' },
  'compact-dense':     { tags: ['Two column', 'Dense', 'Small font'],          bestFor: 'Information-heavy CVs' },
  'timeline':          { tags: ['Timeline layout', 'Chronological', 'Visual'], bestFor: 'Career-focused CVs' },
  'swiss-minimal':     { tags: ['Ultra minimal', 'Typography', 'Grid'],        bestFor: 'Design & architecture' },
}

function TemplateCard({ templateKey, template }) {
  const details = templateDetails[templateKey] || {}

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Preview image — lazy loaded, A4 ratio */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '210/297' }}>
        {template.previewImage ? (
          <img
            src={template.previewImage}
            alt={`${template.name} template preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        {/* Fallback shown if image fails or is missing */}
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ display: template.previewImage ? 'none' : 'flex' }}
        >
          {template.emoji}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>

        {details.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {details.tags.map(tag => (
              <span key={tag} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {details.bestFor && (
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-medium">Best for:</span> {details.bestFor}
          </p>
        )}

        {/* Creator attribution */}
        {template.creator && (
          <p className="text-xs text-gray-400 mb-4">
            By{' '}
            <a
              href={template.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-700 inline-flex items-center gap-0.5"
            >
              {template.creator.name}
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        )}

        <div className="mt-auto">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            Use this template <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CV Templates</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from {Object.keys(templates).length} professionally designed templates.
            Each is available as both PDF and Word export.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(templates).map(([key, template]) => (
            <TemplateCard key={key} templateKey={key} template={template} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Want to add your own template?</p>
          <Link to="/contribute" className="btn-primary inline-flex items-center gap-2">
            Learn how to contribute <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage
