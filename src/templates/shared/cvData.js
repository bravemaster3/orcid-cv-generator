// Shared data normalizers used by both PDF and Word templates.
// Add new fields here once — both formats pick them up automatically.

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
    journal: pub.journalTitle || '',
    year: pub.year || '',
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

export function buildTimelineItems(employment = [], education = []) {
  const items = [
    ...employment.map(job => ({
      title: job.role || '',
      organization: job.organization || '',
      department: job.department || '',
      dateRange: formatDateRange(job.startDate, job.endDate),
      startDate: job.startDate || '',
      itemType: 'employment',
    })),
    ...education.map(edu => ({
      title: edu.title || '',
      organization: edu.organization || '',
      department: edu.department || '',
      dateRange: formatDateRange(edu.startDate, edu.endDate),
      startDate: edu.startDate || '',
      itemType: 'education',
    })),
  ]
  return items.sort((a, b) => b.startDate.localeCompare(a.startDate))
}
