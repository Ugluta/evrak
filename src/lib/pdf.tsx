import { Document, Font, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNjXhFVZNyB1Wk.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/notosans/v36/o-0NIpQlx3QUlC5A4PNb91ZSMULzp-DkFw.ttf', fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSans',
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 72,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 16,
    fontFamily: 'NotoSans',
    fontWeight: 700,
    textAlign: 'center',
    color: '#111827',
    marginBottom: 8,
  },
  meta: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'right',
  },
  content: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 72,
    right: 72,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
})

export function BelgePdf({
  title,
  content,
  date,
}: {
  title: string
  content: string
  date?: string
}) {
  return (
    <Document title={title} author="ogretmenevrak.com" creator="Öğretmen Evrak">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {date && <Text style={styles.meta}>{date}</Text>}
        </View>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.footer} fixed>
          ogretmenevrak.com — Öğretmen Evrak Sistemi
        </Text>
      </Page>
    </Document>
  )
}
