import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { normalizeEmployment, normalizeEducation, normalizePublications, normalizeFunding, formatAuthors } from '../shared/cvData'
import { registerPdfFonts } from '../../utils/pdfFonts'

registerPdfFonts()

const RED   = '#CC0000'
const DARK  = '#1A1A1A'
const MID   = '#555555'
const LIGHT = '#999999'
const RULE  = '#D4D4D4'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'DejaVu Sans',
    paddingTop: 44,     // 6px bar + 38px breathing room
    paddingBottom: 44,
    paddingHorizontal: 50,
  },
  // Fixed red accent bar — renders on every page edge-to-edge
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 6,
    backgroundColor: RED,
  },
  // ── Header ────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: { flex: 1 },
  name: {
    fontSize: 30,
    fontWeight: 'normal',
    color: DARK,
    letterSpacing: -0.5,
    marginBottom: 7,
  },
  email: {
    fontSize: 9,
    color: MID,
    marginBottom: 14,
  },
  bio: {
    fontSize: 9.5,
    color: DARK,
    lineHeight: 1.75,
    marginBottom: 12,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  keyword: {
    fontSize: 7.5,
    color: RED,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  photo: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    marginLeft: 28,
    flexShrink: 0,
  },
  // ── Dividers ──────────────────────────────────────────────────────────────
  headerRule: {
    height: 1.5,
    backgroundColor: RED,
    marginTop: 8,
    marginBottom: 14,
  },
  // ── Section header: "LABEL ────────────────" ──────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 9,
  },
  sectionLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: RED,
    textTransform: 'uppercase',
    letterSpacing: 2,
    flexShrink: 0,
    paddingRight: 10,
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: RULE,
  },
  // ── Items ─────────────────────────────────────────────────────────────────
  item: { marginBottom: 12 },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: DARK,
    flex: 1,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: LIGHT,
    marginLeft: 12,
    paddingTop: 1.5,
    flexShrink: 0,
  },
  itemOrg: {
    fontSize: 9,
    color: MID,
    marginBottom: 1,
  },
  itemDept: {
    fontSize: 8,
    color: LIGHT,
  },
  // ── Publications ──────────────────────────────────────────────────────────
  pubRow: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  pubNum: {
    width: 22,
    fontSize: 8.5,
    color: LIGHT,
    paddingTop: 1,
    flexShrink: 0,
  },
  pubText: {
    flex: 1,
    fontSize: 8.5,
    color: DARK,
    lineHeight: 1.55,
  },
  pubJournal: {
    fontStyle: 'italic',
    color: MID,
  },
  // ── Footer ────────────────────────────────────────────────────────────────
  pageNumber: {
    position: 'absolute',
    fontSize: 7.5,
    bottom: 16,
    left: 0, right: 0,
    textAlign: 'center',
    color: LIGHT,
  },
})

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  )
}

function SwissMinimalPDF({ data }) {
  const { personal, photo, employment, education, publications, funding } = data
  const jobs   = normalizeEmployment(employment)
  const edus   = normalizeEducation(education)
  const pubs   = normalizePublications(publications)
  const grants = normalizeFunding(funding)

  const hasBody = jobs.length > 0 || edus.length > 0 || pubs.length > 0 || grants.length > 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Red accent bar — fixed so it appears on every page */}
        <View fixed style={styles.topBar} />

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            {personal?.emails?.length > 0 && (
              <Text style={styles.email}>{personal.emails[0]}</Text>
            )}
            {personal?.biography && (
              <Text style={styles.bio}>{personal.biography}</Text>
            )}
            {personal?.keywords?.length > 0 && (
              <View style={styles.keywordsRow}>
                {personal.keywords.map((kw, i) => (
                  <Text key={i} style={styles.keyword}>{kw}</Text>
                ))}
              </View>
            )}
          </View>
          {photo && <Image src={photo} style={styles.photo} />}
        </View>

        {/* Red rule between header and body */}
        {hasBody && <View style={styles.headerRule} />}

        {/* ── Experience ── */}
        {jobs.length > 0 && (
          <View>
            <SectionHeader title="Experience" />
            {jobs.map((job, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{job.title}</Text>
                  <Text style={styles.itemDate}>{job.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{job.organization}</Text>
                {job.department && <Text style={styles.itemDept}>{job.department}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {edus.length > 0 && (
          <View>
            <SectionHeader title="Education" />
            {edus.map((edu, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{edu.title}</Text>
                  <Text style={styles.itemDate}>{edu.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{edu.organization}</Text>
                {edu.department && <Text style={styles.itemDept}>{edu.department}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* ── Grants & Funding ── */}
        {grants.length > 0 && (
          <View>
            <SectionHeader title="Grants & Funding" />
            {grants.map((grant, idx) => (
              <View key={idx} style={styles.item} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{grant.title}</Text>
                  <Text style={styles.itemDate}>{grant.dateRange}</Text>
                </View>
                <Text style={styles.itemOrg}>{grant.organization}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Publications ── */}
        {pubs.length > 0 && (
          <View>
            <SectionHeader title="Publications" />
            {pubs.map((pub, idx) => (
              <View key={idx} style={styles.pubRow} wrap={false}>
                <Text style={styles.pubNum}>{pub.number}.</Text>
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
                  {pub.doi && <Link src={`https://doi.org/${pub.doi}`} style={{ color: LIGHT }}>{` https://doi.org/${pub.doi}`}</Link>}
                </Text>
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

export default SwissMinimalPDF
