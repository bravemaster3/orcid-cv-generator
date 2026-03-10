import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'

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
  const jobs = normalizeEmployment(employment)
  const edus = normalizeEducation(education)
  const pubs = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {photo && (
          <View style={styles.photoSection}>
            <Image src={photo} style={styles.photo} />
          </View>
        )}

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
                <Text key={idx} style={styles.keyword}>{keyword}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            {jobs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {jobs.map((job, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{job.title}</Text>
                    <Text style={styles.itemSubtitle}>{job.organization}</Text>
                    <Text style={styles.itemDate}>{job.dateRange}</Text>
                  </View>
                ))}
              </View>
            )}
            {edus.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {edus.map((edu, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{edu.title}</Text>
                    <Text style={styles.itemSubtitle}>{edu.organization}</Text>
                    <Text style={styles.itemDate}>{edu.dateRange}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.gridItem}>
            {grants.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Funding</Text>
                {grants.map((grant, idx) => (
                  <View key={idx} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{grant.title}</Text>
                    <Text style={styles.itemSubtitle}>{grant.organization}</Text>
                    <Text style={styles.itemDate}>{grant.dateRange}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {pubs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Publications</Text>
            {pubs.slice(0, 8).map((pub, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.publicationText}>{pub.fullCitation}</Text>
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