import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: 'cover',
    border: '3px solid #6366f1',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  email: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 12,
  },
  biography: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  keyword: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    color: '#6366f1',
  },
  timelineSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDate: {
    width: 100,
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 15,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 15,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -4,
    top: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
    border: '2px solid #ffffff',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 15,
  },
  timelineTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  timelineOrg: {
    fontSize: 10,
    color: '#6366f1',
    marginBottom: 2,
  },
  timelineDept: {
    fontSize: 9,
    color: '#64748b',
  },
  publicationsSection: {
    marginTop: 25,
  },
  publicationItem: {
    marginBottom: 8,
    paddingLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  publicationTitle: {
    fontSize: 9,
    color: '#1e293b',
    marginBottom: 2,
  },
  publicationJournal: {
    fontSize: 8,
    color: '#6366f1',
    fontStyle: 'italic',
    marginBottom: 1,
  },
  publicationMeta: {
    fontSize: 8,
    color: '#94a3b8',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#64748b',
  },
})

function TimelinePDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data

  // Combine and sort employment and education by date
  const timelineItems = []
  
  if (employment) {
    employment.forEach(item => {
      timelineItems.push({ ...item, type: 'employment' })
    })
  }
  
  if (education) {
    education.forEach(item => {
      timelineItems.push({ ...item, type: 'education' })
    })
  }

  // Sort by start date (newest first)
  timelineItems.sort((a, b) => {
    const dateA = a.startDate || ''
    const dateB = b.startDate || ''
    return dateB.localeCompare(dateA)
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image src={photo} style={styles.photo} />
            </View>
          )}
          <Text style={styles.name}>{personal?.fullName}</Text>
          {personal?.emails && personal.emails.length > 0 && (
            <Text style={styles.email}>{personal.emails[0]}</Text>
          )}
          {personal?.biography && (
            <Text style={styles.biography}>{personal.biography}</Text>
          )}
          {personal?.keywords && personal.keywords.length > 0 && (
            <View style={styles.keywordsContainer}>
              {personal.keywords.map((keyword, idx) => (
                <Text key={idx} style={styles.keyword}>
                  {keyword}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Career Timeline */}
        {timelineItems.length > 0 && (
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Career Timeline</Text>
            {timelineItems.map((item, idx) => (
              <View key={idx} style={styles.timelineItem} wrap={false}>
                <Text style={styles.timelineDate}>
                  {item.startDate}
                  {item.endDate ? ` - ${item.endDate}` : ' - Present'}
                </Text>
                <View style={styles.timelineLine}>
                  <View style={styles.timelineDot} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {item.role || item.title}
                  </Text>
                  <Text style={styles.timelineOrg}>{item.organization}</Text>
                  {item.department && (
                    <Text style={styles.timelineDept}>{item.department}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {publications && publications.length > 0 && (
          <View style={styles.publicationsSection}>
            <Text style={styles.sectionTitle}>Selected Publications</Text>
            {publications.slice(0, 10).map((pub, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.publicationTitle}>{pub.title}</Text>
                {pub.journalTitle && (
                  <Text style={styles.publicationJournal}>
                    {pub.journalTitle}
                  </Text>
                )}
                <Text style={styles.publicationMeta}>
                  {pub.year}
                  {pub.type && ` • ${pub.type}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Funding */}
        {funding && funding.length > 0 && (
          <View style={styles.publicationsSection}>
            <Text style={styles.sectionTitle}>Grants & Funding</Text>
            {funding.map((grant, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.publicationTitle}>{grant.title}</Text>
                <Text style={styles.timelineOrg}>{grant.organization}</Text>
                <Text style={styles.publicationMeta}>
                  {grant.startDate}
                  {grant.endDate && ` - ${grant.endDate}`}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
            )} 
            fixed 
        />
      </Page>
    </Document>
  )
}

export default TimelinePDF