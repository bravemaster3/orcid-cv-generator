import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    gap: 15,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: 'cover',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 6,
  },
  biography: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 5,
  },
  keyword: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 7,
    color: '#374151',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    flex: 1,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#9ca3af',
    paddingBottom: 2,
  },
  item: {
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 1,
  },
  itemOrg: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 1,
  },
  itemDate: {
    fontSize: 7,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  publicationItem: {
    marginBottom: 5,
  },
  publicationTitle: {
    fontSize: 8,
    color: '#000000',
    marginBottom: 1,
  },
  publicationJournal: {
    fontSize: 7,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  publicationMeta: {
    fontSize: 7,
    color: '#6b7280',
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

function CompactDensePDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {photo && <Image src={photo} style={styles.photo} />}
          
          <View style={styles.headerText}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            {personal?.emails && personal.emails.length > 0 && (
              <Text style={styles.contactInfo}>{personal.emails[0]}</Text>
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
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.column}>
            {/* Experience */}
            {employment && employment.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {employment.map((job, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{job.role}</Text>
                    <Text style={styles.itemOrg}>{job.organization}</Text>
                    <Text style={styles.itemDate}>
                      {job.startDate} - {job.endDate || 'Present'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{edu.title}</Text>
                    <Text style={styles.itemOrg}>{edu.organization}</Text>
                    <Text style={styles.itemDate}>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Funding */}
            {funding && funding.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Funding</Text>
                {funding.map((grant, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{grant.title}</Text>
                    <Text style={styles.itemOrg}>{grant.organization}</Text>
                    <Text style={styles.itemDate}>
                      {grant.startDate}
                      {grant.endDate && ` - ${grant.endDate}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column - Publications */}
          <View style={styles.column}>
            {publications && publications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Publications</Text>
                {publications.map((pub, idx) => (
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
          </View>
        </View>
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

export default CompactDensePDF