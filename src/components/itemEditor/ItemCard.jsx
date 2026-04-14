function ItemCard({ item, section, isSelected, onToggle }) {
  const renderContent = () => {
    switch (section) {
      case 'employment':
      case 'education':
        return (
          <>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {item.role || item.title || 'Untitled'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.organization || 'Unknown Organization'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {item.startDate && (
                <>
                  {item.startDate}
                  {item.endDate && ` - ${item.endDate}`}
                  {!item.endDate && ' - Present'}
                </>
              )}
            </div>
          </>
        )

      case 'publications': {
        const title = item.title?.title?.value || item.title || 'Untitled'
        return (
          <>
            <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {title}
            </div>
            {item.journalTitle && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.journalTitle}
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {item.year || 'Year unknown'}
              {item.type && ` • ${item.type}`}
            </div>
          </>
        )
      }

      case 'funding':
        return (
          <>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {item.title || 'Untitled Grant'}
            </div>
            {item.organization && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {item.organization}
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {item.startDate && `${item.startDate}`}
              {item.endDate && ` - ${item.endDate}`}
            </div>
          </>
        )

      default:
        return null
    }
  }

  const content = renderContent()
  if (!content) return null

  return (
    <label
      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="checkbox mt-1"
      />
      <div className="flex-1 min-w-0">
        {content}
      </div>
    </label>
  )
}

export default ItemCard
