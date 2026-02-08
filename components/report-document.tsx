import { Insight, OutputStructure, Recommendation } from "@/types/openai";
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 800,
  },
  subSectionTitle: {
    fontSize: 10,
    marginTop: 12,
    fontWeight: 600,
  },
  paragraph: {
    marginBottom: 6,
  },
  chartContainer: {
    marginVertical: 12,
  },
  tab: {
    marginLeft: 8,
  },
  table: {
    border: "1px black solid",
  },
  tableHeader: {
    border: "1px black solid",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tableRow: {
    border: "1px black solid",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tableCell: { border: "1px black solid", flex: 1, padding: "4px" },
});

interface ReportDocumentProps {
  data: OutputStructure;
}

export default function ReportDocument({ data }: ReportDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* --- Metadata --- */}
        <Text style={styles.title}>{data.metadata.reportTitle}</Text>
        <Text>Date: {data.metadata.analysisDate}</Text>
        <Text>KPI: {data.metadata.kpiName}</Text>
        <Text>Period: {data.metadata.period}</Text>

        {/* --- Executive Summary --- */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.paragraph}>
          {data.executiveSummary.kpiPerformance}
        </Text>

        <Text style={styles.subSectionTitle}>Key Findings</Text>
        {data.executiveSummary.keyFindings.map(
          (finding: string, index: number) => (
            <Text key={index}>- {finding}</Text>
          ),
        )}
        <Text>Top Contributors</Text>
        {/* {data.executiveSummary.topContributors.map((contributor: any) => (
          <Text>
            table format
          </Text>
        ))} */}

        {/* --- KPI Overview --- */}
        <Text style={styles.sectionTitle}>KPI Overview</Text>
        <Text>Current: {data.kpiOverview.current}</Text>
        <Text>Previous: {data.kpiOverview.previousPeriod}</Text>
        <Text>Change in %: {data.kpiOverview.percentageChange}</Text>
        <Text>Target: {data.kpiOverview.target}</Text>
        <Text>Status: {data.kpiOverview.status}</Text>

        {/* --- KPI Overview --- */}
        <Text style={styles.sectionTitle}>
          Variable Analysis - Contribution ranking
        </Text>
        {/* Table format */}
        <Table>
          <TableHeader>
            <TableCell>
              <Text>Rank</Text>
            </TableCell>
            <TableCell>
              <Text>Name</Text>
            </TableCell>
            <TableCell>
              <Text>Contribution score/percentage</Text>
            </TableCell>
            <TableCell>
              <Text>Significance</Text>
            </TableCell>
            <TableCell>
              <Text>Trend</Text>
            </TableCell>
            <TableCell>
              <Text>Insight</Text>
            </TableCell>
          </TableHeader>
          {data.variableAnalysis.contributionRanking.map(
            (variable, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Text>{variable.rank}</Text>
                </TableCell>
                <TableCell>
                  <Text>{variable.variableName}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {variable.contributionScore} /{" "}
                    {variable.contributionPercentage}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{variable.significance}</Text>
                </TableCell>
                <TableCell>
                  <Text>{variable.trend}</Text>
                </TableCell>
                <TableCell>
                  <Text>{variable.insight}</Text>
                </TableCell>
              </TableRow>
            ),
          )}
        </Table>

        {/* --- Tables --- */}
        {data.tables.map((table) => (
          <View key={table.id}>
            <Text style={styles.sectionTitle}>{table.title}</Text>
            <Text style={styles.paragraph}>{table.description}</Text>
            <Table>
              <TableHeader>
                {table.headers.map((header: string) => (
                  <TableCell key={header}>
                    <Text>{header}</Text>
                  </TableCell>
                ))}
              </TableHeader>
              {table.rows.map((row: (string | number)[], index: number) => (
                <TableRow key={index}>
                  {row.map((data) => (
                    <TableCell key={data}>
                      <Text>{data}</Text>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Table>
          </View>
        ))}

        {/* --- Insights --- */}
        <Text style={styles.sectionTitle}>Insights</Text>
        {data.insights.map((insight: Insight, index: number) => {
          return (
            <Fragment key={index}>
              <Text style={styles.subSectionTitle}>{insight.title}</Text>
              <Text>{insight.description}</Text>
              <Text>
                Affected Variables: {insight.affectedVariables.join(", ")}
              </Text>
              <Text>Recommendation:</Text>
              <Text style={styles.tab}>- {insight.recommendation}</Text>
              <Text style={styles.tab}>- Priority: {insight.priority}</Text>
            </Fragment>
          );
        })}

        {/* --- Recommendations (Table format)--- */}
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {data.recommendations.map(
          (recommendation: Recommendation, index: number) => (
            <Text key={index}>
              - [{recommendation.priority}] {recommendation.action} (
              {recommendation.timeframe})
            </Text>
          ),
        )}

        {/* --- Appendix --- */}
        <Text style={styles.sectionTitle}>Appendix</Text>
        <Text>Methodology: {data.appendix.methodology}</Text>
        <Text>Assumptions:</Text>
        {data.appendix.assumptions.map((assumption: string, index: number) => (
          <Text key={index} style={styles.tab}>
            - {assumption}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

interface TableProps {
  children: ReactNode;
}
function Table({ children, ...props }: TableProps) {
  return (
    <View style={styles.table} {...props}>
      {children}
    </View>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}
function TableHeader({ children, ...props }: TableHeaderProps) {
  return (
    <View style={styles.tableHeader} {...props}>
      {children}
    </View>
  );
}

interface TableRowProps {
  children: ReactNode;
}
function TableRow({ children, ...props }: TableRowProps) {
  return (
    <View style={styles.tableRow} {...props}>
      {children}
    </View>
  );
}

interface TableCellProps {
  children: ReactNode;
}
function TableCell({ children, ...props }: TableCellProps) {
  return (
    <View style={styles.tableCell} {...props}>
      {children}
    </View>
  );
}
