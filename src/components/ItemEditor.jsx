import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import SectionTabs from './itemEditor/SectionTabs'
import SearchBar from './itemEditor/SearchBar'
import SelectionControls from './itemEditor/SelectionControls'
import ItemsList from './itemEditor/ItemsList'

function ItemEditor({
  orcidData,
  selectedSections,
  selectedItems,
  onItemToggle,
  onSelectAll,
  onDeselectAll,
  onNext,
  onBack
}) {
  const [activeSection, setActiveSection] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get first selected section as default
  useState(() => {
    const firstSection = Object.keys(selectedSections).find(
      key => selectedSections[key]
    )
    if (firstSection) setActiveSection(firstSection)
  }, [])

  const getSectionData = (section) => {
    switch (section) {
      case 'employment':
        return orcidData.employment || []
      case 'education':
        return orcidData.education || []
      case 'publications':
        return orcidData.works || []
      case 'funding':
        return orcidData.funding || []
      default:
        return []
    }
  }

  const activeSections = Object.keys(selectedSections).filter(
    key => selectedSections[key] && key !== 'personal'
  )

  if (!activeSection || !activeSections.includes(activeSection)) {
    setActiveSection(activeSections[0])
  }

  const sectionData = getSectionData(activeSection)
  const sectionItems = selectedItems[activeSection] || []

  return (
    <div className="card max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customize Your Selections
        </h2>
        <p className="text-gray-600">
          Choose which specific items to include in each section
        </p>
      </div>

      {activeSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No editable sections selected. Personal information will be included by default.
          </p>
        </div>
      ) : (
        <>
          <SectionTabs
            activeSections={activeSections}
            activeSection={activeSection}
            selectedItems={selectedItems}
            getSectionData={getSectionData}
            onSectionChange={(section) => {
              setActiveSection(section)
              setSearchQuery('')
            }}
          />

          {activeSection === 'publications' && (
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          <SelectionControls
            selectedCount={sectionItems.length}
            totalCount={sectionData.length}
            onSelectAll={() => onSelectAll(activeSection, sectionData.length)}
            onDeselectAll={() => onDeselectAll(activeSection)}
          />

          <ItemsList
            section={activeSection}
            items={sectionData}
            selectedItems={sectionItems}
            searchQuery={searchQuery}
            onItemToggle={onItemToggle}
          />
        </>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onNext} className="btn-primary flex items-center gap-2">
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ItemEditor