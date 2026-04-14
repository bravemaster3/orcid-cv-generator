import ItemCard from './ItemCard'

function ItemsList({ section, items, originalIndices, selectedItems, onItemToggle }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No items found in this section
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {items.map((item, i) => {
        const idx = originalIndices ? originalIndices[i] : i
        const isSelected = selectedItems.includes(idx)

        return (
          <ItemCard
            key={idx}
            item={item}
            section={section}
            index={idx}
            isSelected={isSelected}
            onToggle={() => onItemToggle(section, idx)}
          />
        )
      })}
    </div>
  )
}

export default ItemsList