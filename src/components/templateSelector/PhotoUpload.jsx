import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

function PhotoUpload({ profilePhoto, onPhotoUpload }) {
  const [photoPreview, setPhotoPreview] = useState(profilePhoto)

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        setPhotoPreview(result)
        onPhotoUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    onPhotoUpload(null)
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Profile Photo (Optional)
      </h3>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="btn-outline cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-600 mt-3">
            Upload a professional photo to include in your CV. Recommended: square image, at least 400x400px.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PhotoUpload