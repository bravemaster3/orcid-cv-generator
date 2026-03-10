import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding } from '../shared/cvData'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff', // CHANGE to white
    fontFamily: 'Helvetica',
    paddingVertical: 40,
  },
  pageContent: {
    flexDirection: 'row',
    minHeight: '100%', // ADD THIS - make content fill the page
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#1e293b', // ADD BACK the background here
    paddingHorizontal: 30,
    paddingVertical: 40,
    color: '#ffffff',
  },
  sidebarPhoto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    objectFit: 'cover',
    marginBottom: 20,
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  keyword: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 9,
    color: '#e2e8f0',
  },
  mainContent: {
    flex: 1,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemDate: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  itemOrg: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 2,
  },
  itemDept: {
    fontSize: 9,
    color: '#94a3b8',
  },
  publicationItem: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e2e8f0',
  },
  publicationTitle: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 2,
  },
  publicationJournal: {
    fontSize: 9,
    color: '#3b82f6',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  publicationMeta: {
    fontSize: 9,
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

function ExecutivePDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const jobs = normalizeEmployment(employment)
  const edus = normalizeEducation(education)
  const pubs = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.pageContent}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {photo && <Image src={photo} style={styles.sidebarPhoto} />}

          {personal?.biography && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>About</Text>
              <Text style={styles.sidebarText}>{personal.biography}</Text>
            </View>
          )}

          {edus.length > 0 && (
            <View style={styles.sidebarSection} wrap={true}>
              <Text style={styles.sidebarTitle}>Education</Text>
              {edus.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 15 }} wrap={false}>
                  <Text style={{ ...styles.sidebarText, fontWeight: 'bold', marginBottom: 4 }}>{edu.title}</Text>
                  <Text style={styles.sidebarText}>{edu.organization}</Text>
                  <Text style={{ ...styles.sidebarText, fontSize: 9, marginTop: 2 }}>{edu.dateRange}</Text>
                </View>
              ))}
            </View>
          )}

          {personal?.keywords && personal.keywords.length > 0 && (
            <View style={styles.sidebarSection} wrap={false}>
              <Text style={styles.sidebarTitle}>Expertise</Text>
              {personal.keywords.map((keyword, idx) => (
                <Text key={idx} style={styles.keyword}>{keyword}</Text>
              ))}
            </View>
          )}

          {personal?.emails && personal.emails.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Contact</Text>
              <Text style={styles.sidebarText}>{personal.emails[0]}</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          <Text style={styles.tagline}>Professional Profile</Text>

          {jobs.length > 0 && (
            <View style={styles.section}>
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
              <Text style={styles.sectionTitle}>Grants & Funding</Text>
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

export default ExecutivePDF