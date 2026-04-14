import { useParams, Link, useNavigate } from 'react-router-dom'
import { Github, ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react'
import { templates, contributors } from '../templates'

const templateDetails = {
  'modern-minimal':   { tags: ['Single column', 'Clean', 'Modern'],           bestFor: 'Industry & tech roles' },
  'academic-classic': { tags: ['Single column', 'Formal', 'Serif'],           bestFor: 'Academic & research positions' },
  'professional':     { tags: ['Single column', 'Blue accent', 'Corporate'],  bestFor: 'Business & management' },
  'executive':        { tags: ['Two column', 'Dark sidebar', 'Bold'],         bestFor: 'Senior & executive roles' },
  'timeline':         { tags: ['Timeline layout', 'Chronological', 'Visual'], bestFor: 'Career-focused CVs' },
  'swiss-minimal':    { tags: ['Ultra minimal', 'Typography', 'Grid'],        bestFor: 'Design & architecture' },
}

function TemplateCard({ templateKey, template }) {
  const details = templateDetails[templateKey] || {}
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700" style={{ aspectRatio: '210/297' }}>
        {template.previewImage ? (
          <img
            src={template.previewImage}
            alt={`${template.name} template preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ display: template.previewImage ? 'none' : 'flex' }}
        >
          {template.emoji}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
        {details.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {details.tags.map(tag => (
              <span key={tag} className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        {details.bestFor && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-medium">Best for:</span> {details.bestFor}
          </p>
        )}
        <div className="mt-auto">
          <Link
            to={`/?template=${templateKey}`}
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
          >
            Use this template <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function ContributorPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const contributor = contributors[slug]

  if (!contributor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contributor not found</h1>
          <Link to="/templates" className="text-primary-600 dark:text-primary-400 hover:underline">Back to templates</Link>
        </div>
      </div>
    )
  }

  const contributorTemplates = Object.entries(templates).filter(
    ([, t]) => t.creator?.slug === slug
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All templates
          </button>

          {/* Contributor profile card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={`https://github.com/${contributor.github}.png?size=128`}
                alt={contributor.displayName}
                className="w-24 h-24 rounded-full border-4 border-primary-100 dark:border-primary-800 flex-shrink-0"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{contributor.displayName}</h1>
                  <a
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    @{contributor.github}
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl">{contributor.bio}</p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </a>
                  {contributor.projectUrl && (
                    <a
                      href={contributor.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Their templates */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Templates by {contributor.displayName}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({contributorTemplates.length})</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {contributorTemplates.map(([key, template]) => (
              <div key={key} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]">
                <TemplateCard templateKey={key} template={template} />
              </div>
            ))}
          </div>

          {/* Invite others to contribute */}
          <div className="mt-12 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Want your templates listed here?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Contribute a PDF + Word template pair and get your own contributor page.
              </p>
            </div>
            <Link to="/contribute" className="btn-primary whitespace-nowrap flex items-center gap-2">
              Contribution guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContributorPage
