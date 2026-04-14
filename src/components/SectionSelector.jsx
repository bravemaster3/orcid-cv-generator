import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  DollarSign,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

const SECTION_CONFIG = {
  personal: {
    icon: User,
    label: 'Personal Information',
    description: 'Name, bio, keywords, contact'
  },
  employment: {
    icon: Briefcase,
    label: 'Employment History',
    description: 'Work experience and positions'
  },
  education: {
    icon: GraduationCap,
    label: 'Education',
    description: 'Academic qualifications'
  },
  publications: {
    icon: FileText,
    label: 'Publications',
    description: 'Research works and papers'
  },
  funding: {
    icon: DollarSign,
    label: 'Funding',
    description: 'Grants and awards'
  }
}

function SectionSelector({ orcidData, selectedSections, onToggle, onNext, onBack }) {
  const getItemCount = (section) => {
    switch (section) {
      case 'personal':
        return orcidData.person ? 1 : 0
      case 'employment':
        return orcidData.employment?.length || 0
      case 'education':
        return orcidData.education?.length || 0
      case 'publications':
        return orcidData.works?.length || 0
      case 'funding':
        return orcidData.funding?.length || 0
      default:
        return 0
    }
  }

  const availableSections = Object.keys(SECTION_CONFIG).filter(
    section => getItemCount(section) > 0
  )

  const selectedCount = availableSections.filter(
    section => selectedSections[section]
  ).length

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Select Sections to Include
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose which sections of your ORCID profile to include in your CV
        </p>
        <div className="mt-4 inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
          {selectedCount} of {availableSections.length} sections selected
        </div>
      </div>

      <div className="space-y-3">
        {availableSections.map((section) => {
          const config = SECTION_CONFIG[section]
          const Icon = config.icon
          const count = getItemCount(section)
          const isSelected = selectedSections[section]

          return (
            <label
              key={section}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(section)}
                className="checkbox"
              />
              <div className={`p-3 rounded-lg ${
                isSelected ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Icon className={`w-6 h-6 ${
                  isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {config.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {config.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  {count} {count === 1 ? 'item' : 'items'}
                </div>
              </div>
            </label>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className="btn-primary flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default SectionSelector
