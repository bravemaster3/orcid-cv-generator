import { CheckSquare, Square } from 'lucide-react'

function SelectionControls({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll
}) {
  const allSelected = selectedCount === totalCount
  const noneSelected = selectedCount === 0

  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount} of {totalCount} items selected
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSelectAll}
          disabled={allSelected}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:text-gray-400 dark:disabled:text-gray-600 font-medium flex items-center gap-1"
        >
          <CheckSquare className="w-4 h-4" />
          Select All
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          onClick={onDeselectAll}
          disabled={noneSelected}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:text-gray-400 dark:disabled:text-gray-600 font-medium flex items-center gap-1"
        >
          <Square className="w-4 h-4" />
          Deselect All
        </button>
      </div>
    </div>
  )
}

export default SelectionControls
