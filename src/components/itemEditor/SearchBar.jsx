import { Search } from 'lucide-react'

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search publications..."
          className="input-field pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar