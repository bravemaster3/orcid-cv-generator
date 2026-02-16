export function prepareDataForTemplate(orcidData, selectedSections, selectedItems, profilePhoto) {
    const data = {
      photo: profilePhoto
    }
  
    // Personal info
    if (selectedSections.personal && orcidData.person) {
      data.personal = orcidData.person
    }
  
    // Employment
    if (selectedSections.employment && orcidData.employment) {
      const selectedIndices = selectedItems.employment || []
      data.employment = orcidData.employment.filter((_, idx) => 
        selectedIndices.includes(idx)
      )
    }
  
    // Education
    if (selectedSections.education && orcidData.education) {
      const selectedIndices = selectedItems.education || []
      data.education = orcidData.education.filter((_, idx) => 
        selectedIndices.includes(idx)
      )
    }
  
    // Publications
    if (selectedSections.publications && orcidData.works) {
      const selectedIndices = selectedItems.publications || []
      data.publications = orcidData.works.filter((_, idx) => 
        selectedIndices.includes(idx)
      )
    }
  
    // Funding
    if (selectedSections.funding && orcidData.funding) {
      const selectedIndices = selectedItems.funding || []
      data.funding = orcidData.funding.filter((_, idx) => 
        selectedIndices.includes(idx)
      )
    }
  
    return data
  }