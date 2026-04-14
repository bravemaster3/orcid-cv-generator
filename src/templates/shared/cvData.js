// Shared data normalizers used by both PDF and Word templates.
// Add new fields here once — both formats pick them up automatically.

const AUTHOR_THRESHOLD = 10

/** Convert one name part to an initial, e.g. "Jean-Pierre" → "J.-P.", "Kevin" → "K." */
function getInitial(part) {
  if (!part) return ''
  if (part.endsWith('.')) return part          // already "J."
  if (part.length <= 2) return part.toUpperCase() + '.'
  if (part.includes('-'))
    return part.charAt(0).toUpperCase() + '.'
  return part.charAt(0).toUpperCase() + '.'
}

/** "John Paul Smith" → "Smith J.P.",  "J. Smith" → "Smith J." */
function formatAuthorName(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return name
  const lastName = parts[parts.length - 1]
  const initials = parts.slice(0, -1).map(getInitial).join('')
  return `${lastName} ${initials}`
}

function findOrcidIndex(authors, orcidName) {
  if (!orcidName) return -1
  const o = orcidName.toLowerCase().trim()
  return authors.findIndex(a => {
    const aL = (a || '').toLowerCase().trim()
    return aL === o || aL.includes(o) || o.includes(aL)
  })
}

/**
 * Format an author list and return [{text, bold}] segments.
 *
 * - Names are reformatted to "Lastname I1.I2." style.
 * - The ORCID user's name is marked bold: true.
 * - Lists > threshold are truncated; ORCID user is surfaced if hidden.
 */
export function formatAuthors(authors = [], orcidName = '') {
  if (!authors.length) return []

  const formatted = authors.map(formatAuthorName)
  const orcidIdx = findOrcidIndex(authors, orcidName)

  let items
  if (authors.length <= AUTHOR_THRESHOLD) {
    items = formatted.map((name, i) => ({ text: name, bold: i === orcidIdx }))
  } else {
    const first9 = formatted.slice(0, 9).map((name, i) => ({ text: name, bold: i === orcidIdx }))
    const lastItem = { text: formatted[formatted.length - 1], bold: orcidIdx === formatted.length - 1 }
    const isOrcidHidden = orcidIdx >= 9 && orcidIdx < formatted.length - 1

    items = isOrcidHidden
      ? [...first9, { text: '...', bold: false }, { text: formatted[orcidIdx], bold: true }, { text: '...', bold: false }, lastItem]
      : [...first9, { text: '...', bold: false }, lastItem]
  }

  // Interleave with ", " separators then merge adjacent non-bold into one segment
  const parts = []
  items.forEach((item, i) => {
    if (i > 0) parts.push({ text: ', ', bold: false })
    parts.push(item)
  })
  return parts.reduce((acc, part) => {
    if (acc.length > 0 && !acc[acc.length - 1].bold && !part.bold) {
      acc[acc.length - 1] = { text: acc[acc.length - 1].text + part.text, bold: false }
    } else {
      acc.push({ ...part })
    }
    return acc
  }, [])
}

export function formatDateRange(start, end, separator = ' – ') {
  if (!start) return ''
  return `${start}${separator}${end || 'Present'}`
}

export function normalizeEmployment(jobs = []) {
  return jobs.map(job => ({
    title: job.role || '',
    organization: job.organization || '',
    department: job.department || '',
    dateRange: formatDateRange(job.startDate, job.endDate),
  }))
}

export function normalizeEducation(items = []) {
  return items.map(edu => ({
    title: edu.title || '',
    organization: edu.organization || '',
    department: edu.department || '',
    dateRange: formatDateRange(edu.startDate, edu.endDate),
  }))
}

export function normalizePublications(pubs = []) {
  return pubs.map((pub, idx) => ({
    number: idx + 1,
    title: pub.title || '',
    journal: pub.journalTitle || null,
    year: pub.year || null,
    type: pub.type || '',
    authors: pub.authors || [],
    volume: pub.volume || null,
    issue: pub.issue || null,
    pages: pub.pages || null,
    doi: pub.doi || null,
  }))
}

export function normalizeFunding(grants = []) {
  return grants.map(grant => ({
    title: grant.title || '',
    organization: grant.organization || '',
    dateRange: formatDateRange(grant.startDate, grant.endDate),
  }))
}

// Parse "MM/YYYY" or "YYYY" into a numeric sort key.
// nullValue: what to return when dateStr is absent (use Infinity for end dates
// so that ongoing items sort first; use 0 for start dates so unknown = oldest).
function parseSortableDate(dateStr, nullValue = Infinity) {
  if (!dateStr) return nullValue
  const parts = dateStr.split('/')
  if (parts.length === 2) {
    const month = parseInt(parts[0]) || 0
    const year  = parseInt(parts[1]) || 0
    return year * 100 + month
  }
  return (parseInt(dateStr) || 0) * 100
}

export function buildTimelineItems(employment = [], education = []) {
  const items = [
    ...employment.map(job => ({
      title: job.role || '',
      organization: job.organization || '',
      department: job.department || '',
      dateRange: formatDateRange(job.startDate, job.endDate),
      startDate: job.startDate || '',
      endDate: job.endDate || null,
      itemType: 'employment',
    })),
    ...education.map(edu => ({
      title: edu.title || '',
      organization: edu.organization || '',
      department: edu.department || '',
      dateRange: formatDateRange(edu.startDate, edu.endDate),
      startDate: edu.startDate || '',
      endDate: edu.endDate || null,
      itemType: 'education',
    })),
  ]
  // Sort by start date descending (most recent first).
  // Break ties by end date descending (null end = ongoing = most recent).
  return items.sort((a, b) => {
    const startDiff = parseSortableDate(b.startDate, 0) - parseSortableDate(a.startDate, 0)
    if (startDiff !== 0) return startDiff
    return parseSortableDate(b.endDate) - parseSortableDate(a.endDate)
  })
}
