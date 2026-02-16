const ORCID_API_BASE = 'https://pub.orcid.org/v3.0'

export async function fetchOrcidData(orcidId) {
  try {
    // Clean ORCID ID
    const cleanId = orcidId.replace(/\s+/g, '').trim()
    
    // Fetch person data
    const personResponse = await fetch(`${ORCID_API_BASE}/${cleanId}/person`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!personResponse.ok) {
      throw new Error('Failed to fetch ORCID data. Please check the ORCID ID.')
    }

    const personData = await personResponse.json()

    // Fetch works (publications)
    const worksResponse = await fetch(`${ORCID_API_BASE}/${cleanId}/works`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const worksData = worksResponse.ok ? await worksResponse.json() : null

    // Fetch employments
    const employmentResponse = await fetch(`${ORCID_API_BASE}/${cleanId}/employments`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const employmentData = employmentResponse.ok ? await employmentResponse.json() : null

    // Fetch education
    const educationResponse = await fetch(`${ORCID_API_BASE}/${cleanId}/educations`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const educationData = educationResponse.ok ? await educationResponse.json() : null

    // Fetch funding
    const fundingResponse = await fetch(`${ORCID_API_BASE}/${cleanId}/fundings`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const fundingData = fundingResponse.ok ? await fundingResponse.json() : null

    // Transform the data
    return transformOrcidData(personData, worksData, employmentData, educationData, fundingData)
  } catch (error) {
    console.error('Error fetching ORCID data:', error)
    throw error
  }
}

function transformOrcidData(person, works, employment, education, funding) {
  return {
    person: transformPerson(person),
    works: transformWorks(works),
    employment: transformEmployment(employment),
    education: transformEducation(education),
    funding: transformFunding(funding)
  }
}

function transformPerson(data) {
  if (!data) return null

  const name = data.name
  const biography = data.biography?.content
  const keywords = data.keywords?.keyword?.map(k => k.content) || []
  const emails = data.emails?.email?.map(e => e.email) || []

  return {
    firstName: name?.['given-names']?.value || '',
    lastName: name?.['family-name']?.value || '',
    fullName: `${name?.['given-names']?.value || ''} ${name?.['family-name']?.value || ''}`.trim(),
    biography,
    keywords,
    emails
  }
}

function transformWorks(data) {
  if (!data || !data.group) return []

  return data.group.map(group => {
    const work = group['work-summary']?.[0]
    if (!work) return null

    return {
      title: work.title?.title?.value || 'Untitled',
      journalTitle: work['journal-title']?.value,
      year: work['publication-date']?.year?.value,
      type: work.type,
      url: work.url?.value,
      externalIds: work['external-ids']?.['external-id'] || []
    }
  }).filter(Boolean)
}

function transformEmployment(data) {
  if (!data || !data['affiliation-group']) return []

  return data['affiliation-group'].map(group => {
    const emp = group.summaries?.[0]?.['employment-summary']
    if (!emp) return null

    return {
      role: emp['role-title'],
      organization: emp.organization?.name,
      startDate: formatDate(emp['start-date']),
      endDate: emp['end-date'] ? formatDate(emp['end-date']) : null,
      department: emp['department-name']
    }
  }).filter(Boolean)
}

function transformEducation(data) {
  if (!data || !data['affiliation-group']) return []

  return data['affiliation-group'].map(group => {
    const edu = group.summaries?.[0]?.['education-summary']
    if (!edu) return null

    return {
      title: edu['role-title'],
      organization: edu.organization?.name,
      startDate: formatDate(edu['start-date']),
      endDate: edu['end-date'] ? formatDate(edu['end-date']) : null,
      department: edu['department-name']
    }
  }).filter(Boolean)
}

function transformFunding(data) {
  if (!data || !data.group) return []

  return data.group.map(group => {
    const funding = group['funding-summary']?.[0]
    if (!funding) return null

    return {
      title: funding.title?.title?.value,
      organization: funding.organization?.name,
      startDate: formatDate(funding['start-date']),
      endDate: funding['end-date'] ? formatDate(funding['end-date']) : null,
      type: funding.type
    }
  }).filter(Boolean)
}

function formatDate(dateObj) {
  if (!dateObj) return null
  
  const year = dateObj.year?.value
  const month = dateObj.month?.value
  
  if (!year) return null
  if (!month) return year
  
  return `${month}/${year}`
}