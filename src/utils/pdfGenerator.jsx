import { pdf } from '@react-pdf/renderer'
import { pdfTemplates } from '../templates/pdf'

export async function generatePDF(cvData, templateKey) {
  try {
    const PDFTemplate = pdfTemplates[templateKey]
    
    if (!PDFTemplate) {
      throw new Error(`Template ${templateKey} not found`)
    }

    // Create PDF document
    const doc = <PDFTemplate data={cvData} />
    
    // Generate blob
    const blob = await pdf(doc).toBlob()
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    const name = cvData.personal?.fullName || 'CV'
    link.download = `${name.replace(/\s+/g, '_')}_CV.pdf`
    
    link.click()
    
    // Cleanup
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}