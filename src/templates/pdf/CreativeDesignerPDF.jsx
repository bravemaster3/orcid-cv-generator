import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#fef3c7',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#f59e0b',
  },
  content: {
    padding: 35,
    paddingLeft: 45,
  },
  header: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#f59e0b',
  },
  headerTop: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    objectFit: 'cover',
    border: '4px solid #f59e0b',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  email: {
    fontSize: 10,
    color: '#78350f',
    marginBottom: 10,
  },
  biography: {
    fontSize: 9,
    color: '#78350f',
    lineHeight: 1.5,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  keyword: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    color: '#78350f',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 10,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78350f',
    flex: 1,
    paddingRight: 10,
  },
  itemDate: {
    fontSize: 9,
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 90,
  },
  itemOrg: {
    fontSize: 10,
    color: '#92400e',
    marginBottom: 2,
  },
  itemDept: {
    fontSize: 9,
    color: '#a16207',
  },
  publicationItem: {
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
  },
  publicationTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#78350f',
    marginBottom: 2,
  },
  publicationJournal: {
    fontSize: 8,
    color: '#f59e0b',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  publicationMeta: {
    fontSize: 8,
    color: '#a16207',
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

function CreativeDesignerPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const jobs = normalizeEmployment(employment)
  const edus = normalizeEducation(education)
  const pubs = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar} />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {photo && <Image src={photo} style={styles.photo} />}
              <View style={styles.headerText}>
                <Text style={styles.name}>{personal?.fullName}</Text>
                {personal?.emails && personal.emails.length > 0 && (
                  <Text style={styles.email}>{personal.emails[0]}</Text>
                )}
                {personal?.biography && (
                  <Text style={styles.biography}>{personal.biography}</Text>
                )}
              </View>
            </View>
            {personal?.keywords && personal.keywords.length > 0 && (
              <View style={styles.keywordsContainer}>
                {personal.keywords.map((keyword, idx) => (
                  <Text key={idx} style={styles.keyword}>{keyword}</Text>
                ))}
              </View>
            )}
          </View>

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

          {grants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Funding</Text>
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

export default CreativeDesignerPDF