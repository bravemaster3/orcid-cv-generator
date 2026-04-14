import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { registerPdfFonts } from '../../utils/pdfFonts'

registerPdfFonts()

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'DejaVu Serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    borderBottomStyle: 'double',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  email: {
    fontSize: 11,
    color: '#333333',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 20,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 4,
    objectFit: 'cover',
    border: '2px solid #000000',
    flexShrink: 0,
  },
  photoSideContent: {
    flex: 1,
  },
  biography: {
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 15,
  },
  researchInterests: {
    marginBottom: 20,
  },
  researchTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  keywords: {
    fontSize: 11,
    color: '#000000',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 10, // Increased spacing between items
    marginLeft: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // ADD THIS
    gap: 10, // ADD THIS
  },
  itemLeft: {
    flex: 1,
    paddingRight: 10, // ADD THIS - prevents overlap with date
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  itemOrg: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#000000',
    marginTop: 2,
  },
  itemDept: {
    fontSize: 10,
    color: '#333333',
    marginTop: 2,
  },
  itemDate: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'right',
    minWidth: 100, // ADD THIS - ensures date has space
  },
  publicationsList: {
    marginLeft: 25,
  },
  publicationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  publicationNumber: {
    fontSize: 10,
    color: '#000000',
    width: 30,
    textAlign: 'right',
    paddingRight: 4,
  },
  publicationText: {
    flex: 1,
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.4,
  },
  publicationTitle: {
    fontWeight: 'bold',
  },
  publicationJournal: {
    fontStyle: 'italic',
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

function AcademicClassicPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const jobs = normalizeEmployment(employment)
  const edus = normalizeEducation(education)
  const pubs = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header — centered name + email with double border */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          {personal?.emails && personal.emails.length > 0 && (
            <Text style={styles.email}>{personal.emails[0]}</Text>
          )}
        </View>

        {/* Photo left + bio/keywords right when photo present; otherwise stacked */}
        {photo ? (
          <View style={styles.photoRow}>
            <Image src={photo} style={styles.photo} />
            <View style={styles.photoSideContent}>
              {personal?.biography && (
                <Text style={styles.biography}>{personal.biography}</Text>
              )}
              {personal?.keywords && personal.keywords.length > 0 && (
                <View style={styles.researchInterests} wrap={false}>
                  <Text style={styles.researchTitle}>Research Interests</Text>
                  <Text style={styles.keywords}>{personal.keywords.join(' • ')}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <>
            {personal?.biography && (
              <Text style={styles.biography}>{personal.biography}</Text>
            )}
            {personal?.keywords && personal.keywords.length > 0 && (
              <View style={styles.researchInterests} wrap={false}>
                <Text style={styles.researchTitle}>Research Interests</Text>
                <Text style={styles.keywords}>{personal.keywords.join(' • ')}</Text>
              </View>
            )}
          </>
        )}

        {/* Education */}
        {edus.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {edus.map((edu, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{edu.title}</Text>
                    <Text style={styles.itemOrg}>{edu.organization}</Text>
                    {edu.department && <Text style={styles.itemDept}>{edu.department}</Text>}
                  </View>
                  <View>
                    <Text style={styles.itemDate}>{edu.dateRange}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Employment */}
        {jobs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Appointments</Text>
            {jobs.map((job, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{job.title}</Text>
                    <Text style={styles.itemOrg}>{job.organization}</Text>
                    {job.department && <Text style={styles.itemDept}>{job.department}</Text>}
                  </View>
                  <View>
                    <Text style={styles.itemDate}>{job.dateRange}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {pubs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            <View style={styles.publicationsList}>
              {pubs.map((pub, idx) => (
                <View key={idx} style={styles.publicationItem} wrap={false}>
                  <Text style={styles.publicationNumber}>{pub.number}.</Text>
                  <Text style={styles.publicationText}>
                    {pub.authors.length > 0 && formatAuthors(pub.authors, personal?.fullName).map((seg, i) =>
                      <Text key={i} style={seg.bold ? { fontWeight: 'bold' } : {}}>{seg.text}</Text>
                    )}
                    {pub.authors.length > 0 && <Text>{' '}</Text>}
                    {pub.year && <Text>{`(${pub.year}): `}</Text>}
                    <Text style={styles.publicationTitle}>{pub.title}</Text>
                    {pub.journal && <Text style={styles.publicationJournal}>{`. ${pub.journal}`}</Text>}
                    {pub.volume && <Text>{`, ${pub.volume}`}</Text>}
                    {pub.issue && <Text>{`(${pub.issue})`}</Text>}
                    {pub.pages && <Text>{`, ${pub.pages}`}</Text>}
                    {pub.doi && <Link src={`https://doi.org/${pub.doi}`} style={{ color: '#333333' }}>{` https://doi.org/${pub.doi}`}</Link>}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Funding */}
        {grants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grants & Funding</Text>
            {grants.map((grant, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{grant.title}</Text>
                    <Text style={styles.itemOrg}>{grant.organization}</Text>
                  </View>
                  <View>
                    <Text style={styles.itemDate}>{grant.dateRange}</Text>
                  </View>
                </View>
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

export default AcademicClassicPDF