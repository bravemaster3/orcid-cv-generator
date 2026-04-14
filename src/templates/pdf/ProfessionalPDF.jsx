import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { registerPdfFonts } from '../../utils/pdfFonts'

registerPdfFonts()

const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: '#ffffff',
      fontFamily: 'DejaVu Sans',
    },
    header: {
      marginBottom: 15,
    },
    name: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: 10,
    },
    headerContent: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 12,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 8,
      objectFit: 'cover',
    },
    headerInfo: {
      flex: 1,
    },
    email: {
      fontSize: 11,
      color: '#475569',
      marginBottom: 10,
    },
    keywordsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10,
    },
    keyword: {
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: 9,
      color: '#475569',
    },
    biography: {
      fontSize: 10,
      color: '#475569',
      lineHeight: 1.6,
    },
    blueLine: {
      width: '100%',
      height: 2,
      backgroundColor: '#3b82f6',
      marginTop: 4,
    },
    section: {
      marginBottom: 20,
      marginTop: 0,
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
      marginBottom: 12,
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
      color: '#0f172a',
      flex: 1,
      paddingRight: 10,
    },
    itemDate: {
      fontSize: 9,
      color: '#64748b',
      fontStyle: 'italic',
      minWidth: 90,
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
      flexDirection: 'row',
      marginBottom: 10,
      paddingLeft: 10,
      borderLeftWidth: 3,
      borderLeftColor: '#e2e8f0',
    },
    publicationNumber: {
      width: 28,
      fontSize: 10,
      color: '#94a3b8',
      textAlign: 'right',
      paddingRight: 6,
    },
    publicationTitle: {
      flex: 1,
      fontSize: 10,
      color: '#1e293b',
      lineHeight: 1.4,
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

function ProfessionalPDF({ data }) {
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
          <Text style={styles.name}>{personal?.fullName}</Text>
          <View style={styles.headerContent}>
            {photo && <Image src={photo} style={styles.photo} />}
            <View style={styles.headerInfo}>
              {personal?.emails && personal.emails.length > 0 && (
                <Text style={styles.email}>{personal.emails[0]}</Text>
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
          </View>
          <View style={styles.blueLine} />
        </View>

        {/* Experience */}
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

        {/* Education */}
        {edus.length > 0 && (
          <View style={styles.section}>
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
                <Text style={styles.publicationNumber}>{pub.number}.</Text>
                <Text style={styles.publicationTitle}>
                  {pub.authors.length > 0 && formatAuthors(pub.authors, personal?.fullName).map((seg, i) =>
                    <Text key={i} style={seg.bold ? { fontWeight: 'bold' } : {}}>{seg.text}</Text>
                  )}
                  {pub.authors.length > 0 && <Text>{' '}</Text>}
                  {pub.year && <Text>{`(${pub.year}): `}</Text>}
                  <Text style={{ fontWeight: 'bold' }}>{pub.title}</Text>
                  {pub.journal && <Text style={styles.publicationJournal}>{`. ${pub.journal}`}</Text>}
                  {pub.volume && <Text>{`, ${pub.volume}`}</Text>}
                  {pub.issue && <Text>{`(${pub.issue})`}</Text>}
                  {pub.pages && <Text>{`, ${pub.pages}`}</Text>}
                  {pub.doi && <Link src={`https://doi.org/${pub.doi}`} style={{ color: '#94a3b8' }}>{` https://doi.org/${pub.doi}`}</Link>}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Funding */}
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

export default ProfessionalPDF