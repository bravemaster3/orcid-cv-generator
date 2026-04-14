import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import SectionTabs from './itemEditor/SectionTabs'
import SearchBar from './itemEditor/SearchBar'
import SelectionControls from './itemEditor/SelectionControls'
import ItemsList from './itemEditor/ItemsList'

const TYPE_LABELS = {
  'journal-article': 'Journal Article',
  'conference-abstract': 'Conference Abstract',
  'conference-paper': 'Conference Paper',
  'conference-poster': 'Conference Poster',
  'book': 'Book',
  'book-chapter': 'Book Chapter',
  'dataset': 'Dataset',
  'preprint': 'Preprint',
  'report': 'Report',
  'working-paper': 'Working Paper',
  'thesis': 'Thesis',
  'other': 'Other',
}
const typeLabel = t => TYPE_LABELS[t] || (t ? t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown')

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
  const [typeFilter, setTypeFilter] = useState('all')

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

  // Build filtered data with original indices (publications only)
  const filteredData = sectionData.reduce((acc, item, idx) => {
    if (activeSection === 'publications') {
      if (typeFilter !== 'all' && item.type !== typeFilter) return acc
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const title = (item.title?.title?.value || item.title || '').toLowerCase()
        const journal = (item.journalTitle || '').toLowerCase()
        const year = (item.year || '').toString()
        const authors = (item.authors || []).join(' ').toLowerCase()
        if (!title.includes(q) && !journal.includes(q) && !year.includes(q) && !authors.includes(q)) return acc
      }
    }
    acc.push({ item, idx })
    return acc
  }, [])

  const filteredItems = filteredData.map(x => x.item)
  const filteredIndices = filteredData.map(x => x.idx)

  // Unique publication types for filter chips
  const publicationTypes = activeSection === 'publications'
    ? [...new Set(sectionData.map(item => item.type).filter(Boolean))].sort()
    : []

  return (
    <div className="card max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Customize Your Selections
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose which specific items to include in each section
        </p>
      </div>

      {activeSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
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
              setTypeFilter('all')
            }}
          />

          {activeSection === 'publications' && (
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeSection === 'publications' && publicationTypes.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All ({sectionData.length})
              </button>
              {publicationTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {typeLabel(type)} ({sectionData.filter(item => item.type === type).length})
                </button>
              ))}
            </div>
          )}

          <SelectionControls
            selectedCount={filteredIndices.filter(i => sectionItems.includes(i)).length}
            totalCount={filteredData.length}
            onSelectAll={() => {
              const kept = sectionItems.filter(i => !filteredIndices.includes(i))
              onSelectAll(activeSection, [...kept, ...filteredIndices])
            }}
            onDeselectAll={() => {
              if (typeFilter !== 'all' && activeSection === 'publications') {
                const kept = sectionItems.filter(i => !filteredIndices.includes(i))
                onSelectAll(activeSection, kept)
              } else {
                onDeselectAll(activeSection)
              }
            }}
          />

          <ItemsList
            section={activeSection}
            items={filteredItems}
            originalIndices={filteredIndices}
            selectedItems={sectionItems}
            onItemToggle={onItemToggle}
          />
        </>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
