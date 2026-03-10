import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { templates } from '../../templates'

function TemplateCard({ templateKey, template, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(templateKey)}
      className={`text-left border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg w-full ${
        selected
          ? 'border-primary-500 shadow-md ring-2 ring-primary-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Preview image — A4 ratio */}
      <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '210/297' }}>
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
          className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200"
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
      <div className="p-3 bg-white">
        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{template.name}</h4>
        <p className="text-xs text-gray-500 leading-snug">{template.description}</p>
      </div>
    </button>
  )
}

function TemplateGrid({ selectedTemplate, onSelectTemplate }) {
  const [startIndex, setStartIndex] = useState(0)
  const templatesArray = Object.entries(templates)
  const visibleCount = 3
  const maxIndex = Math.max(0, templatesArray.length - visibleCount)

  const handlePrev = () => setStartIndex(prev => Math.max(0, prev - 1))
  const handleNext = () => setStartIndex(prev => Math.min(maxIndex, prev + 1))

  const visibleTemplates = templatesArray.slice(startIndex, startIndex + visibleCount)

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Choose a Template</h3>
      <p className="text-gray-600 mb-6">Select a design that best represents your professional style</p>

      <div className="relative">
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
            aria-label="Previous templates"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTemplates.map(([key, template]) => (
            <TemplateCard
              key={key}
              templateKey={key}
              template={template}
              selected={selectedTemplate === key}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>

        {startIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
            aria-label="Next templates"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        Showing {startIndex + 1}–{Math.min(startIndex + visibleCount, templatesArray.length)} of {templatesArray.length} templates
      </div>
    </div>
  )
}

export default TemplateGrid
