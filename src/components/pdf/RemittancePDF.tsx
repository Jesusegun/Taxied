import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  businessDetails: {
    marginTop: 10,
    fontSize: 10,
    color: '#374151',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    marginTop: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5,
  },
  tableColName: {
    width: '40%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5,
  },
  tableColAmounts: {
    width: '20%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 5,
    textAlign: 'right',
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  tableCell: {
    fontSize: 9,
    color: '#111827',
  },
  tableColTotalLabel: {
    width: '60%',
    padding: 5,
    textAlign: 'right',
  },
  tableColTotalValue: {
    width: '20%',
    padding: 5,
    textAlign: 'right',
    backgroundColor: '#f0fdf4',
  },
  tableCellTotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  signatureBox: {
    marginTop: 40,
    width: 200,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 10,
  }
});

interface PDFProps {
  businessName: string;
  tin: string;
  state: string;
  period: string; // e.g. "March 2026"
  lineItems: {
    employee_name: string;
    taxable_income: string | number;
    paye: string | number;
    net_pay: string | number;
  }[];
  totalPaye: number;
}

const formatCurrency = (val: number) => {
  return val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const RemittancePDF = ({ businessName, tin, state, period, lineItems, totalPaye }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Taxied</Text>
        <Text style={styles.subtitle}>PAYE Remittance Schedule</Text>
        
        <View style={styles.businessDetails}>
          <Text>Business Name: {businessName}</Text>
          <Text>Tax Identification Number: {tin || "N/A"}</Text>
          <Text>State: {state}</Text>
          <Text>Remittance Period: {period}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColName}>
            <Text style={styles.tableCellHeader}>Employee Name</Text>
          </View>
          <View style={styles.tableColAmounts}>
            <Text style={styles.tableCellHeader}>Taxable Income</Text>
          </View>
          <View style={styles.tableColAmounts}>
            <Text style={styles.tableCellHeader}>PAYE Deducted</Text>
          </View>
          <View style={styles.tableColAmounts}>
            <Text style={styles.tableCellHeader}>Net Pay</Text>
          </View>
        </View>

        {/* Table Rows */}
        {lineItems.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableColName}>
              <Text style={styles.tableCell}>{item.employee_name}</Text>
            </View>
            <View style={styles.tableColAmounts}>
              <Text style={styles.tableCell}>{formatCurrency(Number(item.taxable_income))}</Text>
            </View>
            <View style={styles.tableColAmounts}>
              <Text style={styles.tableCell}>{formatCurrency(Number(item.paye))}</Text>
            </View>
            <View style={styles.tableColAmounts}>
              <Text style={styles.tableCell}>{formatCurrency(Number(item.net_pay))}</Text>
            </View>
          </View>
        ))}

        {/* Totals Row */}
        <View style={styles.tableRow}>
          <View style={styles.tableColTotalLabel}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>TOTAL PAYE PAYABLE</Text>
          </View>
          <View style={styles.tableColTotalValue}>
            <Text style={styles.tableCellTotal}>{formatCurrency(totalPaye)}</Text>
          </View>
          <View style={styles.tableColAmounts}>
            <Text style={styles.tableCell}></Text>
          </View>
        </View>
      </View>

      <View style={styles.signatureBox}>
        <Text style={styles.signatureText}>Authorized Signature</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          Generated based on assumed 2025 Nigeria Tax Act rules. Verify with a licensed tax professional.
        </Text>
      </View>
      
    </Page>
  </Document>
);
