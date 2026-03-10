import { Packer } from 'docx'
import { wordTemplates } from '../templates/word'

/** Async: draw photo onto canvas clipped to a circle, return PNG data URL */
function makeCircularPng(photo) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.naturalWidth || 400, img.naturalHeight || 400)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, -(img.naturalWidth - size) / 2, -(img.naturalHeight - size) / 2)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = photo
  })
}

/** Async: convert webp data URL to JPEG data URL via canvas */
function webpToJpeg(photo) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || 400
      canvas.height = img.naturalHeight || 400
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = () => resolve(null)
    img.src = photo
  })
}

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function preprocessPhoto(photo, circular = false) {
  if (!photo) return null
  try {
    if (circular) {
      const dataUrl = await makeCircularPng(photo)
      if (!dataUrl) return null
      return { data: dataUrlToBytes(dataUrl), type: 'png' }
    }

    let dataUrl = photo
    let type = 'jpg'
    if (photo.includes('image/png')) type = 'png'
    else if (photo.includes('image/gif')) type = 'gif'
    else if (photo.includes('image/webp')) {
      dataUrl = await webpToJpeg(photo)
      if (!dataUrl) return null
      type = 'jpg'
    }
    return { data: dataUrlToBytes(dataUrl), type }
  } catch {
    return null
  }
}

export async function generateWord(cvData, templateKey) {
  const templateConfig = wordTemplates[templateKey]
  if (!templateConfig) throw new Error(`Word template ${templateKey} not found`)

  const { build: buildTemplate, circularPhoto = false } = templateConfig
  const photoData = await preprocessPhoto(cvData.photo, circularPhoto)
  const doc = buildTemplate(cvData, photoData)

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const name = cvData.personal?.fullName || 'CV'
  link.download = `${name.replace(/\s+/g, '_')}_CV.docx`
  link.click()
  URL.revokeObjectURL(url)
}
