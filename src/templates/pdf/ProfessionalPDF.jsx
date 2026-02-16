import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
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

function ProfessionalPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data

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
              
              {/* Biography */}
                {personal?.biography && (
                <Text style={styles.biography}>{personal.biography}</Text>
              )}

              {/* Keywords */}
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
          
          {/* Blue line at the end of header */}
          <View style={styles.blueLine} />
        </View>

        {/* Experience */}
        {employment && employment.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {employment.map((job, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{job.role}</Text>
                  <Text style={styles.itemDate}>
                    {job.startDate} - {job.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={styles.itemOrg}>{job.organization}</Text>
                {job.department && (
                  <Text style={styles.itemDept}>{job.department}</Text>
                )}
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
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.title}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={styles.itemOrg}>{edu.organization}</Text>
                {edu.department && (
                  <Text style={styles.itemDept}>{edu.department}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
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

        {/* Funding */}
        {funding && funding.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grants & Funding</Text>
            {funding.map((grant, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{grant.title}</Text>
                  <Text style={styles.itemDate}>
                    {grant.startDate}
                    {grant.endDate && ` - ${grant.endDate}`}
                  </Text>
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