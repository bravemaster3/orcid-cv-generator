import { useState } from 'react'
import OrcidInput from './components/OrcidInput'
import SectionSelector from './components/SectionSelector'
import ItemEditor from './components/ItemEditor'
import TemplateSelector from './components/TemplateSelector'
import CVPreview from './components/CVPreview'
import Stepper from './components/Stepper'
import { fetchOrcidData } from './utils/orcidApi'

const STEPS = [
  { id: 1, name: 'ORCID ID', description: 'Enter your ORCID' },
  { id: 2, name: 'Sections', description: 'Choose sections' },
  { id: 3, name: 'Customize', description: 'Edit items' },
  { id: 4, name: 'Template', description: 'Pick a style' },
  { id: 5, name: 'Preview', description: 'Review & download' },
]

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orcidId, setOrcidId] = useState('')
  const [orcidData, setOrcidData] = useState(null)
  const [selectedSections, setSelectedSections] = useState({})
  const [selectedItems, setSelectedItems] = useState({})
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleItemToggle = (section, itemIndex) => {
    setSelectedItems(prev => {
      const sectionItems = prev[section] || []
      const isSelected = sectionItems.includes(itemIndex)
      
      return {
        ...prev,
        [section]: isSelected
          ? sectionItems.filter(idx => idx !== itemIndex)
          : [...sectionItems, itemIndex]
      }
    })
  }

  const handleSelectAllItems = (section, itemCount) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: Array.from({ length: itemCount }, (_, i) => i)
    }))
  }

  const handleDeselectAllItems = (section) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: []
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return orcidData !== null
      case 2:
        return Object.values(selectedSections).some(v => v)
      case 3:
        return true
      case 4:
        return selectedTemplate !== null
      default:
        return true
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleReset = () => {
    setCurrentStep(1)
    setOrcidId('')
    setOrcidData(null)
    setSelectedSections({})
    setSelectedItems({})
    setSelectedTemplate('modern-minimal')
    setProfilePhoto(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ORCID CV Generator
          </h1>
          <p className="text-gray-600">
            Create beautiful CVs from your ORCID profile
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Stepper steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 1 && (
              <OrcidInput
                onSubmit={handleOrcidSubmit}
                loading={loading}
                error={error}
              />
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
                onPhotoUpload={setProfilePhoto}
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
                profilePhoto={profilePhoto}
                onBack={handleBack}
                onReset={handleReset}
              />
            )}
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Built with React &amp; Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App