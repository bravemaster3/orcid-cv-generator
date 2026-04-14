import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { templates } from '../../templates'

function TemplateCard({ templateKey, template, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(templateKey)}
      className={`text-left border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg w-full ${
        selected
          ? 'border-primary-500 shadow-md ring-2 ring-primary-200 dark:ring-primary-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Preview image — A4 ratio */}
      <div className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden" style={{ aspectRatio: '210/297' }}>
        {template.previewImage ? (
          <img
            src={template.previewImage}
            alt={`${template.name} preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"
          style={{ display: template.previewImage ? 'none' : 'flex' }}
        >
          {template.emoji}
        </div>
        {selected && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Selected
          </div>
        )}
      </div>

      {/* Name + description */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{template.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{template.description}</p>
      </div>
    </button>
  )
}

function TemplateGrid({ selectedTemplate, onSelectTemplate }) {
  const [search, setSearch] = useState('')
  const templatesArray = Object.entries(templates)

  const filtered = search.trim() === ''
    ? templatesArray
    : templatesArray.filter(([, t]) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      )

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Choose a Template</h3>
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
        {search.trim()
          ? `${filtered.length} of ${templatesArray.length} templates`
          : `${templatesArray.length} templates — select a design that fits your style`}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-sm">No templates match <span className="font-medium">"{search}"</span></p>
          <button onClick={() => setSearch('')} className="mt-2 text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map(([key, template]) => (
            <TemplateCard
              key={key}
              templateKey={key}
              template={template}
              selected={selectedTemplate === key}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateGrid
