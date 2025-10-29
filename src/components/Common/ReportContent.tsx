import { Page, Text, Document, StyleSheet, View } from "@react-pdf/renderer";

interface ReportContentProps {
  summary: string;
  advice: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  section: {
    marginBottom: 40,
  },
  header: {
    fontSize: 22,
    marginBottom: 2,
    fontWeight: "bold",
  },
  reportHeader: {
    fontSize: 18,
    marginBottom: 40,
    borderBottom: "1px solid black",
    maxWidth: 350,
  },
});

const ReportContent: React.FC<ReportContentProps> = ({ summary, advice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.reportHeader}>Weekly report by Hird</Text>
          <Text style={styles.header}>Summary</Text>
          <Text style={styles.section}>{summary}</Text>
          <Text style={styles.header}>Advice</Text>
          <Text style={styles.section}>{advice}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportContent;
