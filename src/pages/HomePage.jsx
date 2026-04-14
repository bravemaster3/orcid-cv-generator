import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import OrcidInput from '../components/OrcidInput'
import SectionSelector from '../components/SectionSelector'
import ItemEditor from '../components/ItemEditor'
import TemplateSelector from '../components/TemplateSelector'
import CVPreview from '../components/CVPreview'
import Stepper from '../components/Stepper'
import { fetchOrcidData } from '../utils/orcidApi'

const STEPS = [
  { id: 1, name: 'ORCID ID', description: 'Enter your ORCID' },
  { id: 2, name: 'Sections', description: 'Choose sections' },
  { id: 3, name: 'Customize', description: 'Edit items' },
  { id: 4, name: 'Template', description: 'Pick a style' },
  { id: 5, name: 'Preview', description: 'Review & download' },
]

const SESSION_KEY = 'orcidcv_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(state) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded (e.g. large photo) — fail silently
  }
}

function HomePage() {
  const [searchParams] = useSearchParams()
  const templateFromUrl = searchParams.get('template')

  // Restore previous session if available
  const saved = loadSession()

  const [currentStep, setCurrentStep] = useState(() => {
    // If user arrived via "Use this template" and already has data, jump to step 4
    if (templateFromUrl && saved?.orcidData) return 4
    return saved?.currentStep || 1
  })
  const [orcidId, setOrcidId] = useState(saved?.orcidId || '')
  const [orcidData, setOrcidData] = useState(saved?.orcidData || null)
  const [selectedSections, setSelectedSections] = useState(saved?.selectedSections || {})
  const [selectedItems, setSelectedItems] = useState(saved?.selectedItems || {})
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateFromUrl || saved?.selectedTemplate || 'modern-minimal'
  )
  const [profilePhoto, setProfilePhoto] = useState(saved?.profilePhoto || null)
  const [photoEnabled, setPhotoEnabled] = useState(saved?.photoEnabled || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Persist session whenever relevant state changes
  useEffect(() => {
    saveSession({
      currentStep,
      orcidId,
      orcidData,
      selectedSections,
      selectedItems,
      selectedTemplate,
      profilePhoto,
      photoEnabled,
    })
  }, [currentStep, orcidId, orcidData, selectedSections, selectedItems, selectedTemplate, profilePhoto, photoEnabled])

  const handleOrcidSubmit = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrcidData(id)
      setOrcidData(data)
      setOrcidId(id)

      const sections = {}
      const items = {}

      if (data.person) sections.personal = true
      if (data.employment?.length > 0) {
        sections.employment = true
        items.employment = data.employment.map((_, idx) => idx)
      }
      if (data.education?.length > 0) {
        sections.education = true
        items.education = data.education.map((_, idx) => idx)
      }
      if (data.works?.length > 0) {
        sections.publications = true
        items.publications = data.works.map((_, idx) => idx)
      }
      if (data.funding?.length > 0) {
        sections.funding = true
        items.funding = data.funding.map((_, idx) => idx)
      }

      setSelectedSections(sections)
      setSelectedItems(items)
      setCurrentStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleItemToggle = (section, itemIndex) => {
    setSelectedItems(prev => {
      const sectionItems = prev[section] || []
      const isSelected = sectionItems.includes(itemIndex)
      return {
        ...prev,
        [section]: isSelected
          ? sectionItems.filter(idx => idx !== itemIndex)
          : [...sectionItems, itemIndex],
      }
    })
  }

  const handleSelectAllItems = (section, indices) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: Array.isArray(indices) ? indices : Array.from({ length: indices }, (_, i) => i),
    }))
  }

  const handleDeselectAllItems = (section) => {
    setSelectedItems(prev => ({ ...prev, [section]: [] }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return orcidData !== null
      case 2: return Object.values(selectedSections).some(v => v)
      case 3: return true
      case 4: return selectedTemplate !== null
      default: return true
    }
  }

  const handleNext = () => {
    if (canProceed()) setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleReset = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setCurrentStep(1)
    setOrcidId('')
    setOrcidData(null)
    setSelectedSections({})
    setSelectedItems({})
    setSelectedTemplate('modern-minimal')
    setProfilePhoto(null)
    setPhotoEnabled(false)
    setError(null)
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ORCID CV Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create beautiful CVs from your ORCID profile
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Stepper steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 1 && (
              <OrcidInput onSubmit={handleOrcidSubmit} loading={loading} error={error} />
            )}
            {currentStep === 2 && orcidData && (
              <SectionSelector
                orcidData={orcidData}
                selectedSections={selectedSections}
                onToggle={handleSectionToggle}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && orcidData && (
              <ItemEditor
                orcidData={orcidData}
                selectedSections={selectedSections}
                selectedItems={selectedItems}
                onItemToggle={handleItemToggle}
                onSelectAll={handleSelectAllItems}
                onDeselectAll={handleDeselectAllItems}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                profilePhoto={profilePhoto}
                onPhotoUpload={(photo) => {
                  setProfilePhoto(photo)
                  if (photo) setPhotoEnabled(true)
                  else setPhotoEnabled(false)
                }}
                photoEnabled={photoEnabled}
                onPhotoEnableToggle={setPhotoEnabled}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && orcidData && (
              <CVPreview
                orcidData={orcidData}
                selectedSections={selectedSections}
                selectedItems={selectedItems}
                template={selectedTemplate}
                profilePhoto={photoEnabled ? profilePhoto : null}
                onPhotoUpload={(photo) => {
                  setProfilePhoto(photo)
                  if (photo) setPhotoEnabled(true)
                  else setPhotoEnabled(false)
                }}
                photoEnabled={photoEnabled}
                onPhotoEnableToggle={setPhotoEnabled}
                onBack={handleBack}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scroll-down hint */}
      <div className="flex justify-center pb-4 pt-2">
        <div className="animate-bounce text-indigo-400 dark:text-indigo-500 opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default HomePage
