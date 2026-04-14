import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { buildTimelineItems, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { registerPdfFonts } from '../../utils/pdfFonts'

registerPdfFonts()

const INDIGO  = '#6366f1'
const EMERALD = '#10b981'
const DARK    = '#1e293b'
const MID     = '#475569'
const LIGHT   = '#94a3b8'
const RULE    = '#e2e8f0'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'DejaVu Sans',
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    objectFit: 'cover',
    border: `3px solid ${INDIGO}`,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 5,
  },
  email: {
    fontSize: 10,
    color: LIGHT,
    marginBottom: 10,
  },
  biography: {
    fontSize: 10,
    color: MID,
    lineHeight: 1.5,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  keyword: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 8,
    color: INDIGO,
  },
  section: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 8,
    color: MID,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDate: {
    width: 90,
    fontSize: 8,
    color: LIGHT,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 12,
    paddingTop: 2,
  },
  timelineConnector: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
    border: '2px solid #ffffff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: RULE,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 10,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 2,
  },
  timelineOrg: {
    fontSize: 9,
    marginBottom: 1,
  },
  timelineDept: {
    fontSize: 8,
    color: LIGHT,
  },
  publicationItem: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  pubNumber: {
    width: 28,
    fontSize: 9,
    color: MID,
    textAlign: 'right',
    paddingRight: 6,
  },
  pubText: {
    flex: 1,
    fontSize: 9,
    color: DARK,
    lineHeight: 1.4,
  },
  pubJournal: {
    fontStyle: 'italic',
    color: INDIGO,
  },
  fundingItem: {
    marginBottom: 7,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: RULE,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: LIGHT,
  },
})

function TimelinePDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const timelineItems = buildTimelineItems(employment, education)
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
          <Text style={styles.name}>{personal?.fullName}</Text>
          {personal?.emails?.length > 0 && (
            <Text style={styles.email}>{personal.emails[0]}</Text>
          )}
          {personal?.biography && (
            <Text style={styles.biography}>{personal.biography}</Text>
          )}
          {personal?.keywords?.length > 0 && (
            <View style={styles.keywordsContainer}>
              {personal.keywords.map((kw, i) => (
                <Text key={i} style={styles.keyword}>{kw}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Career Timeline — employment (indigo) + education (emerald) interleaved */}
        {timelineItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Academic & Career Timeline</Text>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: INDIGO }]} />
                  <Text style={styles.legendLabel}>Employment</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: EMERALD }]} />
                  <Text style={styles.legendLabel}>Education</Text>
                </View>
              </View>
            </View>

            {timelineItems.map((item, idx) => {
              const dotColor = item.itemType === 'employment' ? INDIGO : EMERALD
              const orgColor = item.itemType === 'employment' ? INDIGO : EMERALD
              return (
                <View key={idx} style={styles.timelineItem} wrap={false}>
                  <Text style={styles.timelineDate}>{item.dateRange}</Text>
                  <View style={styles.timelineConnector}>
                    <View style={[styles.timelineDot, { backgroundColor: dotColor }]} />
                    {idx < timelineItems.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={[styles.timelineOrg, { color: orgColor }]}>{item.organization}</Text>
                    {item.department && <Text style={styles.timelineDept}>{item.department}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Publications — numbered */}
        {pubs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Publications</Text>
            </View>
            {pubs.map((pub, idx) => (
              <View key={idx} style={styles.publicationItem} wrap={false}>
                <Text style={styles.pubNumber}>{pub.number}.</Text>
                <Text style={styles.pubText}>
                  {pub.authors.length > 0 && formatAuthors(pub.authors, personal?.fullName).map((seg, i) =>
                    <Text key={i} style={seg.bold ? { fontWeight: 'bold' } : {}}>{seg.text}</Text>
                  )}
                  {pub.authors.length > 0 && <Text>{' '}</Text>}
                  {pub.year && <Text>{`(${pub.year}): `}</Text>}
                  <Text style={{ fontWeight: 'bold' }}>{pub.title}</Text>
                  {pub.journal && <Text style={styles.pubJournal}>{`. ${pub.journal}`}</Text>}
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Grants & Funding</Text>
            </View>
            {grants.map((grant, idx) => (
              <View key={idx} style={styles.fundingItem} wrap={false}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: DARK }}>{grant.title}</Text>
                <Text style={{ fontSize: 9, color: INDIGO }}>{grant.organization}</Text>
                <Text style={{ fontSize: 8, color: LIGHT }}>{grant.dateRange}</Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

export default TimelinePDF
