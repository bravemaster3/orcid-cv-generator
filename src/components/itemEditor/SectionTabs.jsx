function SectionTabs({
    activeSections,
    activeSection,
    selectedItems,
    getSectionData,
    onSectionChange
  }) {
    return (
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {activeSections.map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeSection === section
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
            <span className="ml-2 text-sm opacity-75">
              ({selectedItems[section]?.length || 0}/{getSectionData(section).length})
            </span>
          </button>
        ))}
      </div>
    )
  }
  
  export default SectionTabs