import { useState } from 'react'
import { Search, AlertCircle, Loader2 } from 'lucide-react'

function OrcidInput({ onSubmit, loading, error }) {
  const [orcidId, setOrcidId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Clean ORCID ID (remove spaces, dashes, URL parts)
    const cleanId = orcidId
      .replace(/https?:\/\/(www\.)?orcid\.org\//gi, '')
      .replace(/\s+/g, '')
      .trim()
    
    if (cleanId) {
      onSubmit(cleanId)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Your ORCID iD
        </h2>
        <p className="text-gray-600">
          We'll fetch your public profile information to generate your CV
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="orcid" className="block text-sm font-medium text-gray-700 mb-2">
            ORCID iD
          </label>
          <div className="relative">
            <input
              type="text"
              id="orcid"
              value={orcidId}
              onChange={(e) => setOrcidId(e.target.value)}
              placeholder="0000-0002-1825-0097 or https://orcid.org/0000-0002-1825-0097"
              className="input-field pr-12"
              disabled={loading}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Enter your ORCID iD (16 digits) or paste the full URL
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error fetching ORCID data</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!orcidId.trim() || loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Fetching data...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Fetch ORCID Data
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Don't have an ORCID iD?{' '}
          <a
            href="https://orcid.org/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline font-medium"
          >
            Register for free
          </a>
        </p>
      </div>
    </div>
  )
}

export default OrcidInput