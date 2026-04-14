import { ChevronRight, ChevronLeft } from 'lucide-react'
import PhotoUpload from './templateSelector/PhotoUpload'
import TemplateGrid from './templateSelector/TemplateGrid'

function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  profilePhoto,
  onPhotoUpload,
  photoEnabled,
  onPhotoEnableToggle,
  onNext,
  onBack
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PhotoUpload
        profilePhoto={profilePhoto}
        onPhotoUpload={onPhotoUpload}
        photoEnabled={photoEnabled}
        onPhotoEnableToggle={onPhotoEnableToggle}
      />

      <TemplateGrid
        selectedTemplate={selectedTemplate}
        onSelectTemplate={onSelectTemplate}
      />

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTemplate}
          className="btn-primary flex items-center gap-2"
        >
          Preview CV
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TemplateSelector