import { DocumentData } from "@/features/dashboard/types/dashboard"
import { formatToTitleCase } from "@/utils/string-manipulation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


export async function exportAnalyticsToPDF(results: DocumentData, reportTitle: string) {
  // Create new PDF document
  const doc = new jsPDF()
const date=new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
  weekday: 'short',  // Thu
  day: '2-digit',    // 19
  month: 'short',    // May
  year: 'numeric'    // 2025
});

  // Set document properties
  doc.setProperties({
    title: reportTitle,
    subject: "Document Processing Analytics Report",
    author: "idtech",
    creator: "Analytics Report Generator",
  })

  // Add header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Document Processing Analytics", 20, 25)

  // Add report info
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Report Generated: ${formattedDate}`, 20, 35)
  doc.text(`Total Documents Processed: ${results.documentStats.processedCount}`, 20, 42)

  // Executive Summary
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Executive Summary", 20, 55)

  const summaryData = [
    ["Overall Accuracy", `${results.documentStats.averageAccuracy}%`],
    ["Documents Processed", results.documentStats.processedCount.toString()],
    ["Average Response Time", `${(results.documentStats.averageResponseTime / 1000).toFixed(2)}s`],
    ["Documents with Issues", results.documentStats.flaggedDocumentCount.toString()],
    ["Total Null Fields", results.documentStats.nullFieldsCount.toString()],
    ["Excellent Documents", results.documentCategoryCount.excellent.toString()],
    ["Good Documents", results.documentCategoryCount.good.toString()],
    ["Fair/Poor Documents", (results.documentCategoryCount.fair + results.documentCategoryCount.poor).toString()],
  ]

  autoTable(doc, {
    startY: 60,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 60 },
    },
  })

  // Field Performance Overview
  const summaryFinalY = (doc as unknown as {lastAutoTable:{finalY:number}}).lastAutoTable.finalY || 140

  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Field Performance Overview", 20, summaryFinalY + 15)

  // Prepare field performance data
  const fieldPerformanceData = Object.entries(results.fieldStats).map(([fieldName, stats]) => {
    const totalExtractions = Object.values(stats.category).reduce((sum, count) => sum + count, 0)
    const excellentPercentage = totalExtractions > 0 ? ((stats.category.excellent / totalExtractions) * 100).toFixed(1) : "0"
    const issuesCount = stats.category.fair + stats.category.poor
    const nullCount = results.nullFieldsCount[fieldName] || 0
    const flaggedCount = results.flaggedFieldsCount[fieldName] || 0

    return [
        formatToTitleCase(fieldName),

      `${stats.averageAccuracy}%`,
      totalExtractions.toString(),
      `${excellentPercentage}%`,
      issuesCount.toString(),
      nullCount.toString(),
      flaggedCount.toString()
    ]
  }).sort((a, b) => parseInt(b[1]) - parseInt(a[1])) // Sort by accuracy

  autoTable(doc, {
    startY: summaryFinalY + 20,
    head: [["Field Name", "Avg Accuracy", "Total Extractions", "Excellent %", "Issues", "Null Count", "Flagged"]],
    body: fieldPerformanceData,
    theme: "striped",
    headStyles: { fillColor: [66, 139, 202] },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Field Name
      1: { cellWidth: 25 }, // Avg Accuracy
      2: { cellWidth: 20 }, // Total Extractions
      3: { cellWidth: 20 }, // Excellent %
      4: { cellWidth: 15 }, // Issues
      5: { cellWidth: 20 }, // Null Count
      6: { cellWidth: 15 }, // Flagged
    },
    margin: { left: 20, right: 20 },
    didParseCell: (data) => {
      // Color code accuracy column
      if (data.column.index === 1 && data.section === "body") {
        const accuracy = parseInt(data.cell.text[0].replace("%", ""))
        if (accuracy >= 95) {
          data.cell.styles.textColor = [34, 139, 34] // Green
          data.cell.styles.fillColor = [240, 255, 240]
        } else if (accuracy >= 85) {
          data.cell.styles.textColor = [0, 100, 200] // Blue
        } else if (accuracy >= 70) {
          data.cell.styles.textColor = [255, 140, 0] // Orange
        } else {
          data.cell.styles.textColor = [220, 20, 60] // Red
          data.cell.styles.fillColor = [255, 240, 240]
        }
      }

      // Highlight fields with issues
      if (data.column.index === 4 && data.section === "body") {
        const issues = parseInt(data.cell.text[0])
        if (issues > 0) {
          data.cell.styles.textColor = [220, 20, 60] // Red
          data.cell.styles.fillColor = [255, 235, 238]
        }
      }

      // Highlight fields with high null counts
      if (data.column.index === 5 && data.section === "body") {
        const nullCount = parseInt(data.cell.text[0])
        if (nullCount > 5) {
          data.cell.styles.textColor = [220, 20, 60] // Red
          data.cell.styles.fillColor = [255, 235, 238]
        } else if (nullCount > 2) {
          data.cell.styles.textColor = [255, 140, 0] // Orange
          data.cell.styles.fillColor = [255, 248, 220]
        }
      }

      // Highlight flagged fields
      if (data.column.index === 6 && data.section === "body") {
        const flaggedCount = parseInt(data.cell.text[0])
        if (flaggedCount > 0) {
          data.cell.styles.textColor = [220, 20, 60] // Red
          data.cell.styles.fillColor = [255, 235, 238]
        }
      }
    },
  })

  // Add new page for detailed breakdowns
  doc.addPage()
  
  // Quality Distribution Analysis
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Quality Distribution by Field", 20, 25)

  const qualityDistributionData = Object.entries(results.fieldStats).map(([fieldName, stats]) => {
    const total = Object.values(stats.category).reduce((sum, count) => sum + count, 0)
    
    return [
    formatToTitleCase(fieldName),
      stats.category.excellent.toString(),
      stats.category.good.toString(),
      stats.category.average.toString(),
      stats.category.fair.toString(),
      stats.category.poor.toString(),
      total.toString()
    ]
  }).filter(row => parseInt(row[6]) > 0) 

  autoTable(doc, {
    startY: 30,
    head: [["Field Name", "Excellent", "Good", "Average", "Fair", "Poor", "Total"]],
    body: qualityDistributionData,
    theme: "grid",
    headStyles: { fillColor: [66, 139, 202] },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Field Name
      1: { cellWidth: 20, fillColor: [240, 255, 240] }, // Excellent - light green
      2: { cellWidth: 20, fillColor: [240, 248, 255] }, // Good - light blue
      3: { cellWidth: 20, fillColor: [255, 255, 240] }, // Average - light yellow
      4: { cellWidth: 20, fillColor: [255, 248, 220] }, // Fair - light orange
      5: { cellWidth: 20, fillColor: [255, 240, 240] }, // Poor - light red
      6: { cellWidth: 20 }, // Total
    },
    margin: { left: 20, right: 20 },
  })

  // Problem Fields Analysis
  const qualityFinalY = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY) || 150

  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Problem Fields Analysis", 20, qualityFinalY + 15)

  // Find fields with issues
  const problemFields = Object.entries(results.fieldStats)
    .filter(([fieldName, stats]) => {
      const hasQualityIssues = stats.category.fair > 0 || stats.category.poor > 0
      const hasHighNullCount = (results.nullFieldsCount[fieldName] || 0) > 3
      const hasFlagged = (results.flaggedFieldsCount[fieldName] || 0) > 0
      const lowAccuracy = stats.averageAccuracy < 90
      
      return hasQualityIssues || hasHighNullCount || hasFlagged || lowAccuracy
    })
    .map(([fieldName, stats]) => {
      const issues = []
      
      if (stats.category.fair > 0 || stats.category.poor > 0) {
        issues.push(`Quality issues: ${stats.category.fair + stats.category.poor} cases`)
      }
      if (results.documentStats.processedCount>0&&(results.nullFieldsCount[fieldName]/results.documentStats.processedCount) > .25) {//TODO CALCULATE THIS DYNAMICALLY
        issues.push(`High null count: ${results.nullFieldsCount[fieldName]}`)
      }
      if ((results.flaggedFieldsCount[fieldName] || 0) > 0) {
        issues.push(`Flagged: ${results.flaggedFieldsCount[fieldName]} times`)
      }
      if (stats.averageAccuracy < 90) {
        issues.push(`Low accuracy: ${stats.averageAccuracy}%`)
      }

      return [
        formatToTitleCase(fieldName),
        `${stats.averageAccuracy}%`,
        issues.join("; ")
      ]
    })

  if (problemFields.length > 0) {
    autoTable(doc, {
      startY: qualityFinalY + 20,
      head: [["Field Name", "Accuracy", "Issues Identified"]],
      body: problemFields,
      theme: "grid",
      headStyles: { fillColor: [220, 53, 69] },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Field Name
        1: { cellWidth: 25 }, // Accuracy
        2: { cellWidth: 115 }, // Issues
      },
      margin: { left: 20, right: 20 },
      didParseCell: (data) => {
        if (data.column.index === 1 && data.section === "body") {
          const accuracy = parseInt(data.cell.text[0].replace("%", ""))
          if (accuracy < 80) {
            data.cell.styles.textColor = [220, 20, 60]
            data.cell.styles.fillColor = [255, 235, 238]
          } else if (accuracy < 90) {
            data.cell.styles.textColor = [255, 140, 0]
            data.cell.styles.fillColor = [255, 248, 220]
          }
        }
      },
    })
  } else {
    doc.setFontSize(12)
    doc.setTextColor(34, 139, 34)
    doc.text("✓ No significant issues detected across all fields!", 20, qualityFinalY + 25)
  }

  // Add new page for monthly trends and additional metrics
  doc.addPage()
  
  // Monthly Comparison
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Monthly Performance Comparison", 20, 25)

  const monthlyData = [
    ["Metric", "All Time", "Last Month", "Change"],
    ["Average Accuracy", `${results.documentStats.averageAccuracy}%`, `${results.documentStats.averageAccuracyLastMonth}%`, 
     `${results.documentStats.averageAccuracy - results.documentStats.averageAccuracyLastMonth >= 0 ? '+' : ''}${results.documentStats.averageAccuracy - results.documentStats.averageAccuracyLastMonth}%`],
    ["Documents Processed", results.documentStats.processedCount.toString(), results.documentStats.processedLastMonthCount.toString(),
     `${results.documentStats.processedCount - results.documentStats.processedLastMonthCount >= 0 ? '+' : ''}${results.documentStats.processedCount - results.documentStats.processedLastMonthCount}`],
    ["Avg Response Time", `${(results.documentStats.averageResponseTime / 1000).toFixed(2)}s`, `${(results.documentStats.averageResponseTimeLastMonth / 1000).toFixed(2)}s`,
     `${((results.documentStats.averageResponseTime - results.documentStats.averageResponseTimeLastMonth) / 1000).toFixed(2)}s`],
    ["Flagged Documents", results.documentStats.flaggedDocumentCount.toString(), results.documentStats.flaggedDocumentCountLastMonth.toString(),
     `${results.documentStats.flaggedDocumentCount - results.documentStats.flaggedDocumentCountLastMonth >= 0 ? '+' : ''}${results.documentStats.flaggedDocumentCount - results.documentStats.flaggedDocumentCountLastMonth}`]
  ]

  autoTable(doc, {
    startY: 30,
    head: [monthlyData[0]],
    body: monthlyData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === "body") {
        const changeText = data.cell.text[0]
        if (changeText.startsWith('+')) {
          data.cell.styles.textColor = [34, 139, 34] // Green for positive changes
        } else if (changeText.startsWith('-')) {
          data.cell.styles.textColor = [220, 20, 60] // Red for negative changes
        }
      }
    },
  })


  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10)
  }

  // Save the PDF
  doc.save(`${reportTitle}-${formattedDate}.pdf`)
}