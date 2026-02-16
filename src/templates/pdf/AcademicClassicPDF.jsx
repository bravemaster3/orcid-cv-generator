import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
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
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  email: {
    fontSize: 11,
    color: '#333333',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 4,
    objectFit: 'cover',
    border: '2px solid #000000',
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
    fontFamily: 'Times-Bold',
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
    fontFamily: 'Times-Bold',
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
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 3, // ADD THIS - space before org
  },
  itemOrg: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
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
    width: 20,
  },
  publicationText: {
    flex: 1,
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.4,
  },
  publicationTitle: {
    fontFamily: 'Times-Bold',
  },
  publicationJournal: {
    fontFamily: 'Times-Italic',
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          {personal?.emails && personal.emails.length > 0 && (
            <Text style={styles.email}>{personal.emails[0]}</Text>
          )}
        </View>

        {photo && (
          <View style={styles.photoContainer}>
            <Image src={photo} style={styles.photo} />
          </View>
        )}

        {/* Biography */}
        {personal?.biography && (
          <Text style={styles.biography}>{personal.biography}</Text>
        )}

        {/* Research Interests */}
        {personal?.keywords && personal.keywords.length > 0 && (
          <View style={styles.researchInterests} wrap={false}>
            <Text style={styles.researchTitle}>Research Interests</Text>
            <Text style={styles.keywords}>
              {personal.keywords.join(' • ')}
            </Text>
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{edu.title}</Text>
                    <Text style={styles.itemOrg}>{edu.organization}</Text>
                    {edu.department && (
                      <Text style={styles.itemDept}>{edu.department}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.itemDate}>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Employment */}
        {employment && employment.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Appointments</Text>
            {employment.map((job, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{job.role}</Text>
                    <Text style={styles.itemOrg}>{job.organization}</Text>
                    {job.department && (
                      <Text style={styles.itemDept}>{job.department}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.itemDate}>
                      {job.startDate} - {job.endDate || 'Present'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {publications && publications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            <View style={styles.publicationsList}>
              {publications.map((pub, idx) => (
                <View key={idx} style={styles.publicationItem} wrap={false}>
                  <Text style={styles.publicationNumber}>{idx + 1}.</Text>
                  <Text style={styles.publicationText}>
                    <Text style={styles.publicationTitle}>{pub.title}.</Text>
                    {pub.journalTitle && (
                      <Text style={styles.publicationJournal}>
                        {' '}{pub.journalTitle}.
                      </Text>
                    )}
                    {pub.year && <Text> ({pub.year}).</Text>}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Funding */}
        {funding && funding.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grants & Funding</Text>
            {funding.map((grant, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemTitle}>{grant.title}</Text>
                    <Text style={styles.itemOrg}>{grant.organization}</Text>
                  </View>
                  <View>
                    <Text style={styles.itemDate}>
                      {grant.startDate}
                      {grant.endDate && ` - ${grant.endDate}`}
                    </Text>
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