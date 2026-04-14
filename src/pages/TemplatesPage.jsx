import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Github, Search, X } from 'lucide-react'
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
  const contributor = template.creator?.slug ? contributors[template.creator.slug] : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Preview image — lazy loaded, A4 ratio */}
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
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>

          {details.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {details.tags.map(tag => (
                <span key={tag} className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {details.bestFor && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span className="font-medium">Best for:</span> {details.bestFor}
            </p>
          )}

          {/* Contributor credit */}
          {template.creator && (
            <div className="flex items-center gap-2 mb-4">
              {contributor && (
                <img
                  src={`https://github.com/${contributor.github}.png?size=32`}
                  alt={template.creator.name}
                  className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600"
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500">
                By{' '}
                {contributor ? (
                  <Link
                    to={`/templates/contributor/${template.creator.slug}`}
                    className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    {template.creator.name}
                  </Link>
                ) : (
                  <a
                    href={template.creator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-0.5"
                  >
                    {template.creator.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
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
    </div>
  )
}

function TemplatesPage() {
  const allTemplates = Object.entries(templates)

  // Collect unique contributor slugs
  const uniqueContributors = [...new Set(
    allTemplates.map(([, t]) => t.creator?.slug).filter(Boolean)
  )]

  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = allTemplates.filter(([, t]) => {
    const matchesContributor = activeFilter === 'all' || t.creator?.slug === activeFilter
    const q = search.trim().toLowerCase()
    const matchesSearch = q === '' ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    return matchesContributor && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">CV Templates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-3">
            {allTemplates.length} professionally designed templates, each available as PDF and Word export.
          </p>
          <button
            onClick={() => document.getElementById('designers')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Meet the designers ↓
          </button>
        </div>

        <div className="max-w-5xl mx-auto mb-8 space-y-3">
          {/* Search — full width */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search templates…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Contributor filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Designer:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500'
              }`}
            >
              All ({allTemplates.length})
            </button>
            {uniqueContributors.map(slug => {
              const c = contributors[slug]
              const count = allTemplates.filter(([, t]) => t.creator?.slug === slug).length
              return (
                <button
                  key={slug}
                  onClick={() => setActiveFilter(slug)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === slug
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500'
                  }`}
                >
                  {c && (
                    <img
                      src={`https://github.com/${c.github}.png?size=20`}
                      alt={c.displayName}
                      className="w-4 h-4 rounded-full"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  )}
                  {c?.displayName || slug} ({count})
                </button>
              )
            })}
          </div>
          {/* Result count when filtering */}
          {(search.trim() || activeFilter !== 'all') && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} of {allTemplates.length} templates
              {search.trim() && <span> matching <span className="font-medium">"{search}"</span></span>}
            </p>
          )}
        </div>

        {/* Template grid */}
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-sm mb-2">No templates match <span className="font-medium">"{search}"</span></p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all') }}
                className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {filtered.map(([key, template]) => (
                <div key={key} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <TemplateCard templateKey={key} template={template} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contributor spotlight */}
        <div id="designers" className="max-w-5xl mx-auto mt-14 pt-10 border-t border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Template designers</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {uniqueContributors.map(slug => {
              const c = contributors[slug]
              if (!c) return null
              const count = allTemplates.filter(([, t]) => t.creator?.slug === slug).length
              return (
                <Link
                  key={slug}
                  to={`/templates/contributor/${slug}`}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                >
                  <img
                    src={`https://github.com/${c.github}.png?size=64`}
                    alt={c.displayName}
                    className="w-11 h-11 rounded-full border-2 border-primary-100 dark:border-primary-800"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{c.displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{count} template{count !== 1 ? 's' : ''}</p>
                  </div>
                  <Github className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-1" />
                </Link>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Want to add your own template?</p>
          <Link to="/contribute" className="btn-primary inline-flex items-center gap-2">
            Learn how to contribute <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage
