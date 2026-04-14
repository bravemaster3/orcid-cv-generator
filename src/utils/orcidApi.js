const ORCID_API_BASE = 'https://pub.orcid.org/v3.0'
const OPENALEX_API_BASE = 'https://api.openalex.org/works'

export async function fetchOrcidData(orcidId) {
  try {
    // Clean ORCID ID
    const cleanId = orcidId.replace(/\s+/g, '').trim()

    // Fetch all ORCID endpoints in parallel
    const [personResponse, worksResponse, employmentResponse, educationResponse, fundingResponse] = await Promise.all([
      fetch(`${ORCID_API_BASE}/${cleanId}/person`, { headers: { 'Accept': 'application/json' } }),
      fetch(`${ORCID_API_BASE}/${cleanId}/works`, { headers: { 'Accept': 'application/json' } }),
      fetch(`${ORCID_API_BASE}/${cleanId}/employments`, { headers: { 'Accept': 'application/json' } }),
      fetch(`${ORCID_API_BASE}/${cleanId}/educations`, { headers: { 'Accept': 'application/json' } }),
      fetch(`${ORCID_API_BASE}/${cleanId}/fundings`, { headers: { 'Accept': 'application/json' } }),
    ])

    if (!personResponse.ok) {
      throw new Error('Failed to fetch ORCID data. Please check the ORCID ID.')
    }

    const [personData, worksData, employmentData, educationData, fundingData] = await Promise.all([
      personResponse.json(),
      worksResponse.ok ? worksResponse.json() : null,
      employmentResponse.ok ? employmentResponse.json() : null,
      educationResponse.ok ? educationResponse.json() : null,
      fundingResponse.ok ? fundingResponse.json() : null,
    ])

    const works = transformWorks(worksData)

    // Enrich works with author/bibliographic data from OpenAlex (for works that have a DOI)
    const enrichedWorks = await enrichWorksWithOpenAlex(works)

    return {
      person: transformPerson(personData),
      works: enrichedWorks,
      employment: transformEmployment(employmentData),
      education: transformEducation(educationData),
      funding: transformFunding(fundingData),
    }
  } catch (error) {
    console.error('Error fetching ORCID data:', error)
    throw error
  }
}

async function enrichWorksWithOpenAlex(works) {
  // OpenAlex filter API accepts multiple DOIs in one request: filter=doi:url1|url2|...
  // Batches of 100 keep URLs under ~5 KB (safe for all browsers/proxies).
  // All batches fire in parallel — they cover disjoint DOIs so there is no rate-limit
  // concern and no need to delay between them.
  const BATCH_SIZE = 100

  const results = [...works]
  const worksWithDoi = works
    .map((work, index) => ({ work, index }))
    .filter(({ work }) => work.doi)

  if (worksWithDoi.length === 0) return results

  const batches = []
  for (let i = 0; i < worksWithDoi.length; i += BATCH_SIZE) {
    batches.push(worksWithDoi.slice(i, i + BATCH_SIZE))
  }

  await Promise.all(batches.map(async (batch) => {
    try {
      const doiFilter = batch.map(({ work }) => `https://doi.org/${work.doi}`).join('|')
      const url = `${OPENALEX_API_BASE}?filter=doi:${doiFilter}&select=doi,authorships,biblio&per_page=200&mailto=contact@example.com`

      const res = await fetch(url)
      if (!res.ok) return

      const json = await res.json()
      for (const item of (json.results || [])) {
        const rawDoi = (item.doi || '').replace('https://doi.org/', '').toLowerCase()
        const match = batch.find(({ work }) => work.doi?.toLowerCase() === rawDoi)
        if (!match) continue

        const authors = (item.authorships || []).map(a => a.author?.display_name).filter(Boolean)
        const biblio = item.biblio || {}
        const pages = biblio.first_page && biblio.last_page
          ? `${biblio.first_page}–${biblio.last_page}`
          : (biblio.first_page || null)

        results[match.index] = {
          ...match.work,
          authors,
          volume: biblio.volume || null,
          issue: biblio.issue || null,
          pages,
        }
      }
    } catch {
      // keep original works on error
    }
  }))

  return results
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

    // Check group-level external IDs first (more complete), then fall back to work-summary level
    const groupIds = group['external-ids']?.['external-id'] || []
    const workIds = work['external-ids']?.['external-id'] || []
    const allIds = [...groupIds, ...workIds]
    const doiEntry = allIds.find(id => id['external-id-type'] === 'doi')
    const doi = doiEntry?.['external-id-value'] || null

    return {
      title: work.title?.title?.value || 'Untitled',
      journalTitle: work['journal-title']?.value,
      year: work['publication-date']?.year?.value,
      type: work.type,
      url: work.url?.value,
      doi,
      authors: [],
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
