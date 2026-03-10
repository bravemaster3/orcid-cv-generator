import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },
  photoContainer: {
    marginRight: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: 'cover',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  biography: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  email: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  keyword: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    color: '#4b5563',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  item: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 15, // ADD THIS - creates space between title and date
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1, // ADD THIS - allows title to take space but not overflow
    paddingRight: 10, // ADD THIS - extra padding before date
  },
  itemDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  itemOrg: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'medium',
    marginBottom: 2,
  },
  itemDept: {
    fontSize: 9,
    color: '#6b7280',
  },
  publicationItem: {
    marginBottom: 10,
  },
  publicationTitle: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  publicationJournal: {
    fontSize: 9,
    color: '#4b5563',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  publicationMeta: {
    fontSize: 9,
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

function ModernMinimalPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const jobs = normalizeEmployment(employment)
  const edus = normalizeEducation(education)
  const pubs = normalizePublications(publications)
  const grants = normalizeFunding(funding)

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
          <View style={styles.headerText}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            {personal?.biography && (
              <Text style={styles.biography}>{personal.biography}</Text>
            )}
            {personal?.emails && personal.emails.length > 0 && (
              <Text style={styles.email}>{personal.emails[0]}</Text>
            )}
            {personal?.keywords && personal.keywords.length > 0 && (
              <View style={styles.keywordsContainer}>
                {personal.keywords.map((keyword, idx) => (
                  <Text key={idx} style={styles.keyword}>{keyword}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Employment */}
        {jobs.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {jobs.map((job, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{job.title}</Text>
                  <Text style={styles.itemDate}>{job.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{job.organization}</Text>
                {job.department && <Text style={styles.itemDept}>{job.department}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {edus.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {edus.map((edu, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.title}</Text>
                  <Text style={styles.itemDate}>{edu.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{edu.organization}</Text>
                {edu.department && <Text style={styles.itemDept}>{edu.department}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {pubs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            {pubs.map((pub, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.publicationTitle}>{pub.title}</Text>
                {pub.journal && <Text style={styles.publicationJournal}>{pub.journal}</Text>}
                {pub.meta && <Text style={styles.publicationMeta}>{pub.meta}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Funding */}
        {grants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding & Grants</Text>
            {grants.map((grant, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{grant.title}</Text>
                  <Text style={styles.itemDate}>{grant.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{grant.organization}</Text>
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

export default ModernMinimalPDF