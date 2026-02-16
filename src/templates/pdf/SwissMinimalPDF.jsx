import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 40,
  },
  name: {
    fontSize: 36,
    fontWeight: 'normal',
    color: '#000000',
    letterSpacing: -1,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 20,
  },
  biography: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.7,
    maxWidth: 400,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    gap: 40,
  },
  gridItem: {
    flex: 1,
  },
  item: {
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: '#666666',
  },
  publicationItem: {
    marginBottom: 12,
  },
  publicationText: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.5,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#000000',
    marginVertical: 30,
  },
  photoSection: {
    position: 'absolute',
    right: 50,
    top: 50,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 0,
    objectFit: 'cover',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  keyword: {
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
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

function SwissMinimalPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Photo - top right */}
        {photo && (
          <View style={styles.photoSection}>
            <Image src={photo} style={styles.photo} />
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
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

        <View style={styles.divider} />

        {/* Two Column Layout */}
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.gridItem}>
            {/* Experience */}
            {employment && employment.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {employment.map((job, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{job.role}</Text>
                    <Text style={styles.itemSubtitle}>{job.organization}</Text>
                    <Text style={styles.itemDate}>
                      {job.startDate} — {job.endDate || 'Present'}
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
                    <Text style={styles.itemSubtitle}>{edu.organization}</Text>
                    <Text style={styles.itemDate}>
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.gridItem}>
            {/* Funding */}
            {funding && funding.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Funding</Text>
                {funding.map((grant, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{grant.title}</Text>
                    <Text style={styles.itemSubtitle}>{grant.organization}</Text>
                    <Text style={styles.itemDate}>
                      {grant.startDate}
                      {grant.endDate && ` — ${grant.endDate}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Publications - Full Width */}
        {publications && publications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Publications</Text>
            {publications.slice(0, 8).map((pub, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.publicationText}>
                  {pub.title}
                  {pub.journalTitle && `. ${pub.journalTitle}`}
                  {pub.year && `. ${pub.year}`}
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

export default SwissMinimalPDF