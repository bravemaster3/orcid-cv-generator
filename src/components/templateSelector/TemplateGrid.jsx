import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { templates } from '../../templates'

function TemplateGrid({ selectedTemplate, onSelectTemplate }) {
  const [startIndex, setStartIndex] = useState(0)
  const templatesArray = Object.entries(templates)
  const visibleCount = 3
  const maxIndex = Math.max(0, templatesArray.length - visibleCount)

  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const visibleTemplates = templatesArray.slice(startIndex, startIndex + visibleCount)

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Choose a Template
      </h3>
      <p className="text-gray-600 mb-6">
        Select a design that best represents your professional style
      </p>

      <div className="relative">
        {/* Left Arrow */}
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
            aria-label="Previous templates"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTemplates.map(([key, template]) => (
            <button
              key={key}
              onClick={() => onSelectTemplate(key)}
              className={`text-left border-2 rounded-xl p-4 transition-all hover:shadow-lg ${
                selectedTemplate === key
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-6xl">{template.emoji}</div>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">
                {template.name}
              </h4>
              <p className="text-sm text-gray-600">
                {template.description}
              </p>
              {selectedTemplate === key && (
                <div className="mt-3 inline-block px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
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

      {/* Template counter */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(startIndex + visibleCount, templatesArray.length)} of {templatesArray.length} templates
      </div>
    </div>
  )
}

export default TemplateGrid