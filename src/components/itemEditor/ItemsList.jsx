import ItemCard from './ItemCard'

function ItemsList({ section, items, selectedItems, searchQuery, onItemToggle }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No items found in this section
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(index)
        
        return (
          <ItemCard
            key={index}
            item={item}
            section={section}
            index={index}
            isSelected={isSelected}
            searchQuery={searchQuery}
            onToggle={() => onItemToggle(section, index)}
          />
        )
      })}
    </div>
  )
}

export default ItemsList