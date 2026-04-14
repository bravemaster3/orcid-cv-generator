import { useState, useEffect } from 'react'
import { Download, ChevronLeft, RotateCcw, Coffee, Loader2, FileText } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'
import { pdfTemplates } from '../templates/pdf'
import { generatePDF } from '../utils/pdfGenerator'
import { generateWord } from '../utils/wordGenerator'
import { prepareDataForTemplate } from '../utils/dataTransformer'
import PhotoUpload from './templateSelector/PhotoUpload'

function CVPreview({
  orcidData,
  selectedSections,
  selectedItems,
  template,
  profilePhoto,
  onPhotoUpload,
  photoEnabled,
  onPhotoEnableToggle,
  onBack,
  onReset
}) {
  const [generating, setGenerating] = useState(false)
  const [generatingWord, setGeneratingWord] = useState(false)
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
  }, [template, profilePhoto])

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

  const handleDownloadWord = async () => {
    setGeneratingWord(true)
    try {
      await generateWord(cvData, template)
    } catch (error) {
      console.error('Error generating Word document:', error)
      alert('Failed to generate Word document. Please try again.')
    } finally {
      setGeneratingWord(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Your CV is Ready!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preview and download your CV
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadWord}
              disabled={generatingWord || loadingPreview}
              className="btn-secondary flex items-center gap-2"
            >
              {generatingWord ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Download Word
                </>
              )}
            </button>
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

      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Coffee className="w-8 h-8 text-yellow-900" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Enjoying this tool?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
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

      <PhotoUpload
        profilePhoto={profilePhoto}
        onPhotoUpload={onPhotoUpload}
        photoEnabled={photoEnabled}
        onPhotoEnableToggle={onPhotoEnableToggle}
      />

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            PDF Preview
          </h3>
          {loadingPreview && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating preview...
            </div>
          )}
        </div>

        {/* Mobile: PDF iframes are unsupported on iOS and unreliable on Android */}
        <div className="md:hidden flex flex-col items-center justify-center py-12 gap-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
          {loadingPreview ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Preparing your CV…</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Your CV is ready</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                PDF preview is not supported on mobile. Use the download buttons to get your CV.
              </p>
            </>
          )}
        </div>

        {/* Desktop: full iframe preview */}
        <div className="hidden md:block border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
          {loadingPreview ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
              <p className="text-gray-600 dark:text-gray-400">Preparing your CV preview...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full bg-white"
              style={{ height: '800px' }}
              title="CV Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              Failed to generate preview. Please try downloading instead.
            </div>
          )}
        </div>
      </div>

      {/* Download buttons — repeated at the bottom so the user doesn't have to scroll back up */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleDownloadWord}
          disabled={generatingWord || loadingPreview}
          className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {generatingWord ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          {generatingWord ? 'Generating…' : 'Download Word'}
        </button>
        <button
          onClick={handleDownload}
          disabled={generating || loadingPreview}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {generating ? 'Generating…' : 'Download PDF'}
        </button>
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
