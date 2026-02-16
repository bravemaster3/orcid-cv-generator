import { useState, useEffect } from 'react'
import { Download, ChevronLeft, RotateCcw, Coffee, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import { pdfTemplates } from '../templates/pdf'
import { generatePDF } from '../utils/pdfGenerator'
import { prepareDataForTemplate } from '../utils/dataTransformer'

function CVPreview({
  orcidData,
  selectedSections,
  selectedItems,
  template,
  profilePhoto,
  onBack,
  onReset
}) {
  const [generating, setGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(true)

  const cvData = prepareDataForTemplate(
    orcidData,
    selectedSections,
    selectedItems,
    profilePhoto
  )

  // Generate PDF preview only once when component mounts
  useEffect(() => {
    let cancelled = false

    const generatePreview = async () => {
      setLoadingPreview(true)
      try {
        const PDFTemplate = pdfTemplates[template]
        if (!PDFTemplate) {
          setLoadingPreview(false)
          return
        }

        // Create PDF element without JSX
        const doc = createElement(PDFTemplate, { data: cvData })
        const blob = await pdf(doc).toBlob()
        
        if (cancelled) return
        
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch (error) {
        console.error('Error generating preview:', error)
      } finally {
        if (!cancelled) {
          setLoadingPreview(false)
        }
      }
    }

    generatePreview()

    return () => {
      cancelled = true
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [template]) // Only regenerate if template changes, not on every data change

  const handleDownload = async () => {
    setGenerating(true)
    try {
      await generatePDF(cvData, template)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Your CV is Ready!
            </h2>
            <p className="text-gray-600">
              Preview and download your CV
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={generating || loadingPreview}
              className="btn-primary flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Coffee className="w-8 h-8 text-yellow-900" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Enjoying this tool?
            </h3>
            <p className="text-gray-700">
              If this CV generator helped you, consider buying me a coffee!
            </p>
          </div>
          <a
            href="https://buymeacoffee.com/bravemaster"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2 whitespace-nowrap"
          >
            <Coffee className="w-5 h-5" />
            Buy Me a Coffee
          </a>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            PDF Preview
          </h3>
          {loadingPreview && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating preview...
            </div>
          )}
        </div>
        
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {loadingPreview ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
              <p className="text-gray-600">Preparing your CV preview...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full bg-white"
              style={{ height: '800px' }}
              title="CV Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Failed to generate preview. Please try downloading instead.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Templates
        </button>
        <button onClick={onReset} className="btn-outline flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </div>
    </div>
  )
}

export default CVPreview